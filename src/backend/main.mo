import Map "mo:core/Map";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // State initialization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Types
  type LawyerId = Principal;

  type Booking = {
    bookingId : Nat;
    clientId : Principal;
    lawyerId : LawyerId;
    slot : Time.Time;
    duration : Nat;
    fee : Nat;
    status : BookingStatus;
  };

  type BookingStatus = {
    #pending;
    #confirmed;
    #cancelled;
    #completed;
  };

  type LawyerStatus = {
    #basic;
    #pro;
  };

  type LawyerProfile = {
    id : LawyerId;
    name : Text;
    bio : Text;
    credentials : [Text];
    areasOfExpertise : [Text];
    languages : [Text];
    fee : Nat;
    consultationsOffered : Nat;
    status : LawyerStatus;
    reviews : [Review];
  };

  module LawyerProfile {
    public func compare(lawyer1 : LawyerProfile, lawyer2 : LawyerProfile) : Order.Order {
      Text.compare(lawyer1.name, lawyer2.name);
    };
  };

  type Review = {
    rating : Nat;
    comment : Text;
  };

  type UserRole = {
    #client;
    #lawyer;
  };

  module UserRole {
    public func compare(role1 : UserRole, role2 : UserRole) : Order.Order {
      switch (role1, role2) {
        case (#client, #client) { #equal };
        case (#lawyer, #lawyer) { #equal };
        case (#client, #lawyer) { #less };
        case (#lawyer, #client) { #greater };
      };
    };
  };

  public type UserProfile = {
    name : Text;
    role : ?UserRole;
  };

  // State
  let lawyerProfiles = Map.empty<LawyerId, LawyerProfile>();
  let bookings = Map.empty<Nat, Booking>();
  let userRoles = Map.empty<Principal, UserRole>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextBookingId = 1;

  // User Profile Management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Onboarding
  public shared ({ caller }) func completeOnboarding(role : UserRole) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can complete onboarding");
    };

    switch (userRoles.get(caller)) {
      case (null) {
        userRoles.add(caller, role);
      };
      case (?existingRole) {
        if (AccessControl.isAdmin(accessControlState, caller)) {
          userRoles.add(caller, role);
        } else if (existingRole == role) {
          Runtime.trap("You are already onboarded as this role.");
        } else {
          Runtime.trap("You are not authorized to change your role.");
        };
      };
    };
  };

  // Lawyer Directory
  public query ({ caller }) func findLawyers() : async [LawyerProfile] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access the legal directory");
    };

    switch (userRoles.get(caller)) {
      case (?#client) {};
      case (?#lawyer) {};
      case (null) {
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Please complete onboarding first");
        };
      };
    };

    lawyerProfiles.values().toArray().sort();
  };

  // Booking Management
  public shared ({ caller }) func bookConsultation(
    lawyerId : LawyerId,
    slot : Time.Time,
    duration : Nat,
    fee : Nat
  ) : async {
    bookingId : Nat;
  } {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can book consultations");
    };

    switch (userRoles.get(caller)) {
      case (?#client) {};
      case (_) {
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only clients can book consultations");
        };
      };
    };

    switch (lawyerProfiles.get(lawyerId)) {
      case (null) { Runtime.trap("Lawyer not found") };
      case (?_) {};
    };

    for (booking in bookings.values()) {
      if (booking.lawyerId == lawyerId and booking.slot == slot and (booking.status == #pending or booking.status == #confirmed)) {
        Runtime.trap("Slot already booked.");
      };
    };

    let bookingId = nextBookingId;
    nextBookingId += 1;

    let booking : Booking = {
      bookingId;
      clientId = caller;
      lawyerId;
      slot;
      duration;
      fee;
      status = #pending;
    };

    bookings.add(bookingId, booking);
    { bookingId };
  };

  public shared ({ caller }) func updateBookingStatus(bookingId : Nat, newStatus : BookingStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update bookings");
    };

    switch (bookings.get(bookingId)) {
      case (null) { Runtime.trap("Booking not found") };
      case (?booking) {
        let isLawyer = (caller == booking.lawyerId and userRoles.get(caller) == ?#lawyer);
        let isClient = (caller == booking.clientId and userRoles.get(caller) == ?#client);
        let isAdmin = AccessControl.isAdmin(accessControlState, caller);

        if (not (isLawyer or isClient or isAdmin)) {
          Runtime.trap("Unauthorized: Only the lawyer, client, or admin can update this booking");
        };

        let updatedBooking = {
          bookingId = booking.bookingId;
          clientId = booking.clientId;
          lawyerId = booking.lawyerId;
          slot = booking.slot;
          duration = booking.duration;
          fee = booking.fee;
          status = newStatus;
        };

        bookings.add(bookingId, updatedBooking);
      };
    };
  };

  // Client Dashboard
  public query ({ caller }) func getClientDashboard() : async ([Booking], [LawyerProfile]) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access dashboard");
    };

    switch (userRoles.get(caller)) {
      case (?#client) {};
      case (_) {
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only clients can access client dashboard");
        };
      };
    };

    let clientBookings = bookings.values().filter(
      func(booking) { booking.clientId == caller }
    ).toArray();

    let savedLawyersArray = lawyerProfiles.values().toArray().sort();
    (clientBookings, savedLawyersArray);
  };

  // Lawyer Dashboard
  public query ({ caller }) func getLawyerDashboard(lawyerId : LawyerId) : async (LawyerProfile, [Booking], { confirmed : Nat; pending : Nat }) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can access dashboard");
    };

    let isOwnDashboard = (caller == lawyerId);
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    if (not (isOwnDashboard or isAdmin)) {
      Runtime.trap("Unauthorized: You can only access your own lawyer dashboard");
    };

    switch (userRoles.get(lawyerId)) {
      case (?#lawyer) {};
      case (_) {
        if (not isAdmin) {
          Runtime.trap("Unauthorized: User is not a lawyer");
        };
      };
    };

    switch (lawyerProfiles.get(lawyerId)) {
      case (null) { Runtime.trap("Lawyer profile not found") };
      case (?lawyer) {
        let lawyerBookings = bookings.values().filter(
          func(booking) { booking.lawyerId == lawyerId }
        ).toArray();

        var confirmed = 0;
        var pending = 0;

        for (booking in lawyerBookings.values()) {
          switch (booking.status) {
            case (#confirmed) { confirmed += 1 };
            case (#pending) { pending += 1 };
            case (_) {};
          };
        };

        let summary = { confirmed; pending };
        (lawyer, lawyerBookings, summary);
      };
    };
  };

  // Lawyer Profile Management
  public shared ({ caller }) func createLawyerProfile(
    name : Text,
    bio : Text,
    credentials : [Text],
    areasOfExpertise : [Text],
    languages : [Text],
    fee : Nat
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create lawyer profiles");
    };

    switch (userRoles.get(caller)) {
      case (?#lawyer) {};
      case (_) {
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only lawyers can create lawyer profiles");
        };
      };
    };

    let profile : LawyerProfile = {
      id = caller;
      name;
      bio;
      credentials;
      areasOfExpertise;
      languages;
      fee;
      consultationsOffered = 0;
      status = #basic;
      reviews = [];
    };

    lawyerProfiles.add(caller, profile);
  };

  public shared ({ caller }) func updateLawyerProfile(
    lawyerId : LawyerId,
    name : Text,
    bio : Text,
    credentials : [Text],
    areasOfExpertise : [Text],
    languages : [Text],
    fee : Nat
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can update profiles");
    };

    let isOwnProfile = (caller == lawyerId);
    let isAdmin = AccessControl.isAdmin(accessControlState, caller);

    if (not (isOwnProfile or isAdmin)) {
      Runtime.trap("Unauthorized: You can only update your own profile");
    };

    switch (lawyerProfiles.get(lawyerId)) {
      case (null) { Runtime.trap("Lawyer profile not found") };
      case (?existingProfile) {
        let updatedProfile : LawyerProfile = {
          id = existingProfile.id;
          name;
          bio;
          credentials;
          areasOfExpertise;
          languages;
          fee;
          consultationsOffered = existingProfile.consultationsOffered;
          status = existingProfile.status;
          reviews = existingProfile.reviews;
        };

        lawyerProfiles.add(lawyerId, updatedProfile);
      };
    };
  };

  // Reviews
  public shared ({ caller }) func addReview(lawyerId : LawyerId, rating : Nat, comment : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can add reviews");
    };

    switch (userRoles.get(caller)) {
      case (?#client) {};
      case (_) {
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only clients can add reviews");
        };
      };
    };

    let hasCompletedBooking = bookings.values().any(
      func(booking) {
        booking.clientId == caller and booking.lawyerId == lawyerId and booking.status == #completed
      }
    );

    if (not hasCompletedBooking and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: You can only review lawyers after a completed consultation");
    };

    switch (lawyerProfiles.get(lawyerId)) {
      case (null) { Runtime.trap("Lawyer not found") };
      case (?lawyer) {
        let newReview : Review = { rating; comment };
        let updatedReviews = lawyer.reviews.concat([newReview]);

        let updatedProfile : LawyerProfile = {
          id = lawyer.id;
          name = lawyer.name;
          bio = lawyer.bio;
          credentials = lawyer.credentials;
          areasOfExpertise = lawyer.areasOfExpertise;
          languages = lawyer.languages;
          fee = lawyer.fee;
          consultationsOffered = lawyer.consultationsOffered;
          status = lawyer.status;
          reviews = updatedReviews;
        };

        lawyerProfiles.add(lawyerId, updatedProfile);
      };
    };
  };

  // Admin Functions
  public shared ({ caller }) func adminDeleteBooking(bookingId : Nat) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete bookings");
    };

    if (bookings.get(bookingId) == null) { Runtime.trap("Booking not found") };
    ignore bookings.remove(bookingId);
  };

  public shared ({ caller }) func adminDeleteLawyerProfile(lawyerId : LawyerId) : async () {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can delete lawyer profiles");
    };

    if (lawyerProfiles.get(lawyerId) == null) { Runtime.trap("Lawyer profile not found") };
    ignore lawyerProfiles.remove(lawyerId);
  };

  public query ({ caller }) func adminGetAllBookings() : async [Booking] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all bookings");
    };

    bookings.values().toArray();
  };

  public query ({ caller }) func adminGetAllUsers() : async [(Principal, UserRole)] {
    if (not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Only admins can view all users");
    };

    userRoles.entries().toArray();
  };
};

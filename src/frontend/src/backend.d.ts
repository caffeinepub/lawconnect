import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Time = bigint;
export type LawyerId = Principal;
export interface Booking {
    fee: bigint;
    status: BookingStatus;
    duration: bigint;
    clientId: Principal;
    bookingId: bigint;
    slot: Time;
    lawyerId: LawyerId;
}
export interface LawyerProfile {
    id: LawyerId;
    bio: string;
    fee: bigint;
    consultationsOffered: bigint;
    status: LawyerStatus;
    reviews: Array<Review>;
    areasOfExpertise: Array<string>;
    name: string;
    languages: Array<string>;
    credentials: Array<string>;
}
export interface UserProfile {
    name: string;
    role?: UserRole;
}
export interface Review {
    comment: string;
    rating: bigint;
}
export enum BookingStatus {
    cancelled = "cancelled",
    pending = "pending",
    completed = "completed",
    confirmed = "confirmed"
}
export enum LawyerStatus {
    pro = "pro",
    basic = "basic"
}
export enum UserRole {
    client = "client",
    lawyer = "lawyer"
}
export enum UserRole__1 {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addReview(lawyerId: LawyerId, rating: bigint, comment: string): Promise<void>;
    adminDeleteBooking(bookingId: bigint): Promise<void>;
    adminDeleteLawyerProfile(lawyerId: LawyerId): Promise<void>;
    adminGetAllBookings(): Promise<Array<Booking>>;
    adminGetAllUsers(): Promise<Array<[Principal, UserRole]>>;
    assignCallerUserRole(user: Principal, role: UserRole__1): Promise<void>;
    bookConsultation(lawyerId: LawyerId, slot: Time, duration: bigint, fee: bigint): Promise<{
        bookingId: bigint;
    }>;
    completeOnboarding(role: UserRole): Promise<void>;
    createLawyerProfile(name: string, bio: string, credentials: Array<string>, areasOfExpertise: Array<string>, languages: Array<string>, fee: bigint): Promise<void>;
    findLawyers(): Promise<Array<LawyerProfile>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole__1>;
    getClientDashboard(): Promise<[Array<Booking>, Array<LawyerProfile>]>;
    getLawyerDashboard(lawyerId: LawyerId): Promise<[LawyerProfile, Array<Booking>, {
            pending: bigint;
            confirmed: bigint;
        }]>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateBookingStatus(bookingId: bigint, newStatus: BookingStatus): Promise<void>;
    updateLawyerProfile(lawyerId: LawyerId, name: string, bio: string, credentials: Array<string>, areasOfExpertise: Array<string>, languages: Array<string>, fee: bigint): Promise<void>;
}

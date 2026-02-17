import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, UserRole, LawyerProfile, Booking, BookingStatus, LawyerId } from '../backend';
import { Principal } from '@dfinity/principal';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useCompleteOnboarding() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (role: UserRole) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeOnboarding(role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useFindLawyers() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<LawyerProfile[]>({
    queryKey: ['lawyers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.findLawyers();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetClientDashboard() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<[Booking[], LawyerProfile[]]>({
    queryKey: ['clientDashboard'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getClientDashboard();
    },
    enabled: !!actor && !actorFetching,
    refetchInterval: 10000,
  });
}

export function useGetLawyerDashboard(lawyerId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<[LawyerProfile, Booking[], { pending: bigint; confirmed: bigint }]>({
    queryKey: ['lawyerDashboard', lawyerId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getLawyerDashboard(Principal.fromText(lawyerId));
    },
    enabled: !!actor && !actorFetching && !!lawyerId,
    refetchInterval: 10000,
  });
}

export function useBookConsultation() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lawyerId,
      slot,
      duration,
      fee,
    }: {
      lawyerId: string;
      slot: bigint;
      duration: bigint;
      fee: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.bookConsultation(Principal.fromText(lawyerId), slot, duration, fee);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['lawyers'] });
    },
  });
}

export function useUpdateBookingStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: bigint; status: BookingStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateBookingStatus(bookingId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['lawyerDashboard'] });
    },
  });
}

export function useCreateLawyerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      name,
      bio,
      credentials,
      areasOfExpertise,
      languages,
      fee,
    }: {
      name: string;
      bio: string;
      credentials: string[];
      areasOfExpertise: string[];
      languages: string[];
      fee: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createLawyerProfile(name, bio, credentials, areasOfExpertise, languages, fee);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lawyers'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useUpdateLawyerProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lawyerId,
      name,
      bio,
      credentials,
      areasOfExpertise,
      languages,
      fee,
    }: {
      lawyerId: string;
      name: string;
      bio: string;
      credentials: string[];
      areasOfExpertise: string[];
      languages: string[];
      fee: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLawyerProfile(
        Principal.fromText(lawyerId),
        name,
        bio,
        credentials,
        areasOfExpertise,
        languages,
        fee
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lawyers'] });
      queryClient.invalidateQueries({ queryKey: ['lawyerDashboard'] });
    },
  });
}

export function useAddReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      lawyerId,
      rating,
      comment,
    }: {
      lawyerId: string;
      rating: bigint;
      comment: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addReview(Principal.fromText(lawyerId), rating, comment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lawyers'] });
      queryClient.invalidateQueries({ queryKey: ['lawyerDashboard'] });
    },
  });
}

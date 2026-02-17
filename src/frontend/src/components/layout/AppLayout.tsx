import { Outlet, useNavigate } from '@tanstack/react-router';
import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AppLayout() {
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (isFetched) {
      if (!userProfile) {
        navigate({ to: '/profile-setup' });
      } else if (!userProfile.role) {
        navigate({ to: '/onboarding' });
      }
    }
  }, [userProfile, isFetched, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
}

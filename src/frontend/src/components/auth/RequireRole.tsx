import { useGetCallerUserProfile } from '../../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Loader2, ShieldAlert } from 'lucide-react';
import { UserRole } from '../../backend';

export default function RequireRole({ role, children }: { role: UserRole; children: React.ReactNode }) {
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (isFetched && userProfile) {
      if (!userProfile.role) {
        navigate({ to: '/onboarding' });
      } else if (userProfile.role !== role) {
        // Redirect to appropriate dashboard
        if (userProfile.role === UserRole.client) {
          navigate({ to: '/client-dashboard' });
        } else if (userProfile.role === UserRole.lawyer) {
          navigate({ to: '/lawyer-dashboard' });
        }
      }
    }
  }, [userProfile, isFetched, role, navigate]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!userProfile?.role || userProfile.role !== role) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <ShieldAlert className="mx-auto h-12 w-12 text-destructive" />
          <h2 className="mt-4 text-xl font-semibold">Access Denied</h2>
          <p className="mt-2 text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

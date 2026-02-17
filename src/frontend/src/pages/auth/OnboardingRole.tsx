import { useState } from 'react';
import { useGetCallerUserProfile, useCompleteOnboarding } from '../../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Scale, User } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '../../backend';

export default function OnboardingRole() {
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const completeOnboarding = useCompleteOnboarding();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  useEffect(() => {
    if (isFetched && !userProfile) {
      navigate({ to: '/profile-setup' });
    } else if (isFetched && userProfile?.role) {
      if (userProfile.role === UserRole.client) {
        navigate({ to: '/client-dashboard' });
      } else if (userProfile.role === UserRole.lawyer) {
        navigate({ to: '/lawyer-dashboard' });
      }
    }
  }, [userProfile, isFetched, navigate]);

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      toast.error('Please select a role');
      return;
    }

    try {
      await completeOnboarding.mutateAsync(selectedRole);
      toast.success('Onboarding completed successfully');
      if (selectedRole === UserRole.client) {
        navigate({ to: '/client-dashboard' });
      } else {
        navigate({ to: '/lawyer-dashboard' });
      }
    } catch (error) {
      toast.error('Failed to complete onboarding');
      console.error(error);
    }
  };

  if (profileLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/20 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Choose Your Role</CardTitle>
          <CardDescription>Select how you'd like to use LawConnect</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <button
              onClick={() => setSelectedRole(UserRole.client)}
              className={`group relative overflow-hidden rounded-lg border-2 p-6 text-left transition-all hover:shadow-lg ${
                selectedRole === UserRole.client
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex flex-col items-center space-y-4">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full ${
                    selectedRole === UserRole.client ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  <User className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">I'm a Client</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Find verified lawyers, book consultations, and get legal help
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setSelectedRole(UserRole.lawyer)}
              className={`group relative overflow-hidden rounded-lg border-2 p-6 text-left transition-all hover:shadow-lg ${
                selectedRole === UserRole.lawyer
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              <div className="flex flex-col items-center space-y-4">
                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-full ${
                    selectedRole === UserRole.lawyer ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  <Scale className="h-8 w-8" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold">I'm a Lawyer</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Create your profile, manage bookings, and connect with clients
                  </p>
                </div>
              </div>
            </button>
          </div>

          <Button
            onClick={handleRoleSelection}
            className="mt-6 w-full"
            disabled={!selectedRole || completeOnboarding.isPending}
          >
            {completeOnboarding.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : (
              'Continue'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Scale, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function PublicHeader() {
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Scale className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">LawConnect</span>
        </Link>

        <nav className="hidden items-center space-x-6 md:flex">
          <Link to="/find-lawyers" className="text-sm font-medium transition-colors hover:text-primary">
            Find a Lawyer
          </Link>
          <Link to="/join-as-lawyer" className="text-sm font-medium transition-colors hover:text-primary">
            Join as a Lawyer
          </Link>
          <Link to="/client-plans" className="text-sm font-medium transition-colors hover:text-primary">
            Pricing
          </Link>
        </nav>

        <div className="hidden items-center space-x-4 md:flex">
          <Button onClick={handleAuth} disabled={disabled} variant={isAuthenticated ? 'outline' : 'default'}>
            {loginStatus === 'logging-in'
              ? 'Logging in...'
              : isAuthenticated
                ? 'Logout'
                : 'Login'}
          </Button>
        </div>

        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t bg-background p-4 md:hidden">
          <nav className="flex flex-col space-y-4">
            <Link
              to="/find-lawyers"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find a Lawyer
            </Link>
            <Link
              to="/join-as-lawyer"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Join as a Lawyer
            </Link>
            <Link
              to="/client-plans"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Button onClick={handleAuth} disabled={disabled} variant={isAuthenticated ? 'outline' : 'default'}>
              {loginStatus === 'logging-in'
                ? 'Logging in...'
                : isAuthenticated
                  ? 'Logout'
                  : 'Login'}
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

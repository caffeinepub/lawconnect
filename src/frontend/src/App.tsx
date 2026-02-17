import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import Home from './pages/marketing/Home';
import FindLawyers from './pages/directory/FindLawyers';
import LawyerProfile from './pages/lawyers/LawyerProfile';
import JoinAsLawyer from './pages/lawyers/JoinAsLawyer';
import ClientDashboard from './pages/dashboard/ClientDashboard';
import LawyerDashboard from './pages/dashboard/LawyerDashboard';
import BookConsultation from './pages/booking/BookConsultation';
import Chat from './pages/chat/Chat';
import ClientPlans from './pages/subscriptions/ClientPlans';
import LawyerPlans from './pages/subscriptions/LawyerPlans';
import ProfileSetup from './pages/auth/ProfileSetup';
import OnboardingRole from './pages/auth/OnboardingRole';
import PublicLayout from './components/layout/PublicLayout';
import AppLayout from './components/layout/AppLayout';
import RequireAuth from './components/auth/RequireAuth';
import RequireRole from './components/auth/RequireRole';
import { UserRole } from './backend';

const rootRoute = createRootRoute({
  component: () => {
    return (
      <>
        <RouterProvider router={router} />
        <Toaster />
      </>
    );
  },
});

const publicLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'public',
  component: PublicLayout,
});

const homeRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/',
  component: Home,
});

const findLawyersRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/find-lawyers',
  component: FindLawyers,
});

const lawyerProfileRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/lawyers/$lawyerId',
  component: LawyerProfile,
});

const joinAsLawyerRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/join-as-lawyer',
  component: JoinAsLawyer,
});

const clientPlansRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/client-plans',
  component: ClientPlans,
});

const lawyerPlansRoute = createRoute({
  getParentRoute: () => publicLayoutRoute,
  path: '/lawyer-plans',
  component: LawyerPlans,
});

const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'auth',
  component: () => (
    <RequireAuth>
      <AppLayout />
    </RequireAuth>
  ),
});

const profileSetupRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/profile-setup',
  component: ProfileSetup,
});

const onboardingRoleRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/onboarding',
  component: OnboardingRole,
});

const clientDashboardRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/client-dashboard',
  component: () => (
    <RequireRole role={UserRole.client}>
      <ClientDashboard />
    </RequireRole>
  ),
});

const lawyerDashboardRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/lawyer-dashboard',
  component: () => (
    <RequireRole role={UserRole.lawyer}>
      <LawyerDashboard />
    </RequireRole>
  ),
});

const bookConsultationRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/book/$lawyerId',
  component: () => (
    <RequireRole role={UserRole.client}>
      <BookConsultation />
    </RequireRole>
  ),
});

const chatRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: '/chat',
  component: Chat,
});

const routeTree = rootRoute.addChildren([
  publicLayoutRoute.addChildren([
    homeRoute,
    findLawyersRoute,
    lawyerProfileRoute,
    joinAsLawyerRoute,
    clientPlansRoute,
    lawyerPlansRoute,
  ]),
  authLayoutRoute.addChildren([
    profileSetupRoute,
    onboardingRoleRoute,
    clientDashboardRoute,
    lawyerDashboardRoute,
    bookConsultationRoute,
    chatRoute,
  ]),
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}

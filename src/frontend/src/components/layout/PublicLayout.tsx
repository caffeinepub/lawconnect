import { Outlet } from '@tanstack/react-router';
import PublicHeader from '../nav/PublicHeader';
import PublicFooter from '../nav/PublicFooter';

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}

import { Link } from '@tanstack/react-router';
import { Scale, Heart } from 'lucide-react';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();
  const appIdentifier = typeof window !== 'undefined' ? window.location.hostname : 'lawconnect';

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Scale className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">LawConnect</span>
            </div>
            <p className="text-sm text-muted-foreground">Legal help, simplified.</p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">For Clients</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/find-lawyers" className="text-muted-foreground hover:text-foreground">
                  Find a Lawyer
                </Link>
              </li>
              <li>
                <Link to="/client-plans" className="text-muted-foreground hover:text-foreground">
                  Pricing Plans
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">For Lawyers</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/join-as-lawyer" className="text-muted-foreground hover:text-foreground">
                  Join as a Lawyer
                </Link>
              </li>
              <li>
                <Link to="/lawyer-plans" className="text-muted-foreground hover:text-foreground">
                  Lawyer Plans
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-foreground">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © {currentYear} LawConnect. Built with <Heart className="h-4 w-4 fill-red-500 text-red-500" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(appIdentifier)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}

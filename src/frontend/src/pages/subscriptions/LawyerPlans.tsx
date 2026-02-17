import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

export default function LawyerPlans() {
  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Lawyer Subscription Plans</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Grow your practice with LawConnect
        </p>
      </div>

      <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Basic</CardTitle>
            <CardDescription>Get started with your online presence</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">GHC 199</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">Profile listing in directory</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">Accept client bookings</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">Client messaging</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">Basic dashboard</span>
              </li>
            </ul>
            <Button className="w-full" variant="outline">
              Get Started
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary">
          <CardHeader>
            <Badge className="w-fit">Recommended</Badge>
            <CardTitle>Pro</CardTitle>
            <CardDescription>Maximize your visibility and leads</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">GHC 499</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">Featured listing with badge</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">Priority placement in search</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">Analytics dashboard</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">Lead notifications</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">Priority support</span>
              </li>
            </ul>
            <Button className="w-full">Upgrade to Pro</Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          All plans include secure payment processing and client management tools
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/join-as-lawyer">Create Your Profile</Link>
        </Button>
      </div>
    </div>
  );
}

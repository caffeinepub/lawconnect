import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle } from 'lucide-react';

export default function ClientPlans() {
  return (
    <div className="container py-12">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight">Client Subscription Plans</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Choose the plan that fits your legal needs
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Starter</CardTitle>
            <CardDescription>Perfect for occasional legal needs</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">GHC 99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">Access to lawyer directory</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">1 discounted consultation per month</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">Legal document templates</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">Email support</span>
              </li>
            </ul>
            <Button className="w-full" variant="outline">
              Get Started
            </Button>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary">
          <CardHeader>
            <Badge className="w-fit">Most Popular</Badge>
            <CardTitle>Professional</CardTitle>
            <CardDescription>For individuals with regular legal needs</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">GHC 299</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">3 consultations per month</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">Priority booking</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">Document review service</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">Priority email & chat support</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">Document vault access</span>
              </li>
            </ul>
            <Button className="w-full">Get Started</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Business</CardTitle>
            <CardDescription>Comprehensive legal support for businesses</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">GHC 899</span>
              <span className="text-muted-foreground">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">Dedicated lawyer for your business</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">Unlimited consultations (fair use)</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">Contract drafting & review</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">Legal risk audit</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                <span className="text-sm">24/7 priority support</span>
              </li>
            </ul>
            <Button className="w-full" variant="outline">
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-12 text-center">
        <p className="text-sm text-muted-foreground">
          All plans include access to our secure platform and verified lawyers
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link to="/find-lawyers">Browse Lawyers</Link>
        </Button>
      </div>
    </div>
  );
}

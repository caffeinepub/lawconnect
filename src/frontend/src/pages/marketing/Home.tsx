import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, Calendar, CheckCircle, Star, Building2 } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20 md:py-32">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  Legal help, simplified
                </Badge>
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
                  Book a Trusted Lawyer in Minutes
                </h1>
                <p className="text-lg text-muted-foreground md:text-xl">
                  Connect with verified legal professionals, schedule consultations, and get the legal support you
                  need—all in one platform.
                </p>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="text-base">
                  <Link to="/find-lawyers">Find a Lawyer</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="text-base">
                  <Link to="/join-as-lawyer">Join as a Lawyer</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="/assets/generated/lawconnect-hero-illustration.dim_1600x900.png"
                alt="Legal consultation"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
            <p className="mt-4 text-lg text-muted-foreground">Get legal help in three simple steps</p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Card className="border-2">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Search className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>1. Search by Legal Issue</CardTitle>
                <CardDescription>
                  Browse our directory of verified lawyers by practice area, location, and expertise
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>2. Compare Lawyers</CardTitle>
                <CardDescription>
                  Review profiles, credentials, ratings, and consultation fees to find the right match
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-2">
              <CardHeader>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Calendar className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>3. Book & Consult</CardTitle>
                <CardDescription>
                  Schedule a consultation at your convenience and get expert legal advice
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Subscription Plans Preview */}
      <section className="bg-muted/30 py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Choose Your Plan</h2>
            <p className="mt-4 text-lg text-muted-foreground">Flexible pricing for individuals and businesses</p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Starter</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">GHC 99</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm">Access to lawyer directory</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm">1 discounted consultation</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm">Legal document templates</span>
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link to="/client-plans">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary">
              <CardHeader>
                <Badge className="w-fit">Most Popular</Badge>
                <CardTitle>Professional</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">GHC 299</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm">3 consultations/month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm">Priority booking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm">Document review</span>
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link to="/client-plans">Get Started</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Business</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">GHC 899</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm">Dedicated lawyer</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm">Unlimited consultations</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <span className="text-sm">Contract drafting & legal audit</span>
                  </li>
                </ul>
                <Button asChild className="w-full">
                  <Link to="/client-plans">Get Started</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Our Clients Say</h2>
            <p className="mt-4 text-lg text-muted-foreground">Trusted by individuals and businesses across Ghana</p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            <Card>
              <CardHeader>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <CardDescription className="mt-4">
                  "LawConnect made it so easy to find a lawyer for my property dispute. The consultation was
                  professional and affordable."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">Kwame Mensah</p>
                <p className="text-sm text-muted-foreground">Small Business Owner</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <CardDescription className="mt-4">
                  "As a startup founder, having access to legal advice on demand has been invaluable. Highly
                  recommend the Business plan!"
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">Ama Osei</p>
                <p className="text-sm text-muted-foreground">Tech Entrepreneur</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <CardDescription className="mt-4">
                  "The platform is user-friendly and the lawyers are highly qualified. Got help with my family law
                  matter quickly."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">Kofi Asante</p>
                <p className="text-sm text-muted-foreground">Individual Client</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* For Businesses */}
      <section className="bg-gradient-to-br from-primary/10 to-secondary/10 py-20">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center space-y-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Built for Businesses</h2>
              <p className="text-lg text-muted-foreground">
                Get dedicated legal support for your business with our Business plan. From contract reviews to
                compliance advice, we've got you covered.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <span>Dedicated lawyer for your business</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <span>Unlimited consultations with fair use</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-6 w-6 text-primary" />
                  <span>Contract drafting and legal risk audits</span>
                </li>
              </ul>
              <div>
                <Button asChild size="lg">
                  <Link to="/client-plans">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <Card className="w-full max-w-md border-2">
                <CardHeader>
                  <CardTitle className="text-2xl">Ready to get started?</CardTitle>
                  <CardDescription>Join hundreds of businesses using LawConnect</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button asChild className="w-full" size="lg">
                    <Link to="/client-plans">View Business Plan</Link>
                  </Button>
                  <p className="text-center text-sm text-muted-foreground">
                    No credit card required • Cancel anytime
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="container">
          <Card className="border-2 bg-gradient-to-br from-primary/5 to-secondary/5">
            <CardContent className="flex flex-col items-center space-y-6 py-16 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ready to Get Legal Help?</h2>
              <p className="max-w-2xl text-lg text-muted-foreground">
                Join thousands of clients who trust LawConnect for their legal needs
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg">
                  <Link to="/find-lawyers">Find a Lawyer Now</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/join-as-lawyer">Are You a Lawyer?</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

import { useGetClientDashboard, useGetCallerUserProfile } from '../../hooks/useQueries';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Calendar, MessageSquare, FileText, Heart, CreditCard, User } from 'lucide-react';
import { format } from 'date-fns';

export default function ClientDashboard() {
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: dashboardData, isLoading } = useGetClientDashboard();

  const bookings = dashboardData?.[0] || [];
  const savedLawyers = dashboardData?.[1] || [];

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'pending' || b.status === 'confirmed'
  );

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="border-b bg-background">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Client Dashboard</h1>
              <p className="mt-1 text-muted-foreground">Welcome back, {userProfile?.name}</p>
            </div>
            <Button asChild>
              <Link to="/find-lawyers">Find a Lawyer</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <Tabs defaultValue="consultations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto">
            <TabsTrigger value="consultations">
              <Calendar className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Consultations</span>
            </TabsTrigger>
            <TabsTrigger value="chat">
              <MessageSquare className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Chat</span>
            </TabsTrigger>
            <TabsTrigger value="payments">
              <CreditCard className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="documents">
              <FileText className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Documents</span>
            </TabsTrigger>
            <TabsTrigger value="saved">
              <Heart className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Saved</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="consultations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Consultations</CardTitle>
                <CardDescription>Your scheduled appointments with lawyers</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length === 0 ? (
                  <div className="py-8 text-center">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">No upcoming consultations</p>
                    <Button asChild className="mt-4" variant="outline">
                      <Link to="/find-lawyers">Book a Consultation</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => {
                      const lawyer = savedLawyers.find((l) => l.id.toString() === booking.lawyerId.toString());
                      return (
                        <div key={Number(booking.bookingId)} className="flex items-center justify-between rounded-lg border p-4">
                          <div className="flex items-center gap-4">
                            <Avatar>
                              <AvatarImage src="/assets/generated/lawyer-avatar-placeholder.dim_512x512.png" />
                              <AvatarFallback>
                                {lawyer?.name.slice(0, 2).toUpperCase() || 'LA'}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold">{lawyer?.name || 'Lawyer'}</p>
                              <p className="text-sm text-muted-foreground">
                                {format(new Date(Number(booking.slot) / 1000000), 'PPp')}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Duration: {Number(booking.duration)} minutes
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge
                              variant={
                                booking.status === 'confirmed'
                                  ? 'default'
                                  : booking.status === 'pending'
                                    ? 'secondary'
                                    : 'outline'
                              }
                            >
                              {booking.status}
                            </Badge>
                            <span className="font-semibold">GHC {Number(booking.fee)}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
                <CardDescription>Chat with your lawyers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-8 text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">Chat feature coming soon</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    You'll be able to message lawyers you've booked consultations with
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Your consultation and subscription payments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <div className="py-8 text-center">
                      <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
                      <p className="mt-4 text-muted-foreground">No payment history yet</p>
                    </div>
                  ) : (
                    bookings.map((booking) => (
                      <div key={Number(booking.bookingId)} className="flex items-center justify-between rounded-lg border p-4">
                        <div>
                          <p className="font-semibold">Consultation Payment</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(Number(booking.slot) / 1000000), 'PP')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">GHC {Number(booking.fee)}</p>
                          <Badge variant="outline">{booking.status}</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documents">
            <Card>
              <CardHeader>
                <CardTitle>Document Vault</CardTitle>
                <CardDescription>Store and manage your legal documents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-8 text-center">
                  <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">Document vault coming soon</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Securely store and access your legal documents
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="saved">
            <Card>
              <CardHeader>
                <CardTitle>Saved Lawyers</CardTitle>
                <CardDescription>Lawyers you've saved for quick access</CardDescription>
              </CardHeader>
              <CardContent>
                {savedLawyers.length === 0 ? (
                  <div className="py-8 text-center">
                    <Heart className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">No saved lawyers yet</p>
                    <Button asChild className="mt-4" variant="outline">
                      <Link to="/find-lawyers">Browse Lawyers</Link>
                    </Button>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {savedLawyers.map((lawyer) => (
                      <div key={lawyer.id.toString()} className="flex items-center gap-4 rounded-lg border p-4">
                        <Avatar>
                          <AvatarImage src="/assets/generated/lawyer-avatar-placeholder.dim_512x512.png" />
                          <AvatarFallback>{lawyer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">{lawyer.name}</p>
                          <p className="text-sm text-muted-foreground">{lawyer.areasOfExpertise[0]}</p>
                        </div>
                        <Button asChild size="sm">
                          <Link to="/lawyers/$lawyerId" params={{ lawyerId: lawyer.id.toString() }}>View</Link>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

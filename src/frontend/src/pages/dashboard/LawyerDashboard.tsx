import { useGetLawyerDashboard, useGetCallerUserProfile } from '../../hooks/useQueries';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Loader2, Calendar, MessageSquare, DollarSign, Star, Settings, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function LawyerDashboard() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: dashboardData, isLoading } = useGetLawyerDashboard(identity?.getPrincipal().toString() || '');

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const [profile, bookings, summary] = dashboardData || [null, [], { pending: BigInt(0), confirmed: BigInt(0) }];

  const avgRating =
    profile && profile.reviews.length > 0
      ? profile.reviews.reduce((sum, r) => sum + Number(r.rating), 0) / profile.reviews.length
      : 0;

  const totalEarnings = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + Number(b.fee), 0);

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="border-b bg-background">
        <div className="container py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Lawyer Dashboard</h1>
              <p className="mt-1 text-muted-foreground">Welcome back, {userProfile?.name}</p>
            </div>
            <Button asChild variant="outline">
              <Link to="/lawyer-plans">Upgrade Plan</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container py-8">
        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{bookings.length}</div>
              <p className="text-xs text-muted-foreground">
                {Number(summary.pending)} pending, {Number(summary.confirmed)} confirmed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">GHC {totalEarnings}</div>
              <p className="text-xs text-muted-foreground">From completed consultations</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">{profile?.reviews.length || 0} reviews</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Plan Status</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{profile?.status || 'Basic'}</div>
              <p className="text-xs text-muted-foreground">
                {profile?.status === 'pro' ? 'Featured listing active' : 'Upgrade for more visibility'}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList>
            <TabsTrigger value="bookings">
              <Calendar className="mr-2 h-4 w-4" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="messages">
              <MessageSquare className="mr-2 h-4 w-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="earnings">
              <DollarSign className="mr-2 h-4 w-4" />
              Earnings
            </TabsTrigger>
            <TabsTrigger value="reviews">
              <Star className="mr-2 h-4 w-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Bookings</CardTitle>
                <CardDescription>Manage your consultation schedule</CardDescription>
              </CardHeader>
              <CardContent>
                {bookings.length === 0 ? (
                  <div className="py-8 text-center">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">No bookings yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {bookings.map((booking) => (
                      <div key={Number(booking.bookingId)} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                          <Avatar>
                            <AvatarFallback>CL</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold">Client Consultation</p>
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
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages">
            <Card>
              <CardHeader>
                <CardTitle>Client Messages</CardTitle>
                <CardDescription>Communicate with your clients</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="py-8 text-center">
                  <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground" />
                  <p className="mt-4 text-muted-foreground">Chat feature coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Summary</CardTitle>
                <CardDescription>Track your consultation revenue</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
                      <p className="text-2xl font-bold">GHC {totalEarnings}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Completed Consultations</p>
                      <p className="text-2xl font-bold">
                        {bookings.filter((b) => b.status === 'completed').length}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <CardTitle>Client Reviews</CardTitle>
                <CardDescription>See what clients are saying about you</CardDescription>
              </CardHeader>
              <CardContent>
                {!profile || profile.reviews.length === 0 ? (
                  <div className="py-8 text-center">
                    <Star className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">No reviews yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {profile.reviews.map((review, idx) => (
                      <div key={idx} className="space-y-2 rounded-lg border p-4">
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < Number(review.rating)
                                  ? 'fill-primary text-primary'
                                  : 'text-muted-foreground'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your lawyer profile and availability</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild className="w-full">
                  <Link to="/lawyers/$lawyerId" params={{ lawyerId: identity?.getPrincipal().toString() || '' }}>View Public Profile</Link>
                </Button>
                <p className="text-sm text-muted-foreground">
                  Availability management and profile editing features coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

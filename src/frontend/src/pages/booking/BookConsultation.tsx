import { useState } from 'react';
import { useParams, useNavigate, Link } from '@tanstack/react-router';
import { useFindLawyers, useBookConsultation } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Calendar, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { addDays, format } from 'date-fns';

export default function BookConsultation() {
  const { lawyerId } = useParams({ from: '/auth/book/$lawyerId' });
  const { data: lawyers, isLoading } = useFindLawyers();
  const bookConsultation = useBookConsultation();
  const navigate = useNavigate();

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [duration, setDuration] = useState('60');

  const lawyer = lawyers?.find((l) => l.id.toString() === lawyerId);

  const handleBooking = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select a date and time');
      return;
    }

    const dateTime = new Date(`${selectedDate}T${selectedTime}`);
    const slot = BigInt(dateTime.getTime() * 1000000);

    try {
      await bookConsultation.mutateAsync({
        lawyerId,
        slot,
        duration: BigInt(duration),
        fee: lawyer?.fee || BigInt(0),
      });
      toast.success('Consultation booked successfully');
      navigate({ to: '/client-dashboard' });
    } catch (error: any) {
      if (error.message?.includes('already booked')) {
        toast.error('This time slot is no longer available. Please select another time.');
      } else {
        toast.error('Failed to book consultation');
      }
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="container py-12">
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Lawyer not found</p>
            <Button asChild className="mt-4" variant="outline">
              <Link to="/find-lawyers">Back to Directory</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const minDate = format(new Date(), 'yyyy-MM-dd');
  const maxDate = format(addDays(new Date(), 90), 'yyyy-MM-dd');

  return (
    <div className="min-h-screen bg-muted/20">
      <div className="border-b bg-background">
        <div className="container py-6">
          <Button asChild variant="outline">
            <Link to="/lawyers/$lawyerId" params={{ lawyerId }}>← Back to Profile</Link>
          </Button>
        </div>
      </div>

      <div className="container py-12">
        <div className="mx-auto max-w-3xl">
          <h1 className="mb-8 text-3xl font-bold">Book a Consultation</h1>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Select Date & Time</CardTitle>
                  <CardDescription>Choose when you'd like to meet with {lawyer.name}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={minDate}
                      max={maxDate}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      min="30"
                      max="180"
                      step="30"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/assets/generated/lawyer-avatar-placeholder.dim_512x512.png" />
                      <AvatarFallback>{lawyer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{lawyer.name}</p>
                      <p className="text-sm text-muted-foreground">{lawyer.areasOfExpertise[0]}</p>
                    </div>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{selectedDate ? format(new Date(selectedDate), 'PPP') : 'Select a date'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{selectedTime || 'Select a time'} ({duration} minutes)</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <DollarSign className="h-4 w-4" />
                      <span>GHC {Number(lawyer.fee)}</span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex items-center justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span>GHC {Number(lawyer.fee)}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleBooking}
                    disabled={!selectedDate || !selectedTime || bookConsultation.isPending}
                    className="w-full"
                    size="lg"
                  >
                    {bookConsultation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Booking...
                      </>
                    ) : (
                      'Confirm Booking'
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

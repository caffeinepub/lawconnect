import { useFindLawyers, useAddReview, useGetClientDashboard } from '../../hooks/useQueries';
import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, Star, Briefcase, DollarSign, Award, MessageSquare, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';

export default function LawyerProfile() {
  const { lawyerId } = useParams({ from: '/public/lawyers/$lawyerId' });
  const { data: lawyers, isLoading } = useFindLawyers();
  const { data: dashboardData } = useGetClientDashboard();
  const { identity } = useInternetIdentity();
  const addReview = useAddReview();
  const navigate = useNavigate();

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);

  const lawyer = lawyers?.find((l) => l.id.toString() === lawyerId);

  const hasCompletedBooking =
    dashboardData?.[0]?.some(
      (booking) => booking.lawyerId.toString() === lawyerId && booking.status === 'completed'
    ) || false;

  const avgRating =
    lawyer && lawyer.reviews.length > 0
      ? lawyer.reviews.reduce((sum, r) => sum + Number(r.rating), 0) / lawyer.reviews.length
      : 0;

  const handleSubmitReview = async () => {
    if (!reviewComment.trim()) {
      toast.error('Please write a review comment');
      return;
    }

    try {
      await addReview.mutateAsync({
        lawyerId,
        rating: BigInt(reviewRating),
        comment: reviewComment,
      });
      toast.success('Review submitted successfully');
      setReviewComment('');
      setReviewRating(5);
      setShowReviewForm(false);
    } catch (error) {
      toast.error('Failed to submit review');
      console.error(error);
    }
  };

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
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

  return (
    <div className="container py-12">
      <div className="mb-6">
        <Button asChild variant="outline">
          <Link to="/find-lawyers">← Back to Directory</Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardHeader>
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/assets/generated/lawyer-avatar-placeholder.dim_512x512.png" />
                  <AvatarFallback>{lawyer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-3xl">{lawyer.name}</CardTitle>
                      <div className="mt-2 flex items-center gap-2">
                        <Star className="h-5 w-5 fill-primary text-primary" />
                        <span className="text-lg font-semibold">{avgRating.toFixed(1)}</span>
                        <span className="text-muted-foreground">({lawyer.reviews.length} reviews)</span>
                      </div>
                    </div>
                    {lawyer.status === 'pro' && (
                      <Badge className="bg-primary/10 text-primary">Featured Lawyer</Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-2 font-semibold">About</h3>
                <p className="text-muted-foreground">{lawyer.bio}</p>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 font-semibold">Areas of Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {lawyer.areasOfExpertise.map((area, idx) => (
                    <Badge key={idx} variant="secondary">
                      {area}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 font-semibold">Credentials</h3>
                <ul className="space-y-2">
                  {lawyer.credentials.map((cred, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Award className="mt-0.5 h-4 w-4 text-primary" />
                      <span className="text-sm">{cred}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="mb-3 font-semibold">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {lawyer.languages.map((lang, idx) => (
                    <Badge key={idx} variant="outline">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {identity && hasCompletedBooking && (
                <div>
                  {!showReviewForm ? (
                    <Button onClick={() => setShowReviewForm(true)} variant="outline" className="w-full">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Leave a Review
                    </Button>
                  ) : (
                    <div className="space-y-4 rounded-lg border p-4">
                      <div>
                        <Label>Rating</Label>
                        <div className="mt-2 flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() => setReviewRating(rating)}
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`h-6 w-6 ${
                                  rating <= reviewRating
                                    ? 'fill-primary text-primary'
                                    : 'text-muted-foreground'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="review-comment">Your Review</Label>
                        <Textarea
                          id="review-comment"
                          placeholder="Share your experience..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          rows={4}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={handleSubmitReview} disabled={addReview.isPending}>
                          {addReview.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            'Submit Review'
                          )}
                        </Button>
                        <Button variant="outline" onClick={() => setShowReviewForm(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                  <Separator className="my-6" />
                </div>
              )}

              {lawyer.reviews.length === 0 ? (
                <p className="text-center text-muted-foreground">No reviews yet</p>
              ) : (
                <div className="space-y-4">
                  {lawyer.reviews.map((review, idx) => (
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
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Consultation Fee</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">GHC {Number(lawyer.fee)}</span>
                  <span className="text-muted-foreground">per session</span>
                </div>
              </div>
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full"
                  size="lg"
                  onClick={() => {
                    if (!identity) {
                      toast.error('Please login to book a consultation');
                    }
                  }}
                >
                  <Link to="/book/$lawyerId" params={{ lawyerId }}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Book Consultation
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full" size="lg">
                  <Link to="/client-plans">
                    <Briefcase className="mr-2 h-4 w-4" />
                    Subscribe for Support
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Consultations</span>
                <span className="font-semibold">{Number(lawyer.consultationsOffered)}</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Average Rating</span>
                <span className="font-semibold">{avgRating.toFixed(1)} / 5.0</span>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Reviews</span>
                <span className="font-semibold">{lawyer.reviews.length}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

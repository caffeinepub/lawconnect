import { useFindLawyers } from '../../hooks/useQueries';
import { useState, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Search, Star, MapPin, Briefcase, DollarSign } from 'lucide-react';
import type { LawyerProfile } from '../../backend';

export default function FindLawyers() {
  const { data: lawyers, isLoading } = useFindLawyers();
  const [searchTerm, setSearchTerm] = useState('');
  const [practiceArea, setPracticeArea] = useState('all');
  const [minRating, setMinRating] = useState('0');

  const filteredLawyers = useMemo(() => {
    if (!lawyers) return [];

    return lawyers.filter((lawyer) => {
      const matchesSearch =
        searchTerm === '' ||
        lawyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lawyer.bio.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPracticeArea =
        practiceArea === 'all' || lawyer.areasOfExpertise.some((area) => area.toLowerCase().includes(practiceArea));

      const avgRating =
        lawyer.reviews.length > 0
          ? lawyer.reviews.reduce((sum, r) => sum + Number(r.rating), 0) / lawyer.reviews.length
          : 0;
      const matchesRating = avgRating >= Number(minRating);

      return matchesSearch && matchesPracticeArea && matchesRating;
    });
  }, [lawyers, searchTerm, practiceArea, minRating]);

  const sortedLawyers = useMemo(() => {
    return [...filteredLawyers].sort((a, b) => {
      if (a.status === 'pro' && b.status !== 'pro') return -1;
      if (a.status !== 'pro' && b.status === 'pro') return 1;
      return 0;
    });
  }, [filteredLawyers]);

  if (isLoading) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Find a Lawyer</h1>
        <p className="mt-2 text-lg text-muted-foreground">
          Browse our directory of verified legal professionals
        </p>
      </div>

      <div className="mb-8 grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search by name or expertise..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="practice-area">Practice Area</Label>
          <Select value={practiceArea} onValueChange={setPracticeArea}>
            <SelectTrigger id="practice-area">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="corporate">Corporate Law</SelectItem>
              <SelectItem value="criminal">Criminal Law</SelectItem>
              <SelectItem value="property">Property Law</SelectItem>
              <SelectItem value="family">Family Law</SelectItem>
              <SelectItem value="employment">Employment Law</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="rating">Minimum Rating</Label>
          <Select value={minRating} onValueChange={setMinRating}>
            <SelectTrigger id="rating">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Ratings</SelectItem>
              <SelectItem value="3">3+ Stars</SelectItem>
              <SelectItem value="4">4+ Stars</SelectItem>
              <SelectItem value="4.5">4.5+ Stars</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-4 text-sm text-muted-foreground">
        Showing {sortedLawyers.length} {sortedLawyers.length === 1 ? 'lawyer' : 'lawyers'}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedLawyers.map((lawyer) => {
          const avgRating =
            lawyer.reviews.length > 0
              ? lawyer.reviews.reduce((sum, r) => sum + Number(r.rating), 0) / lawyer.reviews.length
              : 0;

          return (
            <Card key={lawyer.id.toString()} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/assets/generated/lawyer-avatar-placeholder.dim_512x512.png" />
                    <AvatarFallback>{lawyer.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  {lawyer.status === 'pro' && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Featured
                    </Badge>
                  )}
                </div>
                <CardTitle className="mt-4">{lawyer.name}</CardTitle>
                <CardDescription className="line-clamp-2">{lawyer.bio}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Star className="h-4 w-4 fill-primary text-primary" />
                  <span className="font-medium">{avgRating.toFixed(1)}</span>
                  <span className="text-muted-foreground">({lawyer.reviews.length} reviews)</span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {lawyer.areasOfExpertise.slice(0, 2).map((area, idx) => (
                    <Badge key={idx} variant="outline">
                      {area}
                    </Badge>
                  ))}
                  {lawyer.areasOfExpertise.length > 2 && (
                    <Badge variant="outline">+{lawyer.areasOfExpertise.length - 2}</Badge>
                  )}
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{lawyer.languages.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span>GHC {Number(lawyer.fee)} per consultation</span>
                  </div>
                </div>

                <Button asChild className="w-full">
                  <Link to="/lawyers/$lawyerId" params={{ lawyerId: lawyer.id.toString() }}>View Profile</Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {sortedLawyers.length === 0 && (
        <Card className="py-12">
          <CardContent className="text-center">
            <p className="text-muted-foreground">No lawyers found matching your criteria</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setPracticeArea('all');
                setMinRating('0');
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

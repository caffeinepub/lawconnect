import { useState } from 'react';
import { useCreateLawyerProfile } from '../../hooks/useQueries';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, X } from 'lucide-react';
import { toast } from 'sonner';

export default function JoinAsLawyer() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const createProfile = useCreateLawyerProfile();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [fee, setFee] = useState('');
  const [credentials, setCredentials] = useState<string[]>(['']);
  const [areasOfExpertise, setAreasOfExpertise] = useState<string[]>(['']);
  const [languages, setLanguages] = useState<string[]>(['']);

  const handleAddField = (setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => [...prev, '']);
  };

  const handleRemoveField = (index: number, setter: React.Dispatch<React.SetStateAction<string[]>>) => {
    setter((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFieldChange = (
    index: number,
    value: string,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setter((prev) => prev.map((item, i) => (i === index ? value : item)));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity) {
      toast.error('Please login first');
      return;
    }

    const filteredCredentials = credentials.filter((c) => c.trim());
    const filteredAreas = areasOfExpertise.filter((a) => a.trim());
    const filteredLanguages = languages.filter((l) => l.trim());

    if (!name.trim() || !bio.trim() || !fee || filteredCredentials.length === 0 || filteredAreas.length === 0 || filteredLanguages.length === 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await createProfile.mutateAsync({
        name: name.trim(),
        bio: bio.trim(),
        credentials: filteredCredentials,
        areasOfExpertise: filteredAreas,
        languages: filteredLanguages,
        fee: BigInt(fee),
      });
      toast.success('Lawyer profile created successfully');
      navigate({ to: '/lawyer-dashboard' });
    } catch (error) {
      toast.error('Failed to create profile');
      console.error(error);
    }
  };

  if (!identity) {
    return (
      <div className="container flex min-h-[60vh] items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Join as a Lawyer</CardTitle>
            <CardDescription>Please login to create your lawyer profile</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={login} disabled={loginStatus === 'logging-in'} className="w-full">
              {loginStatus === 'logging-in' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login with Internet Identity'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Create Your Lawyer Profile</h1>
          <p className="mt-2 text-lg text-muted-foreground">
            Join our network of verified legal professionals
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Professional Bio *</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell clients about your experience and expertise..."
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="fee">Consultation Fee (GHC) *</Label>
                <Input
                  id="fee"
                  type="number"
                  value={fee}
                  onChange={(e) => setFee(e.target.value)}
                  placeholder="e.g., 500"
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Credentials *</Label>
                {credentials.map((credential, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={credential}
                      onChange={(e) => handleFieldChange(index, e.target.value, setCredentials)}
                      placeholder="e.g., LLB, University of Ghana"
                    />
                    {credentials.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveField(index, setCredentials)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => handleAddField(setCredentials)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Credential
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Areas of Expertise *</Label>
                {areasOfExpertise.map((area, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={area}
                      onChange={(e) => handleFieldChange(index, e.target.value, setAreasOfExpertise)}
                      placeholder="e.g., Corporate Law"
                    />
                    {areasOfExpertise.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveField(index, setAreasOfExpertise)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => handleAddField(setAreasOfExpertise)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Area
                </Button>
              </div>

              <div className="space-y-2">
                <Label>Languages *</Label>
                {languages.map((language, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={language}
                      onChange={(e) => handleFieldChange(index, e.target.value, setLanguages)}
                      placeholder="e.g., English"
                    />
                    {languages.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => handleRemoveField(index, setLanguages)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => handleAddField(setLanguages)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Language
                </Button>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={createProfile.isPending}>
                {createProfile.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Profile...
                  </>
                ) : (
                  'Create Profile'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

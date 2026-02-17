import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';

export default function Chat() {
  return (
    <div className="min-h-screen bg-muted/20">
      <div className="border-b bg-background">
        <div className="container py-6">
          <h1 className="text-3xl font-bold">Messages</h1>
        </div>
      </div>

      <div className="container py-12">
        <Card>
          <CardHeader>
            <CardTitle>Chat</CardTitle>
            <CardDescription>Message your lawyers and clients</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <MessageSquare className="mx-auto h-16 w-16 text-muted-foreground" />
                <p className="mt-4 text-lg font-medium">Chat Feature Coming Soon</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  You'll be able to message lawyers and clients directly through the platform
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

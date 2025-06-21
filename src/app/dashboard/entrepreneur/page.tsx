
"use client";

import { RequestItem } from "@/components/dashboard/request-item";
import { CollaborationRequest } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function EntrepreneurDashboard() {
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchRequests = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const authDataString = localStorage.getItem("nexus-auth");
      if (!authDataString) {
        throw new Error("Authentication not found.");
      }
      const { token } = JSON.parse(authDataString);

      const response = await fetch('/api/requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (response.ok && data.success) {
        setRequests(data.requests);
      } else {
        setError(data.message || "Failed to fetch requests.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleRequestUpdate = () => {
    toast({
      title: "Request Updated",
      description: "The collaboration request status has been changed.",
    });
    fetchRequests(); // Re-fetch requests after an update
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Collaboration Requests</h1>
        <p className="text-muted-foreground">Manage interest from potential investors.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Incoming Requests</CardTitle>
           {isLoading ? (
            <Skeleton className="h-4 w-48" />
          ) : (
            <CardDescription>You have {requests.filter(r => r.status === 'pending').length} pending requests.</CardDescription>
          )}
        </CardHeader>
        <CardContent>
           {isLoading && (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                 <div key={i} className="flex items-center justify-between p-4 rounded-lg border">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-32" />
                           <Skeleton className="h-3 w-24" />
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-6 w-20 rounded-full" />
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-20" />
                    </div>
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-destructive">{error}</p>}

          {!isLoading && !error && (
            <div className="space-y-4">
              {requests.length > 0 ? (
                requests.map(request => (
                  <RequestItem key={request.id} request={request} onUpdate={handleRequestUpdate} />
                ))
              ) : (
                <p className="text-muted-foreground">You have no incoming collaboration requests yet.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


"use client";

import { RequestItem } from "@/components/dashboard/request-item";
import { CollaborationRequest } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { AnalyticsCard } from "@/components/dashboard/analytics-card";
import { Handshake, CheckCircle, Hourglass } from "lucide-react";

export default function EntrepreneurDashboard() {
  const [requests, setRequests] = useState<CollaborationRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [analytics, setAnalytics] = useState<any>(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setIsAnalyticsLoading(true);
    setError(null);
    
    try {
      const authDataString = localStorage.getItem("nexus-auth");
      if (!authDataString) {
        throw new Error("Authentication not found.");
      }
      const { token } = JSON.parse(authDataString);
      const headers = { 'Authorization': `Bearer ${token}` };

      const [requestsResponse, analyticsResponse] = await Promise.all([
        fetch('/api/requests', { headers }),
        fetch('/api/analytics', { headers })
      ]);

      const requestsData = await requestsResponse.json();
      if (requestsResponse.ok && requestsData.success) {
        setRequests(requestsData.requests);
      } else {
        setError(requestsData.message || "Failed to fetch requests.");
      }

      const analyticsData = await analyticsResponse.json();
       if (analyticsResponse.ok && analyticsData.success) {
        setAnalytics(analyticsData.analytics);
      } else {
        // Don't throw an error for analytics, just log it
        console.error("Failed to fetch analytics:", analyticsData.message);
      }

    } catch (err: any) {
      setError(err.message);
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRequestUpdate = () => {
    toast({
      title: "Request Updated",
      description: "The collaboration request status has been changed.",
    });
    fetchDashboardData(); // Re-fetch all data after an update
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Entrepreneur Dashboard</h1>
        <p className="text-muted-foreground">Track your engagement and manage incoming requests.</p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <AnalyticsCard
          title="Total Requests"
          value={analytics?.totalRequests ?? 0}
          icon={<Handshake className="h-4 w-4" />}
          isLoading={isAnalyticsLoading}
        />
        <AnalyticsCard
          title="Accepted"
          value={analytics?.accepted ?? 0}
          icon={<CheckCircle className="h-4 w-4 text-green-500" />}
          isLoading={isAnalyticsLoading}
        />
        <AnalyticsCard
          title="Pending"
          value={analytics?.pending ?? 0}
          icon={<Hourglass className="h-4 w-4 text-yellow-500" />}
          isLoading={isAnalyticsLoading}
        />
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
                <p className="text-center py-8 text-muted-foreground">You have no incoming collaboration requests yet.</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

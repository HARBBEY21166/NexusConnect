
"use client";

import { EntrepreneurCard } from "@/components/dashboard/entrepreneur-card";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/lib/types";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { AnalyticsCard } from "@/components/dashboard/analytics-card";
import { Send, BarChart, Bookmark as BookmarkIcon } from "lucide-react";

export default function InvestorDashboard() {
  const [entrepreneurs, setEntrepreneurs] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { bookmarkedIds, toggleBookmark } = useBookmarks();

  const [analytics, setAnalytics] = useState<any>(null);
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(true);

  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoading(true);
      setIsAnalyticsLoading(true);
      setError(null);
      try {
         // Fetch entrepreneurs
        const entrepreneursResponse = await fetch(`/api/entrepreneurs?${searchParams.toString()}`);
        const entrepreneursData = await entrepreneursResponse.json();
        if (entrepreneursResponse.ok && entrepreneursData.success) {
          setEntrepreneurs(entrepreneursData.entrepreneurs);
        } else {
           setError(entrepreneursData.message || "Failed to fetch entrepreneurs.");
        }
        setIsLoading(false);

        // Fetch analytics
        const authDataString = localStorage.getItem("nexus-auth");
        if (authDataString) {
            const { token } = JSON.parse(authDataString);
            const analyticsResponse = await fetch('/api/analytics', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const analyticsData = await analyticsResponse.json();
            if (analyticsResponse.ok && analyticsData.success) {
                setAnalytics(analyticsData.analytics);
            }
        }
      } catch (err) {
        setError("An unexpected error occurred.");
        console.error(err);
      } finally {
        setIsAnalyticsLoading(false);
      }
    };

    fetchPageData();
  }, [searchParams]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Discover Entrepreneurs</h1>
        <p className="text-muted-foreground">Browse profiles of innovative founders seeking investment.</p>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <AnalyticsCard
            title="Requests Sent"
            value={analytics?.requestsSent ?? 0}
            icon={<Send className="h-4 w-4" />}
            isLoading={isAnalyticsLoading}
        />
        <AnalyticsCard
            title="Acceptance Rate"
            value={`${analytics?.acceptanceRate ?? 0}%`}
            icon={<BarChart className="h-4 w-4" />}
            isLoading={isAnalyticsLoading}
        />
        <AnalyticsCard
            title="Bookmarked"
            value={analytics?.bookmarkedProfiles ?? 0}
            icon={<BookmarkIcon className="h-4 w-4" />}
            isLoading={isAnalyticsLoading}
        />
      </div>

      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3 p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-4 w-[100px]" />
                </div>
              </div>
              <Skeleton className="h-[75px] w-full rounded-xl" />
              <div className="flex gap-2 pt-2">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 flex-1" />
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="text-destructive text-center py-4">{error}</p>}

      {!isLoading && !error && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entrepreneurs.length > 0 ? (
                entrepreneurs.map(entrepreneur => (
                    <EntrepreneurCard 
                      key={entrepreneur.id} 
                      entrepreneur={entrepreneur}
                      isBookmarked={bookmarkedIds.has(entrepreneur.id)}
                      onToggleBookmark={toggleBookmark}
                    />
                ))
            ) : (
                <div className="col-span-full text-center text-muted-foreground py-12">
                    <p>No entrepreneurs found.</p>
                    {searchParams.has('q') && <p>Try adjusting your search terms.</p>}
                </div>
            )}
        </div>
      )}
    </div>
  );
}

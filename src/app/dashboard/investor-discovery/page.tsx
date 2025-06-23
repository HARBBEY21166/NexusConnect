
"use client";

import { InvestorCard } from "@/components/dashboard/investor-card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/lib/types";
import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InvestorDiscoveryPage() {
  const [investors, setInvestors] = useState<User[]>([]);
  const [allInterests, setAllInterests] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedInterests = useMemo(() => {
    const interests = searchParams.get('interests');
    return interests ? interests.split(',') : [];
  }, [searchParams]);

  useEffect(() => {
    const fetchPageData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchUrl = `/api/investors?${searchParams.toString()}`;
        const [investorsResponse, interestsResponse] = await Promise.all([
          fetch(fetchUrl),
          fetch('/api/investors/interests') // Fetch all possible interests for filter UI
        ]);

        const investorsData = await investorsResponse.json();
        if (investorsResponse.ok && investorsData.success) {
          setInvestors(investorsData.investors);
        } else {
          throw new Error(investorsData.message || "Failed to fetch investors.");
        }
        
        const interestsData = await interestsResponse.json();
        if (interestsResponse.ok && interestsData.success) {
          setAllInterests(interestsData.interests.sort());
        } else {
          console.error("Could not load dynamic interests for filtering.");
        }

      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPageData();
  }, [searchParams]);

  const handleInterestChange = (interest: string, checked: boolean | string) => {
    const newInterests = new Set(selectedInterests);
    if (checked) {
      newInterests.add(interest);
    } else {
      newInterests.delete(interest);
    }

    const params = new URLSearchParams(searchParams);
    if (newInterests.size > 0) {
      params.set('interests', Array.from(newInterests).join(','));
    } else {
      params.delete('interests');
    }
    
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="grid gap-8 md:grid-cols-[280px_1fr]">
       <aside className="hidden md:flex flex-col gap-8">
            <Card>
                <CardHeader>
                    <CardTitle>Filters</CardTitle>
                </CardHeader>
                <CardContent>
                    <h4 className="font-semibold mb-4">Investment Interests</h4>
                    <div className="space-y-3">
                        {isLoading ? (
                             [...Array(5)].map((_, i) => (
                                <div key={i} className="flex items-center space-x-2">
                                    <Skeleton className="h-4 w-4" />
                                    <Skeleton className="h-4 w-24" />
                                </div>
                            ))
                        ) : allInterests.length > 0 ? (
                           allInterests.map((interest) => (
                                <div key={interest} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`interest-${interest}`}
                                        checked={selectedInterests.includes(interest)}
                                        onCheckedChange={(checked) => handleInterestChange(interest, checked)}
                                    />
                                    <Label htmlFor={`interest-${interest}`} className="font-normal capitalize cursor-pointer">
                                        {interest}
                                    </Label>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">No interests to filter by.</p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </aside>

      <main>
        <div className="mb-8">
            <h1 className="text-3xl font-bold font-headline">Discover Investors</h1>
            <p className="text-muted-foreground">Find the right partners to fund your vision.</p>
        </div>

        {isLoading && (
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex flex-col space-y-3 p-4 border rounded-lg bg-card">
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

        {error && <p className="text-destructive">{error}</p>}

        {!isLoading && !error && (
             <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2">
                {investors.length > 0 ? (
                    investors.map(investor => (
                        <InvestorCard key={investor.id} investor={investor} />
                    ))
                ) : (
                    <div className="col-span-full text-center text-muted-foreground py-12">
                        <h3 className="text-xl font-semibold">No Investors Found</h3>
                        <p>Try adjusting your search or filter criteria.</p>
                    </div>
                )}
            </div>
        )}
      </main>
    </div>
  );
}


"use client";

import { EntrepreneurCard } from "@/components/dashboard/entrepreneur-card";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/lib/types";
import { useEffect, useState } from "react";

export default function InvestorDashboard() {
  const [entrepreneurs, setEntrepreneurs] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEntrepreneurs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/entrepreneurs');
        const data = await response.json();

        if (response.ok && data.success) {
          setEntrepreneurs(data.entrepreneurs);
        } else {
          setError(data.message || "Failed to fetch entrepreneurs.");
        }
      } catch (err) {
        setError("An unexpected error occurred.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEntrepreneurs();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Discover Entrepreneurs</h1>
        <p className="text-muted-foreground">Browse profiles of innovative founders seeking investment.</p>
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

      {error && <p className="text-destructive">{error}</p>}

      {!isLoading && !error && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {entrepreneurs.length > 0 ? (
                entrepreneurs.map(entrepreneur => (
                    <EntrepreneurCard key={entrepreneur.id} entrepreneur={entrepreneur} />
                ))
            ) : (
                <p>No entrepreneurs found.</p>
            )}
        </div>
      )}
    </div>
  );
}

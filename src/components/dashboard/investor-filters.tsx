
"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface InvestorFiltersProps {
  allInterests: string[];
  selectedInterests: string[];
  isLoading: boolean;
  onInterestChange: (interest: string, checked: boolean | string) => void;
}

export function InvestorFilters({
  allInterests,
  selectedInterests,
  isLoading,
  onInterestChange,
}: InvestorFiltersProps) {
  return (
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
                  id={`interest-filter-${interest}`}
                  checked={selectedInterests.includes(interest)}
                  onCheckedChange={(checked) => onInterestChange(interest, checked)}
                />
                <Label htmlFor={`interest-filter-${interest}`} className="font-normal capitalize cursor-pointer">
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
  );
}

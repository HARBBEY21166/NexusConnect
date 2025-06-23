
"use client";

import { InvestorCard } from "@/components/dashboard/investor-card";
import { EntrepreneurCard } from "@/components/dashboard/entrepreneur-card";
import { Skeleton } from "@/components/ui/skeleton";
import { User } from "@/lib/types";
import { useBookmarks } from "@/hooks/use-bookmarks";
import { BookmarkX } from "lucide-react";

export default function BookmarksPage() {
  const { bookmarkedUsers, isLoading, bookmarkedIds, toggleBookmark } = useBookmarks();

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">My Bookmarks</h1>
        <p className="text-muted-foreground">All your saved profiles in one place.</p>
      </div>

      {isLoading && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
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

      {!isLoading && (
        <>
          {bookmarkedUsers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {bookmarkedUsers.map((user: User) => (
                user.role === 'investor' ? (
                  <InvestorCard 
                    key={user.id} 
                    investor={user} 
                    isBookmarked={bookmarkedIds.has(user.id)}
                    onToggleBookmark={toggleBookmark}
                  />
                ) : (
                  <EntrepreneurCard 
                    key={user.id} 
                    entrepreneur={user} 
                    isBookmarked={bookmarkedIds.has(user.id)}
                    onToggleBookmark={toggleBookmark}
                  />
                )
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                <BookmarkX className="mx-auto h-12 w-12 mb-4" />
                <h2 className="text-xl font-semibold">No Bookmarks Yet</h2>
                <p>You can bookmark profiles from the discovery pages.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

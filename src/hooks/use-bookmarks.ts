
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { User } from '@/lib/types';

export const useBookmarks = () => {
    const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());
    const [bookmarkedUsers, setBookmarkedUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const getToken = () => {
        const authDataString = localStorage.getItem("nexus-auth");
        if (!authDataString) return null;
        return JSON.parse(authDataString).token;
    }

    const fetchBookmarks = useCallback(async () => {
        setIsLoading(true);
        const token = getToken();
        if (!token) {
            setIsLoading(false);
            return;
        }
        try {
            const response = await fetch('/api/profile/bookmarks', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            if (data.success) {
                setBookmarkedUsers(data.bookmarks);
                setBookmarkedIds(new Set(data.bookmarks.map((b: User) => b.id)));
            } else {
                throw new Error(data.message);
            }
        } catch (error: any) {
            toast({
                title: "Error fetching bookmarks",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchBookmarks();
    }, [fetchBookmarks]);

    const toggleBookmark = useCallback(async (profileId: string) => {
        const token = getToken();
        if (!token) {
            toast({ title: "Not Authenticated", description: "You must be logged in to bookmark profiles.", variant: "destructive" });
            return;
        }

        const originalBookmarkedIds = new Set(bookmarkedIds);
        
        // Optimistic update
        setBookmarkedIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(profileId)) {
                newSet.delete(profileId);
            } else {
                newSet.add(profileId);
            }
            return newSet;
        });

        try {
            const response = await fetch('/api/profile/bookmarks', {
                method: 'PATCH',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ profileId })
            });

            const data = await response.json();
            if (!data.success) throw new Error(data.message);

            toast({
                title: data.message,
            });
            // Re-fetch to ensure data consistency, especially for the Bookmarks page
            fetchBookmarks();
        } catch (error: any) {
            // Revert optimistic update
            setBookmarkedIds(originalBookmarkedIds);
            toast({
                title: "Error",
                description: "Failed to update bookmark. " + error.message,
                variant: "destructive"
            });
        }
    }, [bookmarkedIds, toast, fetchBookmarks]);

    return { bookmarkedIds, bookmarkedUsers, toggleBookmark, isLoading, refetchBookmarks: fetchBookmarks };
}

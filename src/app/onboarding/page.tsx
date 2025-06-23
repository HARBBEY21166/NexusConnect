
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";
import { OnboardingForm } from "@/components/onboarding/onboarding-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export default function OnboardingPage() {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const authDataString = localStorage.getItem("nexus-auth");
        if (authDataString) {
            const { user: authUser } = JSON.parse(authDataString);
            if (authUser.hasCompletedOnboarding) {
                // If they are already onboarded, send them to dashboard
                router.replace(`/dashboard/${authUser.role}`);
            } else {
                setUser(authUser);
                setIsLoading(false);
            }
        } else {
            // No user data, send to login
            router.replace('/login');
        }
    }, [router]);

    if (isLoading || !user) {
        return (
             <Card className="w-full max-w-2xl">
                <CardHeader>
                    <CardTitle>Welcome to NexusConnect!</CardTitle>
                    <CardDescription>Let's set up your profile. A complete profile is key to making valuable connections.</CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center p-12">
                   <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Welcome to NexusConnect!</CardTitle>
                <CardDescription>Let's set up your profile. A complete profile is key to making valuable connections.</CardDescription>
            </CardHeader>
            <CardContent>
                <OnboardingForm user={user} />
            </CardContent>
        </Card>
    )
}

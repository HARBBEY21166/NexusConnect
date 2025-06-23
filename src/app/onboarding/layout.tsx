
import React from "react";
import { Handshake } from 'lucide-react';
import Link from "next/link";

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
        <div className="absolute top-8 left-8">
             <Link href="/" className="flex items-center gap-2 text-foreground" prefetch={false}>
                <Handshake className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold">NexusConnect</span>
            </Link>
        </div>
        <div className="w-full max-w-2xl">
            {children}
        </div>
    </div>
  );
}

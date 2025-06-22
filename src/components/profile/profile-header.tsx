
"use client";

import { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, Edit, Handshake, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface ProfileHeaderProps {
  user: User;
}

type CurrentUser = {
  id: string;
  role: 'investor' | 'entrepreneur';
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const authDataString = localStorage.getItem('nexus-auth');
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        if (authData?.user) {
          setCurrentUser({ id: authData.user.id, role: authData.user.role });
        }
      } catch (error) {
        console.error("Failed to parse auth data from localStorage", error);
      }
    }
  }, []);

  const handleRequestCollaboration = async () => {
    setIsRequesting(true);
    try {
        const authDataString = localStorage.getItem("nexus-auth");
        if (!authDataString) throw new Error("You must be logged in to send a request.");
        
        const { token } = JSON.parse(authDataString);

        const response = await fetch('/api/requests', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ entrepreneurId: user.id })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            toast({
                title: "Request Sent!",
                description: `Your collaboration request to ${user.name} has been sent.`,
            });
        } else {
            throw new Error(data.message || "Failed to send request.");
        }
    } catch (error: any) {
        toast({
            title: "Request Failed",
            description: error.message,
            variant: "destructive"
        });
    } finally {
        setIsRequesting(false);
    }
  };

  const isCurrentUserProfile = currentUser?.id === user.id;
  const canRequestCollaboration = currentUser?.role === 'investor' && user.role === 'entrepreneur';

  const renderActionButtons = () => {
    if (isCurrentUserProfile) {
      return (
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      );
    }

    const buttons = [];
    if (canRequestCollaboration) {
      buttons.push(
        <Button key="request" onClick={handleRequestCollaboration} disabled={isRequesting}>
          {isRequesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Handshake className="mr-2 h-4 w-4" />}
          Request Collaboration
        </Button>
      );
    }

    buttons.push(
        <Button key="message" asChild variant="outline">
            <Link href={`/dashboard/chat/${user.id}`}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
            </Link>
        </Button>
    )

    return buttons;
  };


  return (
    <div className="relative">
      <div className="h-32 w-full rounded-t-lg bg-muted lg:h-48" />
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="flex items-end gap-6 -mt-16 sm:-mt-20">
          <Avatar className="h-24 w-24 border-4 border-background sm:h-32 sm:w-32">
            <AvatarImage src={user.avatarUrl} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 pb-2">
            <h1 className="text-2xl font-bold font-headline sm:text-3xl">{user.name}</h1>
            <p className="text-sm capitalize text-muted-foreground">{user.role}</p>
          </div>
          <div className="flex gap-2">
            {renderActionButtons()}
          </div>
        </div>
      </div>
    </div>
  );
}

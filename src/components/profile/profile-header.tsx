import { User } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { MessageSquare, Edit } from 'lucide-react';
import Link from 'next/link';

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  // A mock check to see if this is the current user's profile
  const isCurrentUser = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('nexus-user') || '{}').id === user.id;

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
            {isCurrentUser ? (
              <Button>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
                <Button asChild>
                    <Link href={`/chat/${user.id}`}>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Message
                    </Link>
                </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


import { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowUpRight, MessageSquare, Bookmark } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface EntrepreneurCardProps {
  entrepreneur: User;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
}

export function EntrepreneurCard({ entrepreneur, isBookmarked, onToggleBookmark }: EntrepreneurCardProps) {
    if (entrepreneur.role !== 'entrepreneur') return null;

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-start gap-4">
        <div className="flex flex-row items-center gap-4 flex-1">
            <Avatar className="h-12 w-12">
            <AvatarImage src={entrepreneur.avatarUrl} alt={entrepreneur.name} />
            <AvatarFallback>{entrepreneur.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
            <CardTitle>{entrepreneur.name}</CardTitle>
            <CardDescription>{entrepreneur.startupName}</CardDescription>
            </div>
        </div>
        {onToggleBookmark && (
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => onToggleBookmark(entrepreneur.id)}>
              <Bookmark className={cn("h-5 w-5", isBookmarked && "fill-primary text-primary")} />
              <span className="sr-only">Bookmark</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
            {entrepreneur.startupDescription}
        </p>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild className="flex-1">
          <Link href={`/dashboard/profile/entrepreneur/${entrepreneur.id}`}>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            View Profile
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
            <Link href={`/dashboard/chat/${entrepreneur.id}`}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

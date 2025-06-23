
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
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, MessageSquare, Bookmark } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface InvestorCardProps {
  investor: User;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
}

export function InvestorCard({ investor, isBookmarked, onToggleBookmark }: InvestorCardProps) {
  if (investor.role !== 'investor') return null;

  return (
    <Card className="flex flex-col">
       <CardHeader className="flex flex-row items-start gap-4">
        <div className="flex flex-row items-center gap-4 flex-1">
            <Avatar className="h-12 w-12">
            <AvatarImage src={investor.avatarUrl} alt={investor.name} />
            <AvatarFallback>{investor.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
            <CardTitle>{investor.name}</CardTitle>
            <CardDescription>Venture Capitalist</CardDescription>
            </div>
        </div>
        {onToggleBookmark && (
          <Button variant="ghost" size="icon" className="shrink-0" onClick={() => onToggleBookmark(investor.id)}>
              <Bookmark className={cn("h-5 w-5", isBookmarked && "fill-primary text-primary")} />
              <span className="sr-only">Bookmark</span>
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex-grow space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-3">
            {investor.bio}
        </p>
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium">Interests:</span>
            {investor.investmentInterests?.slice(0, 3).map(interest => (
                <Badge key={interest} variant="secondary">{interest}</Badge>
            ))}
            {investor.investmentInterests && investor.investmentInterests.length > 3 && (
                 <Badge variant="outline">+{investor.investmentInterests.length - 3} more</Badge>
            )}
        </div>
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button asChild className="flex-1">
          <Link href={`/dashboard/profile/investor/${investor.id}`}>
            <ArrowUpRight className="mr-2 h-4 w-4" />
            View Profile
          </Link>
        </Button>
        <Button asChild variant="outline" className="flex-1">
            <Link href={`/dashboard/chat/${investor.id}`}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

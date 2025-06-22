
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
import { ArrowUpRight, MessageSquare } from "lucide-react";
import Link from "next/link";

interface EntrepreneurCardProps {
  entrepreneur: User;
}

export function EntrepreneurCard({ entrepreneur }: EntrepreneurCardProps) {
    if (entrepreneur.role !== 'entrepreneur') return null;

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={entrepreneur.avatarUrl} alt={entrepreneur.name} />
          <AvatarFallback>{entrepreneur.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle>{entrepreneur.name}</CardTitle>
          <CardDescription>{entrepreneur.startupName}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
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

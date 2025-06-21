import { User } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Briefcase, ExternalLink } from 'lucide-react';

interface ProfileDetailsProps {
  user: User;
}

export function ProfileDetails({ user }: ProfileDetailsProps) {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">{user.bio}</p>
        </CardContent>
      </Card>

      {user.role === 'entrepreneur' && (
        <Card>
          <CardHeader>
            <CardTitle>{user.startupName}</CardTitle>
            <CardDescription>Startup Details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{user.startupDescription}</p>
            {user.pitchDeckUrl && (
              <Button asChild variant="secondary">
                <Link href={user.pitchDeckUrl} target="_blank">
                  View Pitch Deck
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {user.role === 'investor' && user.portfolioCompanies && (
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Companies</CardTitle>
            <CardDescription>A selection of past investments</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {user.portfolioCompanies.map((company, index) => (
                <li key={index} className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Briefcase className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{company.name}</p>
                    <Link href={company.url} className="text-sm text-muted-foreground hover:underline flex items-center gap-1" target="_blank">
                      Visit Website <ExternalLink className="h-3 w-3" />
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

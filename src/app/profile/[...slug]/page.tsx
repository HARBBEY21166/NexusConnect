import { getUserById } from '@/lib/data';
import { notFound } from 'next/navigation';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileDetails } from '@/components/profile/profile-details';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileOptimizer } from '@/components/profile/profile-optimizer';

export default function ProfilePage({ params }: { params: { slug: string[] } }) {
  const [role, id] = params.slug;
  const user = getUserById(id);

  if (!user || user.role !== role) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <ProfileHeader user={user} />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <ProfileDetails user={user} />
        </div>
        <div className="space-y-8">
          {user.role === 'entrepreneur' && (
            <Card>
                <CardHeader>
                    <CardTitle>AI Profile Polish</CardTitle>
                </CardHeader>
                <CardContent>
                    <ProfileOptimizer currentBio={user.bio} />
                </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
                <CardTitle>
                    {user.role === 'investor' ? "Investment Interests" : "Funding Needs"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                {user.role === 'investor' ? (
                     <div className="flex flex-wrap gap-2">
                        {user.investmentInterests?.map(interest => (
                            <div key={interest} className="rounded-full bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
                                {interest}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-muted-foreground">{user.fundingNeeds}</p>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}


import { notFound } from 'next/navigation';
import { ProfileHeader } from '@/components/profile/profile-header';
import { ProfileDetails } from '@/components/profile/profile-details';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileOptimizer } from '@/components/profile/profile-optimizer';
import type { User } from '@/lib/types';
import dbConnect from '@/lib/db';
import UserModel from '@/models/User.model';

async function getProfileUser(id: string): Promise<User | null> {
    try {
        await dbConnect();
        const user = await UserModel.findById(id).lean();
        if (!user) return null;

        const userObject = JSON.parse(JSON.stringify(user));
        userObject.id = userObject._id.toString();
        delete userObject._id;
        delete userObject.__v;
        delete userObject.password;
        
        return userObject;
    } catch (error) {
        console.error("Failed to fetch user from DB", error);
        return null;
    }
}

export default async function ProfilePage({ params }: { params: { slug: string[] } }) {
  const [role, id] = params.slug;
  
  const user = await getProfileUser(id);

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
                    <ProfileOptimizer currentBio={user.bio || ''} />
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

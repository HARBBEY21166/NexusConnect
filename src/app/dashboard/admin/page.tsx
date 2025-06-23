
'use client';

import { useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Trash2, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const authDataString = localStorage.getItem('nexus-auth');
      if (!authDataString) throw new Error('Authentication not found.');
      
      const { token, user: adminUser } = JSON.parse(authDataString);
      const response = await fetch('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setUsers(data.users.filter((u: User) => u.id !== adminUser.id));
      } else {
        throw new Error(data.message || 'Failed to fetch users.');
      }
    } catch (err: any) {
      setError(err.message);
      toast({
        title: "Error",
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    setIsDeleting(userId);
    try {
        const authDataString = localStorage.getItem('nexus-auth');
        if (!authDataString) throw new Error('Authentication not found.');
        
        const { token } = JSON.parse(authDataString);

        const response = await fetch(`/api/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();
        if (response.ok && data.success) {
            toast({
                title: "User Deleted",
                description: data.message,
            });
            fetchUsers(); // Refresh the list
        } else {
            throw new Error(data.message || "Failed to delete user.");
        }

    } catch (err: any) {
        toast({
            title: "Error Deleting User",
            description: err.message,
            variant: 'destructive',
        });
    } finally {
        setIsDeleting(null);
    }
  }
  
  const roleBadgeVariant = {
      admin: 'destructive',
      investor: 'secondary',
      entrepreneur: 'default'
  }

  const renderSkeleton = () => (
    [...Array(5)].map((_, i) => (
      <div key={i} className="flex flex-col md:flex-row items-start md:items-center p-4 space-y-4 md:space-y-0 border-b">
        <div className="flex items-center gap-3 w-full md:w-2/5">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className='w-full'>
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div className="w-full md:w-2/5">
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="w-full md:w-1/5">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <div className="hidden md:block md:w-1/5">
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="w-full md:w-auto md:text-right">
          <Skeleton className="h-9 w-9 rounded-sm md:ml-auto" />
        </div>
      </div>
    ))
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage all users on the NexusConnect platform.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            {isLoading ? <Skeleton className="h-4 w-40" /> : `A total of ${users.length} manageable users.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
            {error && <p className="text-destructive text-center">{error}</p>}
            
            <div className="space-y-4 md:hidden">
              {isLoading ? renderSkeleton() : users.map(user => (
                <div key={user.id} className="p-4 border rounded-lg">
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                          <Avatar>
                              <AvatarImage src={user.avatarUrl} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <Badge variant={roleBadgeVariant[user.role] as any} className="capitalize">{user.role}</Badge>
                          </div>
                      </div>
                       {isDeleting === user.id ? (
                          <Button variant="destructive" size="icon" disabled>
                              <Loader2 className="h-4 w-4 animate-spin" />
                          </Button>
                      ) : (
                          <AlertDialog>
                              <AlertDialogTrigger asChild>
                                  <Button variant="destructive" size="icon">
                                      <Trash2 className="h-4 w-4" />
                                  </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                  <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                      This action cannot be undone. This will permanently delete the user '{user.name}' and all of their associated data.
                                  </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-destructive hover:bg-destructive/90">
                                      Delete
                                  </AlertDialogAction>
                                  </AlertDialogFooter>
                              </AlertDialogContent>
                          </AlertDialog>
                      )}
                   </div>
                   <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">{user.email}</p>
                      <p className="text-muted-foreground">
                          Joined: {user.createdAt ? format(new Date(user.createdAt), 'PPP') : 'N/A'}
                      </p>
                   </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block">
              <table className="w-full text-left">
                  <thead>
                      <tr className="border-b">
                          <th className="p-4">User</th>
                          <th className="p-4">Email</th>
                          <th className="p-4">Role</th>
                          <th className="p-4">Joined</th>
                          <th className="p-4 text-right">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      {isLoading ? (
                          [...Array(5)].map((_, i) => (
                              <tr key={i} className="border-b">
                                  <td className="p-4">
                                      <div className="flex items-center gap-3">
                                          <Skeleton className="h-10 w-10 rounded-full" />
                                          <Skeleton className="h-4 w-24" />
                                      </div>
                                  </td>
                                  <td className="p-4"><Skeleton className="h-4 w-40" /></td>
                                  <td className="p-4"><Skeleton className="h-6 w-20 rounded-full" /></td>
                                  <td className="p-4"><Skeleton className="h-4 w-32" /></td>
                                  <td className="p-4 text-right"><Skeleton className="h-9 w-9 rounded-sm ml-auto" /></td>
                              </tr>
                          ))
                      ) : (
                          users.map((user) => (
                              <tr key={user.id} className="border-b">
                                  <td className="p-4">
                                      <div className="flex items-center gap-3">
                                          <Avatar>
                                              <AvatarImage src={user.avatarUrl} alt={user.name} />
                                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                          </Avatar>
                                          <span className="font-medium">{user.name}</span>
                                      </div>
                                  </td>
                                  <td className="p-4 text-muted-foreground">{user.email}</td>
                                  <td className="p-4">
                                      <Badge variant={roleBadgeVariant[user.role] as any} className="capitalize">{user.role}</Badge>
                                  </td>
                                  <td className="p-4 text-muted-foreground">
                                      {user.createdAt ? format(new Date(user.createdAt), 'PPP') : 'N/A'}
                                  </td>
                                  <td className="p-4 text-right">
                                      {isDeleting === user.id ? (
                                          <Button variant="destructive" size="icon" disabled>
                                              <Loader2 className="h-4 w-4 animate-spin" />
                                          </Button>
                                      ) : (
                                          <AlertDialog>
                                              <AlertDialogTrigger asChild>
                                                  <Button variant="destructive" size="icon">
                                                      <Trash2 className="h-4 w-4" />
                                                  </Button>
                                              </AlertDialogTrigger>
                                              <AlertDialogContent>
                                                  <AlertDialogHeader>
                                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                  <AlertDialogDescription>
                                                      This action cannot be undone. This will permanently delete the user '{user.name}' and all of their associated data.
                                                  </AlertDialogDescription>
                                                  </AlertDialogHeader>
                                                  <AlertDialogFooter>
                                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                  <AlertDialogAction onClick={() => handleDeleteUser(user.id)} className="bg-destructive hover:bg-destructive/90">
                                                      Delete
                                                  </AlertDialogAction>
                                                  </AlertDialogFooter>
                                              </AlertDialogContent>
                                          </AlertDialog>
                                      )}
                                  </td>
                              </tr>
                          ))
                      )}
                  </tbody>
              </table>
            </div>


             {!isLoading && users.length === 0 && !error && (
                <div className="text-center py-12 text-muted-foreground">
                    <p>No manageable users found.</p>
                </div>
            )}
        </CardContent>
      </Card>
    </div>
  );
}

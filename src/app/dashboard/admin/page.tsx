
'use client';

import { useEffect, useState } from 'react';
import { User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
        // Exclude the current admin from the list to prevent self-deletion UI
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
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading ? (
                        [...Array(5)].map((_, i) => (
                            <TableRow key={i}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Skeleton className="h-10 w-10 rounded-full" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                </TableCell>
                                <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                                <TableCell><Skeleton className="h-6 w-20 rounded-full" /></TableCell>
                                <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                <TableCell className="text-right"><Skeleton className="h-9 w-9 rounded-sm ml-auto" /></TableCell>
                            </TableRow>
                        ))
                    ) : (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                                            <AvatarImage src={user.avatarUrl} alt={user.name} />
                                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{user.name}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                <TableCell>
                                    <Badge variant={roleBadgeVariant[user.role] as any} className="capitalize">{user.role}</Badge>
                                </TableCell>
                                <TableCell className="text-muted-foreground">
                                    {user.createdAt ? format(new Date(user.createdAt), 'PPP') : 'N/A'}
                                </TableCell>
                                <TableCell className="text-right">
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
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
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

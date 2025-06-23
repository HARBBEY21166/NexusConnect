
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";

const formSchema = z.object({
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
});

export function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const urlToken = searchParams.get('token');
        if (urlToken) {
            setToken(urlToken);
        } else {
            setError("No reset token found. Please request a new reset link.");
        }
    }, [searchParams]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!token) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password: values.password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast({
                    title: "Password Reset Successful",
                    description: "You can now log in with your new password.",
                });
                router.push('/login');
            } else {
                 throw new Error(data.message || "Failed to reset password.");
            }
        } catch (err: any) {
            toast({
                title: "Reset Failed",
                description: err.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    if (error) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Invalid Link</CardTitle>
                    <CardDescription>{error}</CardDescription>
                </CardHeader>
                <CardContent>
                     <Link href="/forgot-password">
                        <Button className="w-full">Request a New Link</Button>
                    </Link>
                </CardContent>
            </Card>
        )
    }
    
    if (!token) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Validating...</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Set New Password</CardTitle>
                <CardDescription>Please choose a new password for your account.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="••••••••" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                             Reset Password
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}

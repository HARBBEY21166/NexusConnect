
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
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export function ForgotPasswordForm() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                toast({
                    title: "Check your email",
                    description: data.message,
                });
                setIsSubmitted(true);
            } else {
                throw new Error(data.message || "An unexpected error occurred.");
            }
        } catch (error: any) {
            console.error("Forgot password error:", error);
            toast({
                title: "Request Failed",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    if (isSubmitted) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Request Sent</CardTitle>
                    <CardDescription>If an account exists for the email you entered, you will receive a password reset link shortly.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Link href="/login">
                        <Button className="w-full">Back to Login</Button>
                    </Link>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Forgot Your Password?</CardTitle>
                <CardDescription>No problem. Enter your email and we'll send you a link to reset it.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name@example.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                             Send Reset Link
                        </Button>
                    </form>
                </Form>
                <div className="mt-4 text-center text-sm">
                    Remembered your password?{" "}
                    <Link href="/login" className="underline" prefetch={false}>
                        Login
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

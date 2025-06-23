
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
import { Textarea } from "@/components/ui/textarea";
import { User } from "@/lib/types";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface OnboardingFormProps {
  user: User;
}

// Create a dynamic schema based on user role
const createFormSchema = (role: User['role']) => {
    let schema = z.object({
        name: z.string().min(2, "Name must be at least 2 characters."),
        bio: z.string().min(20, "Bio must be at least 20 characters.").max(500, "Bio must not exceed 500 characters."),
        startupName: z.string().optional(),
        startupDescription: z.string().optional(),
        investmentInterests: z.string().optional(),
    });

    if (role === 'entrepreneur') {
        schema = schema.extend({
            startupName: z.string().min(2, "Startup name is required."),
            startupDescription: z.string().min(20, "Startup description must be at least 20 characters."),
        });
    }

    if (role === 'investor') {
        schema = schema.extend({
            investmentInterests: z.string().min(3, "Please list at least one investment interest."),
        });
    }

    return schema;
}


export function OnboardingForm({ user }: OnboardingFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const formSchema = createFormSchema(user.role);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || "",
      bio: user.bio || "",
      startupName: user.startupName || "",
      startupDescription: user.startupDescription || "",
      investmentInterests: user.investmentInterests?.join(", ") || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const authDataString = localStorage.getItem("nexus-auth");
      if (!authDataString) throw new Error("Authentication failed.");
      const { token } = JSON.parse(authDataString);

      const payload = {
          ...values,
          hasCompletedOnboarding: true,
      };

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast({
            title: "Profile Complete!",
            description: "Welcome to NexusConnect. You're all set.",
        });

        // Update user data in localStorage
        const authData = JSON.parse(authDataString);
        authData.user = data.user;
        localStorage.setItem("nexus-auth", JSON.stringify(authData));

        // Redirect to dashboard
        router.push(`/dashboard/${data.user.role}`);

      } else {
        throw new Error(data.message || "Failed to update profile.");
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 py-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="John Doe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Your Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about your background, experience, and what you're passionate about..." {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {user.role === 'entrepreneur' && (
          <>
            <h3 className="font-semibold text-lg border-t pt-4 mt-2">Your Venture</h3>
            <FormField
              control={form.control}
              name="startupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Startup Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Innovatech" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startupDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Startup Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe your startup's mission, problem it solves, and its target audience." {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {user.role === 'investor' && (
          <>
            <h3 className="font-semibold text-lg border-t pt-4 mt-2">Your Focus</h3>
            <FormField
              control={form.control}
              name="investmentInterests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Interests</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., SaaS, FinTech, AI, HealthTech" {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">Enter interests separated by commas.</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit" disabled={isLoading} className="mt-4 w-full md:w-auto md:ml-auto">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Complete Profile & Continue
        </Button>
      </form>
    </Form>
  );
}

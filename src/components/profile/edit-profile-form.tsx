
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

interface EditProfileFormProps {
  user: User;
  onUpdateSuccess: () => void;
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  avatarUrl: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
  bio: z.string().min(10, "Bio must be at least 10 characters.").max(500, "Bio must not exceed 500 characters."),
  // Entrepreneur fields
  startupName: z.string().optional(),
  startupDescription: z.string().optional(),
  fundingNeeds: z.string().optional(),
  // Investor fields
  investmentInterests: z.string().optional(),
});

export function EditProfileForm({ user, onUpdateSuccess }: EditProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name || "",
      avatarUrl: user.avatarUrl || "",
      bio: user.bio || "",
      startupName: user.startupName || "",
      startupDescription: user.startupDescription || "",
      fundingNeeds: user.fundingNeeds || "",
      investmentInterests: user.investmentInterests?.join(", ") || "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const authDataString = localStorage.getItem("nexus-auth");
      if (!authDataString) throw new Error("Authentication failed.");
      const { token } = JSON.parse(authDataString);

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onUpdateSuccess();
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
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
          name="avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Avatar URL</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/avatar.png" {...field} />
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
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea placeholder="Tell us about yourself..." {...field} rows={4} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {user.role === 'entrepreneur' && (
          <>
            <h3 className="font-semibold text-lg border-t pt-4 mt-2">Startup Details</h3>
            <FormField
              control={form.control}
              name="startupName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Startup Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your startup's name" {...field} />
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
                    <Textarea placeholder="Describe your startup" {...field} rows={3} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="fundingNeeds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funding Needs</FormLabel>
                  <FormControl>
                    <Input placeholder="$500,000 for..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        {user.role === 'investor' && (
          <>
            <h3 className="font-semibold text-lg border-t pt-4 mt-2">Investor Details</h3>
            <FormField
              control={form.control}
              name="investmentInterests"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Investment Interests</FormLabel>
                  <FormControl>
                    <Input placeholder="SaaS, FinTech, AI..." {...field} />
                  </FormControl>
                  <p className="text-xs text-muted-foreground">Enter interests separated by commas.</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}

        <Button type="submit" disabled={isLoading} className="mt-4">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </Form>
  );
}

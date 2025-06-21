"use client";

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { optimizeProfile } from '@/ai/flows/profile-optimizer';
import { Wand2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const profileSchema = z.object({
  profileDraft: z.string().min(20, "Please provide a bio of at least 20 characters."),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileOptimizerProps {
  currentBio: string;
}

export function ProfileOptimizer({ currentBio }: ProfileOptimizerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      profileDraft: currentBio,
    },
  });

  const handleOptimize = async (data: ProfileFormValues) => {
    setIsLoading(true);
    try {
      const result = await optimizeProfile(data);
      if (result.optimizedProfile) {
        setValue('profileDraft', result.optimizedProfile, { shouldValidate: true });
        toast({
          title: "Profile Polished!",
          description: "Your bio has been optimized by AI.",
        });
      }
    } catch (error) {
      console.error("Error optimizing profile:", error);
       toast({
        title: "Optimization Failed",
        description: "Could not optimize the profile at this time.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleOptimize)} className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Use our AI tool to refine your bio for maximum impact.
      </p>
      <Controller
        name="profileDraft"
        control={control}
        render={({ field }) => (
          <Textarea
            {...field}
            placeholder="Tell us about yourself and your venture..."
            rows={6}
            className="resize-none"
          />
        )}
      />
      {errors.profileDraft && (
        <p className="text-sm text-destructive">{errors.profileDraft.message}</p>
      )}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Wand2 className="mr-2 h-4 w-4" />
        )}
        Optimize with AI
      </Button>
    </form>
  );
}

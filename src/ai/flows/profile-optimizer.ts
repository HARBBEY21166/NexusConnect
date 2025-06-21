// src/ai/flows/profile-optimizer.ts
'use server';
/**
 * @fileOverview A profile optimization AI agent.
 *
 * - optimizeProfile - A function that handles the profile optimization process.
 * - OptimizeProfileInput - The input type for the optimizeProfile function.
 * - OptimizeProfileOutput - The return type for the optimizeProfile function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeProfileInputSchema = z.object({
  profileDraft: z.string().describe('A draft of the entrepreneur profile.'),
});
export type OptimizeProfileInput = z.infer<typeof OptimizeProfileInputSchema>;

const OptimizeProfileOutputSchema = z.object({
  optimizedProfile: z
    .string()
    .describe('The optimized entrepreneur profile for investor appeal.'),
});
export type OptimizeProfileOutput = z.infer<typeof OptimizeProfileOutputSchema>;

export async function optimizeProfile(input: OptimizeProfileInput): Promise<OptimizeProfileOutput> {
  return optimizeProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeProfilePrompt',
  input: {schema: OptimizeProfileInputSchema},
  output: {schema: OptimizeProfileOutputSchema},
  prompt: `You are an expert profile optimizer, specializing in making entrepreneur profiles appealing to investors.

  You will rewrite the profile to maximize clarity, attractiveness and investor appeal, ensuring conciseness, and a professional tone.

  Original Profile: {{{profileDraft}}}`,
});

const optimizeProfileFlow = ai.defineFlow(
  {
    name: 'optimizeProfileFlow',
    inputSchema: OptimizeProfileInputSchema,
    outputSchema: OptimizeProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

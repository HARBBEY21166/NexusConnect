import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Rocket, Briefcase, MessageSquare, Handshake } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-card border-b">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <Handshake className="h-6 w-6 text-primary" />
          <span className="sr-only">NexusConnect</span>
        </Link>
        <h1 className="ml-4 text-2xl font-bold text-foreground">NexusConnect</h1>
        <nav className="ml-auto items-center flex gap-4 sm:gap-6">
          <Link href="/login" className="text-sm font-medium hover:underline underline-offset-4" prefetch={false}>
            Login
          </Link>
          <Button asChild>
            <Link href="/register" prefetch={false}>Register</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Where Visionaries and Investors Unite
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    NexusConnect is the premier platform for groundbreaking entrepreneurs to connect with strategic investors and build the future, together.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button asChild size="lg">
                    <Link href="/register" prefetch={false}>Get Started</Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link href="#" prefetch={false}>Learn More</Link>
                  </Button>
                </div>
              </div>
              <Image
                src="https://i.pinimg.com/736x/52/c1/4c/52c14c33cad5209fecb0bfb09efb803a.jpg"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="business meeting"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
              />
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-card">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Everything you need to connect and grow</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform is designed to facilitate meaningful connections with features tailored for both entrepreneurs and investors.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:max-w-none mt-12">
              <Card className="p-6">
                <CardContent className="grid gap-4 p-0">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full p-3">
                        <Rocket className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">For Entrepreneurs</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Showcase your vision, polish your profile with AI, and find the right investors to fuel your growth.
                  </p>
                </CardContent>
              </Card>
              <Card className="p-6">
                <CardContent className="grid gap-4 p-0">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full p-3">
                        <Briefcase className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">For Investors</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Discover curated, high-potential startups that match your investment thesis and portfolio.
                  </p>
                </CardContent>
              </Card>
              <Card className="p-6">
                <CardContent className="grid gap-4 p-0">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary text-primary-foreground rounded-full p-3">
                        <MessageSquare className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">Seamless Communication</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Engage in direct, real-time conversations with our integrated chat to discuss opportunities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 NexusConnect. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

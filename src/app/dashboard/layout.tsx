
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Handshake,
  LayoutDashboard,
  LogOut,
  User as UserIcon,
  MessageSquare,
  Search,
  Menu,
  Moon,
  Sun,
} from "lucide-react";
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";

type AuthData = {
  user: User;
  token: string;
}

function DashboardNav({ user }: { user: User }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("nexus-auth");
    router.push("/login");
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={true} // Simplified for example
        >
          <Link href={`/dashboard/${user.role}`}>
            <LayoutDashboard />
            Dashboard
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {user.role === 'entrepreneur' && (
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href="/dashboard/investor-discovery">
              <Search />
              Discover Investors
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
        >
          <Link href={`/dashboard/profile/${user.role}/${user.id}`}>
            <UserIcon />
            Profile
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
        >
          <Link href="/dashboard/chat">
            <MessageSquare />
            Chat
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <SidebarMenuItem>
        <SidebarMenuButton onClick={handleLogout}>
          <LogOut />
          Logout
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function MobileNav({ user }: { user: User }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="shrink-0 md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <nav className="grid gap-2 text-lg font-medium">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold mb-4"
          >
            <Handshake className="h-6 w-6 text-primary" />
            <span>NexusConnect</span>
          </Link>
          <Link
            href={`/dashboard/${user.role}`}
            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
           {user.role === 'entrepreneur' && (
             <Link
              href="/dashboard/investor-discovery"
              className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
            >
              <Search className="h-5 w-5" />
              Discover Investors
            </Link>
          )}
           <Link
            href={`/dashboard/profile/${user.role}/${user.id}`}
            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            <UserIcon className="h-5 w-5" />
            Profile
          </Link>
          <Link
            href="/dashboard/chat"
            className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
          >
            <MessageSquare className="h-5 w-5" />
            Chat
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function UserMenu({ user }: { user: User }) {
    const router = useRouter();
    const { setTheme, theme } = useTheme();

    const handleLogout = () => {
        localStorage.removeItem("nexus-auth");
        router.push("/login");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full">
                    <Avatar>
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push(`/dashboard/profile/${user.role}/${user.id}`)}>Profile</DropdownMenuItem>
                 <DropdownMenuItem onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                    <Sun className="h-4 w-4 mr-2 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 mr-2 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    Toggle Theme
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

function PageHeader({ user }: { user: User | null }) {
  if (!user) {
    return (
        <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
            <div className="w-full flex-1">
                <Skeleton className="h-8 w-1/2" />
            </div>
            <Skeleton className="h-10 w-10 rounded-full" />
        </header>
    );
  }

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
        <MobileNav user={user} />
        <div className="w-full flex-1">
          <form>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search profiles..."
                className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
              />
            </div>
          </form>
        </div>
        <UserMenu user={user} />
    </header>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authDataString = localStorage.getItem("nexus-auth");
    if (authDataString) {
      try {
        const authData: AuthData = JSON.parse(authDataString);
        if (authData.user && authData.token) {
            setUser(authData.user);
        } else {
            router.push("/login");
        }
      } catch (error) {
        console.error("Failed to parse auth data", error);
        router.push("/login");
      }
    } else {
      router.push("/login");
    }
    setIsLoading(false);
  }, [router]);

  if (isLoading) {
    return (
        <div className="flex min-h-screen w-full">
            <div className="hidden md:block w-64 border-r p-4 space-y-4">
                <Skeleton className="h-10 w-40" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
            <div className="flex-1">
                 <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
                    <div className="w-full flex-1">
                        <Skeleton className="h-8 w-1/2" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-full" />
                </header>
                <main className="p-4"><Skeleton className="h-64 w-full" /></main>
            </div>
        </div>
    );
  }
  
  if (!user) {
    return null;
  }

  return (
    <SidebarProvider>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <div className="hidden md:block">
              <Sidebar>
                <SidebarHeader>
                  <Link href="#" className="flex items-center gap-2 font-semibold">
                    <Handshake className="h-6 w-6 text-primary" />
                    <span>NexusConnect</span>
                  </Link>
                </SidebarHeader>
                <SidebarContent>
                  <DashboardNav user={user} />
                </SidebarContent>
              </Sidebar>
            </div>
            <div className="flex flex-col sm:gap-4 sm:py-4 md:pl-64">
                <PageHeader user={user} />
                <main className="flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                    {children}
                </main>
            </div>
        </div>
    </SidebarProvider>
  );
}

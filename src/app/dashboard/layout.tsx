
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
  Bookmark
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
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { User } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";


type AuthData = {
  user: User;
  token: string;
}

function DashboardNav({ user }: { user: User }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("nexus-auth");
    router.push("/login");
  };
  
  const dashboardPath = user.role === 'admin' ? '/dashboard/admin' : `/dashboard/${user.role}`;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          isActive={pathname === dashboardPath}
        >
          <Link href={dashboardPath}>
            <LayoutDashboard />
            Dashboard
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
      {(user.role === 'entrepreneur' || user.role === 'admin') && (
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname === '/dashboard/investor-discovery'}>
            <Link href="/dashboard/investor-discovery">
              <Search />
              {user.role === 'admin' ? 'All Investors' : 'Discover Investors'}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
       {(user.role === 'investor' || user.role === 'admin') && (
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname === '/dashboard/investor'}>
            <Link href="/dashboard/investor">
              <Search />
               {user.role === 'admin' ? 'All Entrepreneurs' : 'Discover Entrepreneurs'}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
       {(user.role === 'investor' || user.role === 'entrepreneur') && (
        <SidebarMenuItem>
          <SidebarMenuButton asChild isActive={pathname === '/dashboard/bookmarks'}>
            <Link href="/dashboard/bookmarks">
              <Bookmark />
              Bookmarks
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      )}
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
           isActive={pathname.startsWith(`/dashboard/profile/`)}
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
           isActive={pathname.startsWith('/dashboard/chat')}
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
  const router = useRouter();
  const pathname = usePathname();
  const dashboardPath = user.role === 'admin' ? '/dashboard/admin' : `/dashboard/${user.role}`;

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
            href={dashboardPath}
            className="flex items-center gap-2 text-lg font-semibold mb-4"
          >
            <Handshake className="h-6 w-6 text-primary" />
            <span>NexusConnect</span>
          </Link>
          <Link
            href={dashboardPath}
            className={cn("mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground", { "bg-muted text-foreground": pathname === dashboardPath})}
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
           {(user.role === 'entrepreneur' || user.role === 'admin') && (
             <Link
              href="/dashboard/investor-discovery"
              className={cn("mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground", { "bg-muted text-foreground": pathname === '/dashboard/investor-discovery' })}
            >
              <Search className="h-5 w-5" />
              {user.role === 'admin' ? 'All Investors' : 'Discover Investors'}
            </Link>
          )}
           {(user.role === 'investor' || user.role === 'admin') && (
             <Link
              href="/dashboard/investor"
               className={cn("mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground", { "bg-muted text-foreground": pathname === '/dashboard/investor' })}
            >
              <Search className="h-5 w-5" />
              {user.role === 'admin' ? 'All Entrepreneurs' : 'Discover Entrepreneurs'}
            </Link>
          )}
          {(user.role === 'investor' || user.role === 'entrepreneur') && (
             <Link
              href="/dashboard/bookmarks"
               className={cn("mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground", { "bg-muted text-foreground": pathname === '/dashboard/bookmarks' })}
            >
              <Bookmark className="h-5 w-5" />
              Bookmarks
            </Link>
          )}
           <Link
            href={`/dashboard/profile/${user.role}/${user.id}`}
            className={cn("mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground", { "bg-muted text-foreground": pathname.startsWith('/dashboard/profile')})}
          >
            <UserIcon className="h-5 w-5" />
            Profile
          </Link>
          <Link
            href="/dashboard/chat"
            className={cn("mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground", { "bg-muted text-foreground": pathname.startsWith('/dashboard/chat')})}
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  useEffect(() => {
    const isSearchable = pathname === '/dashboard/investor' || pathname === '/dashboard/investor-discovery';
    if (isSearchable) {
       setSearchTerm(searchParams.get("q") || "");
    } else {
       setSearchTerm("");
    }
  }, [searchParams, pathname]);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const targetPath = user?.role === 'entrepreneur' ? '/dashboard/investor-discovery' : '/dashboard/investor';
    const params = new URLSearchParams();
    if (searchTerm) {
      params.set("q", searchTerm);
    }
    router.push(`${targetPath}?${params.toString()}`);
  };


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

  const isSearchablePage = pathname === '/dashboard/investor' || pathname === '/dashboard/investor-discovery';

  return (
    <header className="flex h-14 items-center gap-4 border-b bg-card px-4 lg:h-[60px] lg:px-6">
        <MobileNav user={user} />
        <div className="w-full flex-1">
          {isSearchablePage && (
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={user.role === 'investor' ? "Search entrepreneurs..." : "Search investors..."}
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          )}
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
    // This can happen briefly before the redirect to /login
    return null;
  }
  
  const dashboardPath = user.role === 'admin' ? '/dashboard/admin' : `/dashboard/${user.role}`;

  return (
    <SidebarProvider>
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <div className="hidden md:block">
              <Sidebar>
                <SidebarHeader>
                  <Link href={dashboardPath} className="flex items-center gap-2 font-semibold">
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

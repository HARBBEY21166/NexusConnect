"use client";

import { useState, useEffect, useRef, FormEvent } from 'react';
import Link from 'next/link';
import { User, ChatMessage } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { SendHorizonal, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface ChatLayoutProps {
  selectedUserId: string | null;
}

type AuthUser = {
  id: string;
  name: string;
  role: 'investor' | 'entrepreneur';
  avatarUrl: string;
}

export function ChatLayout({ selectedUserId }: ChatLayoutProps) {
  const [loggedInUser, setLoggedInUser] = useState<AuthUser | null>(null);
  const [contacts, setContacts] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const getToken = () => {
    const authDataString = localStorage.getItem("nexus-auth");
    if (!authDataString) return null;
    return JSON.parse(authDataString).token;
  }
  
  useEffect(() => {
    const authDataString = localStorage.getItem("nexus-auth");
    if (authDataString) {
      const { user } = JSON.parse(authDataString);
      setLoggedInUser(user);
    }
  }, []);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
        const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
        if (viewport) {
            viewport.scrollTop = viewport.scrollHeight;
        }
    }
  };

  useEffect(() => {
    setTimeout(() => scrollToBottom(), 100);
  }, [messages]);


  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoadingContacts(true);
      setError(null);
      const token = getToken();
      if (!token) {
        setError("Authentication failed.");
        setIsLoadingContacts(false);
        return;
      }
      try {
        const response = await fetch('/api/users', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setContacts(data.users);
          if (selectedUserId) {
            const foundUser = data.users.find((u: User) => u.id === selectedUserId);
            setSelectedUser(foundUser || null);
          }
        } else {
          throw new Error(data.message || "Failed to fetch contacts.");
        }
      } catch (err: any) {
        setError(err.message);
        toast({ title: "Error", description: err.message, variant: "destructive" });
      } finally {
        setIsLoadingContacts(false);
      }
    };
    fetchContacts();
  }, [selectedUserId, toast]);


  useEffect(() => {
    if (!selectedUserId) {
        setMessages([]);
        setSelectedUser(null);
        return;
    };

    const fetchMessages = async () => {
      setIsLoadingMessages(true);
      setError(null);
      const token = getToken();
      if (!token) {
        setError("Authentication failed.");
        setIsLoadingMessages(false);
        return;
      }
      try {
        const response = await fetch(`/api/chat/${selectedUserId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          const formattedMessages = data.messages.map((msg: any) => ({
              id: msg._id,
              senderId: msg.senderId._id,
              receiverId: msg.receiverId._id,
              message: msg.message,
              timestamp: msg.createdAt,
              read: true,
          }));
          setMessages(formattedMessages);
        } else {
          throw new Error(data.message || "Failed to fetch messages.");
        }
      } catch (err: any) {
        setError(err.message);
        toast({ title: "Error", description: err.message, variant: "destructive" });
      } finally {
        setIsLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedUserId, toast]);


  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedUserId || !loggedInUser) return;
    
    const token = getToken();
    if (!token) {
        toast({ title: "Error", description: "You are not logged in.", variant: "destructive" });
        return;
    }

    const tempId = `optimistic-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: tempId,
      senderId: loggedInUser.id,
      receiverId: selectedUserId,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };
    setMessages(prev => [...prev, newMsg]);
    const messageToSend = newMessage;
    setNewMessage('');


    try {
        const response = await fetch(`/api/chat/${selectedUserId}`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ message: messageToSend.trim() })
        });
        const data = await response.json();
        if (data.success) {
            const returnedMsg = data.message;
            const formattedMessage = {
                 id: returnedMsg._id,
                 senderId: returnedMsg.senderId._id,
                 receiverId: returnedMsg.receiverId._id,
                 message: returnedMsg.message,
                 timestamp: returnedMsg.createdAt,
                 read: true,
            };
            setMessages(prev => prev.map(m => m.id === tempId ? formattedMessage : m));
        } else {
            throw new Error(data.message || "Failed to send message.");
        }
    } catch(err: any) {
        toast({ title: "Error sending message", description: err.message, variant: "destructive"});
        setMessages(prev => prev.filter(m => m.id !== tempId));
        setNewMessage(messageToSend);
    }
  };

  return (
    <div className="grid h-[calc(100vh-120px)] w-full grid-cols-[280px_1fr]">
      <div className="flex flex-col border-r bg-card">
        <div className="p-4">
          <form>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search contacts..." className="pl-8" />
            </div>
          </form>
        </div>
        <ScrollArea className="flex-1">
          <nav className="grid gap-1 p-2">
            {isLoadingContacts ? (
                <div className="space-y-2 p-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex items-center gap-3 rounded-lg px-3 py-2">
                            <Skeleton className="h-9 w-9 rounded-full" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <p className="p-4 text-sm text-destructive">{error}</p>
            ) : (
              contacts.map(contact => (
                <Link
                  key={contact.id}
                  href={`/chat/${contact.id}`}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-accent-foreground',
                    selectedUser?.id === contact.id && 'bg-accent text-accent-foreground'
                  )}
                >
                  <Avatar className="h-9 w-9">
                      <AvatarImage src={contact.avatarUrl} alt={contact.name} />
                      <AvatarFallback>{contact.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 truncate">
                      <div className="font-medium">{contact.name}</div>
                      <div className="text-xs text-muted-foreground capitalize">{contact.role}</div>
                  </div>
                </Link>
              ))
            )}
          </nav>
        </ScrollArea>
      </div>
      <div className="flex flex-col">
        {selectedUser ? (
          <>
            <div className="flex items-center gap-4 p-4 border-b">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedUser.avatarUrl} alt={selectedUser.name} />
                    <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <div className="font-semibold">{selectedUser.name}</div>
                    <div className="text-xs text-muted-foreground">Online</div>
                </div>
            </div>
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {isLoadingMessages ? (
                    <div className="space-y-4">
                         <div className="flex items-end gap-2 justify-start">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-12 w-48 rounded-lg" />
                        </div>
                        <div className="flex items-end gap-2 justify-end">
                            <Skeleton className="h-16 w-64 rounded-lg" />
                        </div>
                        <div className="flex items-end gap-2 justify-start">
                            <Skeleton className="h-8 w-8 rounded-full" />
                            <Skeleton className="h-10 w-32 rounded-lg" />
                        </div>
                    </div>
                ) : (
                  messages.map(msg => (
                    <div
                      key={msg.id}
                      className={cn(
                        'flex items-end gap-2',
                        msg.senderId === loggedInUser?.id ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {msg.senderId !== loggedInUser?.id && (
                          <Avatar className="h-8 w-8">
                              <AvatarImage src={selectedUser.avatarUrl} alt={selectedUser.name} />
                              <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                      )}
                      <div
                        className={cn(
                          'max-w-xs rounded-lg p-3 text-sm md:max-w-md',
                          msg.senderId === loggedInUser?.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        <p>{msg.message}</p>
                        <p className={cn("text-xs mt-1", msg.senderId === loggedInUser?.id ? 'text-primary-foreground/70' : 'text-muted-foreground/70' )}>
                            {msg.timestamp && format(new Date(msg.timestamp), 'p')}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            <div className="border-t p-4">
              <form className="relative" onSubmit={handleSendMessage}>
                <Input 
                    placeholder="Type a message..." 
                    className="pr-12"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={isLoadingMessages}
                />
                <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8" disabled={isLoadingMessages || !newMessage.trim()}>
                  <SendHorizonal className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <p className="text-xl font-medium">Select a contact to start chatting</p>
              <p className="text-muted-foreground">Your conversations will appear here.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

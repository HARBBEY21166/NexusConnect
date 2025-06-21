"use client";

import { useState } from 'react';
import Link from 'next/link';
import { User, ChatMessage } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { SendHorizonal, Search } from 'lucide-react';
import { format } from 'date-fns';

interface ChatLayoutProps {
  contacts: User[];
  selectedUser: User | null;
  loggedInUserId: string;
  allMessages: ChatMessage[];
}

export function ChatLayout({ contacts, selectedUser, loggedInUserId, allMessages }: ChatLayoutProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(
      allMessages.filter(
        msg => (msg.senderId === loggedInUserId && msg.receiverId === selectedUser?.id) ||
               (msg.senderId === selectedUser?.id && msg.receiverId === loggedInUserId)
      )
  );
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedUser) return;
    const msg: ChatMessage = {
      id: `msg${Date.now()}`,
      senderId: loggedInUserId,
      receiverId: selectedUser.id,
      message: newMessage.trim(),
      timestamp: new Date().toISOString(),
      read: true,
    };
    setMessages([...messages, msg]);
    setNewMessage('');
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
            {contacts.map(contact => (
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
            ))}
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
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={cn(
                      'flex items-end gap-2',
                      msg.senderId === loggedInUserId ? 'justify-end' : 'justify-start'
                    )}
                  >
                    {msg.senderId !== loggedInUserId && (
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={selectedUser.avatarUrl} alt={selectedUser.name} />
                            <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                    )}
                    <div
                      className={cn(
                        'max-w-xs rounded-lg p-3 text-sm md:max-w-md',
                        msg.senderId === loggedInUserId
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <p>{msg.message}</p>
                      <p className={cn("text-xs mt-1", msg.senderId === loggedInUserId ? 'text-primary-foreground/70' : 'text-muted-foreground/70' )}>
                          {format(new Date(msg.timestamp), 'p')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <div className="border-t p-4">
              <form className="relative" onSubmit={handleSendMessage}>
                <Input 
                    placeholder="Type a message..." 
                    className="pr-12"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <Button type="submit" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
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

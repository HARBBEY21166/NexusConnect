
"use client";

import { useState } from 'react';
import { CollaborationRequest } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface RequestItemProps {
  request: CollaborationRequest;
  onUpdate: () => void;
}

export function RequestItem({ request, onUpdate }: RequestItemProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = async (status: 'accepted' | 'rejected') => {
    setIsLoading(true);
    try {
       const authDataString = localStorage.getItem("nexus-auth");
        if (!authDataString) {
            throw new Error("Authentication not found.");
        }
        const { token } = JSON.parse(authDataString);

        const response = await fetch(`/api/requests/${request.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status }),
        });

        const data = await response.json();
        if (response.ok && data.success) {
            onUpdate();
        } else {
            throw new Error(data.message || 'Failed to update request');
        }
    } catch (error: any) {
        toast({
            title: "Update Failed",
            description: error.message,
            variant: "destructive"
        });
    } finally {
        setIsLoading(false);
    }
  }

  const statusVariant = {
    pending: 'default',
    accepted: 'secondary',
    rejected: 'destructive',
  };

  const statusText = {
    pending: 'Pending',
    accepted: 'Accepted',
    rejected: 'Rejected',
  };
  
  return (
    <div className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src={request.investorAvatarUrl} alt={request.investorName} />
          <AvatarFallback>{request.investorName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="grid gap-1">
          <p className="font-semibold">{request.investorName}</p>
          <p className="text-sm text-muted-foreground">
            Sent {formatDistanceToNow(new Date(request.timestamp), { addSuffix: true })}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Badge variant={statusVariant[request.status] as any}>{statusText[request.status]}</Badge>
        {request.status === 'pending' && (
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={() => handleStatusChange('rejected')} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reject
            </Button>
            <Button size="sm" onClick={() => handleStatusChange('accepted')} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Accept
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

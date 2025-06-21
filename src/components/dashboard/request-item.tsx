"use client";

import { useState } from 'react';
import { CollaborationRequest } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface RequestItemProps {
  request: CollaborationRequest;
}

export function RequestItem({ request: initialRequest }: RequestItemProps) {
  const [request, setRequest] = useState(initialRequest);

  const handleStatusChange = (status: 'accepted' | 'rejected') => {
    setRequest(prev => ({ ...prev, status }));
  }

  const statusVariant = {
    pending: 'default',
    accepted: 'secondary', // Using a different color for accepted
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
            <Button size="sm" variant="outline" onClick={() => handleStatusChange('rejected')}>Reject</Button>
            <Button size="sm" onClick={() => handleStatusChange('accepted')}>Accept</Button>
          </div>
        )}
      </div>
    </div>
  );
}

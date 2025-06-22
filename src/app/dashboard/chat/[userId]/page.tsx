
import { ChatLayout } from "@/components/chat/chat-layout";
import { Suspense } from "react";

export default function ChatPage({ params }: { params: { userId: string } }) {
  const selectedUserId = params.userId;
  
  return (
    <Suspense fallback={<div>Loading chat...</div>}>
      <ChatLayout 
        selectedUserId={selectedUserId}
      />
    </Suspense>
  );
}

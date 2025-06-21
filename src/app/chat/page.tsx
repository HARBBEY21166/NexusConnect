import { ChatLayout } from "@/components/chat/chat-layout";
import { Suspense } from "react";

export default function ChatRootPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatLayout selectedUserId={null} />
    </Suspense>
  );
}

import { ChatLayout } from "@/components/chat/chat-layout";
import { getUserById, users, messages as allMessages } from "@/lib/data";

export default function ChatPage({ params }: { params: { userId: string } }) {
  const selectedUserId = params.userId;
  const selectedUser = getUserById(selectedUserId);
  
  // For the purpose of this mock, the logged-in user is hardcoded.
  // In a real app, this would come from session/auth context.
  const loggedInUserId = '2'; 

  const contacts = users.filter(u => u.id !== loggedInUserId);

  return (
    <ChatLayout 
      contacts={contacts} 
      selectedUser={selectedUser} 
      loggedInUserId={loggedInUserId}
      allMessages={allMessages}
    />
  );
}

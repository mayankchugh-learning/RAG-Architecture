import { useEffect, useState } from "react";
import { Layout } from "@/components/Layout";
import { ChatInterface } from "@/components/ChatInterface";
import { useChats, useChat } from "@/hooks/use-chats";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare } from "lucide-react";
import { format } from "date-fns";

export default function ChatPage() {
  const { chats, createChat } = useChats();
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  
  // Create a new chat if none exist, or select the first one
  useEffect(() => {
    if (chats && chats.length > 0 && !activeChatId) {
      setActiveChatId(chats[0].id);
    }
  }, [chats, activeChatId]);

  const { messages, isLoading: isChatLoading, sendMessage, isSending } = useChat(activeChatId);

  const handleCreateChat = async () => {
    const newChat = await createChat(`New Chat ${new Date().toLocaleTimeString()}`);
    setActiveChatId(newChat.id);
  };

  return (
    <Layout>
      <div className="flex h-[calc(100vh-140px)] gap-6">
        {/* Chat Sidebar List (Hidden on mobile for MVP simplification) */}
        <div className="w-64 flex-shrink-0 hidden md:flex flex-col gap-4">
          <Button onClick={handleCreateChat} className="w-full justify-start shadow-sm" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            New Conversation
          </Button>
          
          <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin">
            {chats?.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChatId(chat.id)}
                className={`
                  p-3 rounded-xl cursor-pointer transition-all border
                  ${activeChatId === chat.id 
                    ? 'bg-card border-primary/50 shadow-md ring-1 ring-primary/20' 
                    : 'hover:bg-muted/50 border-transparent hover:border-border'
                  }
                `}
              >
                <p className="font-medium text-sm truncate">{chat.title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {format(new Date(chat.createdAt || new Date()), "MMM d, h:mm a")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 min-w-0">
          {activeChatId ? (
            <ChatInterface 
              messages={messages || []} 
              onSendMessage={(content) => sendMessage({ content })}
              isLoading={isChatLoading}
              isSending={isSending}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center border border-border border-dashed rounded-2xl bg-muted/10">
              <MessageSquare className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="text-lg font-medium">No conversation selected</h3>
              <Button onClick={handleCreateChat} variant="link" className="text-primary">
                Start a new chat
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

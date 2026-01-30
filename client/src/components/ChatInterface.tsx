import { useEffect, useRef, useState } from "react";
import { Message } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, User, Bot, Sparkles, StopCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { format } from "date-fns";

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  isSending: boolean;
}

export function ChatInterface({ messages, onSendMessage, isLoading, isSending }: ChatInterfaceProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isSending]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isSending) return;
    onSendMessage(input);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
        <Sparkles className="w-12 h-12 text-primary/20 mb-4 animate-pulse" />
        <p>Initializing secure channel...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-background rounded-2xl shadow-sm border border-border overflow-hidden">
      <ScrollArea className="flex-1 p-4 md:p-6">
        <div className="space-y-6 max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold font-display">Enterprise RAG Assistant</h3>
                <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                  Ask me anything about your uploaded documents. I can analyze contracts, reports, and technical documentation securely.
                </p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <Avatar className="h-8 w-8 border border-border bg-primary/5">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div
                  className={`flex flex-col max-w-[80%] ${
                    msg.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`
                      px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm
                      ${msg.role === "user" 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-muted/50 border border-border rounded-tl-none"
                      }
                    `}
                  >
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground mt-1 px-1">
                    {msg.createdAt ? format(new Date(msg.createdAt), "h:mm a") : "Just now"}
                  </span>
                </div>

                {msg.role === "user" && (
                  <Avatar className="h-8 w-8 border border-border">
                    <AvatarImage src={user?.profileImageUrl} />
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))
          )}
          
          {isSending && (
            <div className="flex gap-4 justify-start">
              <Avatar className="h-8 w-8 border border-border bg-primary/5">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-muted/50 border border-border px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 h-10">
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-100" />
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-200" />
                <div className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce delay-300" />
              </div>
            </div>
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <div className="p-4 bg-background border-t border-border">
        <div className="max-w-3xl mx-auto relative">
          <form 
            onSubmit={handleSubmit}
            className="relative flex items-end gap-2 bg-muted/30 border border-border rounded-xl p-2 focus-within:ring-2 focus-within:ring-primary/10 focus-within:border-primary/50 transition-all shadow-sm"
          >
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your documents..."
              className="min-h-[50px] max-h-[200px] border-none bg-transparent resize-none focus-visible:ring-0 px-3 py-3 text-sm scrollbar-thin placeholder:text-muted-foreground/60"
              rows={1}
            />
            <Button 
              type="submit" 
              size="icon"
              disabled={!input.trim() || isSending}
              className={`
                h-10 w-10 shrink-0 mb-0.5 rounded-lg transition-all
                ${input.trim() 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:shadow-lg' 
                  : 'bg-muted text-muted-foreground hover:bg-muted'
                }
              `}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="text-center mt-2">
            <p className="text-[10px] text-muted-foreground font-medium flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-emerald-500" />
              Enterprise Secure Environment • Confidential Level Amber
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper icon
function ShieldCheck({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

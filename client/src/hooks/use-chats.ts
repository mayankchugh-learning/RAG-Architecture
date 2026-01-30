import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export function useChats() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const chatsQuery = useQuery({
    queryKey: [api.chats.list.path],
    queryFn: async () => {
      const res = await fetch(api.chats.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch chats");
      return api.chats.list.responses[200].parse(await res.json());
    },
  });

  const createChatMutation = useMutation({
    mutationFn: async (title: string) => {
      const res = await fetch(api.chats.create.path, {
        method: api.chats.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to create chat");
      return api.chats.create.responses[201].parse(await res.json());
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [api.chats.list.path] });
    },
  });

  return {
    chats: chatsQuery.data,
    isLoading: chatsQuery.isLoading,
    createChat: createChatMutation.mutateAsync,
  };
}

export function useChat(id: number | null) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const chatQuery = useQuery({
    queryKey: [api.chats.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.chats.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch chat");
      return api.chats.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
    refetchInterval: (query) => {
      // If the last message is from user (role === 'user'), we should poll for the assistant response
      // This is a simple MVP strategy for "streaming" / async processing
      const messages = query.state.data?.messages;
      if (messages && messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.role === 'user') return 1000; // Poll every 1s
      }
      return false;
    }
  });

  const sendMessageMutation = useMutation({
    mutationFn: async ({ content }: { content: string }) => {
      if (!id) throw new Error("No chat selected");
      const url = buildUrl(api.chats.message.path, { id });
      const res = await fetch(url, {
        method: api.chats.message.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to send message");
      return api.chats.message.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.chats.get.path, id] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  return {
    chat: chatQuery.data?.chat,
    messages: chatQuery.data?.messages,
    isLoading: chatQuery.isLoading,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
  };
}

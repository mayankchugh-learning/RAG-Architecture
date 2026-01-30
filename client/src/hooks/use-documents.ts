import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

export function useDocuments() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const documentsQuery = useQuery({
    queryKey: [api.documents.list.path],
    queryFn: async () => {
      const res = await fetch(api.documents.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch documents");
      return api.documents.list.responses[200].parse(await res.json());
    },
  });

  const createDocumentMutation = useMutation({
    mutationFn: async (data: z.infer<typeof api.documents.create.input>) => {
      const res = await fetch(api.documents.create.path, {
        method: api.documents.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          throw new Error("Invalid document data");
        }
        throw new Error("Failed to create document record");
      }
      return api.documents.create.responses[201].parse(await res.json());
    },
    onSuccess: (newDoc) => {
      queryClient.invalidateQueries({ queryKey: [api.documents.list.path] });
      // Automatically trigger processing
      processDocumentMutation.mutate(newDoc.id);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save document metadata",
        variant: "destructive",
      });
    },
  });

  const processDocumentMutation = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.documents.process.path, { id });
      const res = await fetch(url, {
        method: api.documents.process.method,
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to start processing");
      return api.documents.process.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      toast({
        title: "Processing Started",
        description: "The document is being analyzed and indexed.",
      });
      queryClient.invalidateQueries({ queryKey: [api.documents.list.path] });
    },
    onError: () => {
      toast({
        title: "Processing Failed",
        description: "Could not start document processing.",
        variant: "destructive",
      });
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.documents.delete.path, { id });
      const res = await fetch(url, {
        method: api.documents.delete.method,
        credentials: "include",
      });
      
      if (!res.ok) throw new Error("Failed to delete document");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.documents.list.path] });
      toast({
        title: "Deleted",
        description: "Document removed successfully.",
      });
    },
  });

  return {
    documents: documentsQuery.data,
    isLoading: documentsQuery.isLoading,
    isError: documentsQuery.isError,
    createDocument: createDocumentMutation.mutate,
    processDocument: processDocumentMutation.mutate,
    deleteDocument: deleteDocumentMutation.mutate,
    isCreating: createDocumentMutation.isPending,
  };
}

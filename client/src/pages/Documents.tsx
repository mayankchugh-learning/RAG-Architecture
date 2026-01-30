import { useState } from "react";
import { Layout } from "@/components/Layout";
import { DocumentList } from "@/components/DocumentList";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useDocuments } from "@/hooks/use-documents";
import { Button } from "@/components/ui/button";
import { Plus, UploadCloud } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function DocumentsPage() {
  const { documents, isLoading, createDocument, deleteDocument } = useDocuments();
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold">Knowledge Base</h1>
            <p className="text-muted-foreground mt-1">Manage and organize your secure documents.</p>
          </div>
          <Button onClick={() => setIsUploadOpen(true)} className="shadow-lg shadow-primary/20">
            <Plus className="mr-2 h-4 w-4" />
            Add Document
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard 
            label="Total Documents" 
            value={documents?.length || 0} 
            description="Indexed and searchable" 
          />
          <StatCard 
            label="Storage Used" 
            value={`${((documents?.reduce((acc, doc) => acc + doc.size, 0) || 0) / (1024 * 1024)).toFixed(2)} MB`} 
            description="Total vector storage" 
          />
          <StatCard 
            label="Processing" 
            value={documents?.filter(d => d.status === 'processing').length || 0} 
            description="Currently in queue" 
          />
        </div>

        {/* Main List */}
        <DocumentList 
          documents={documents} 
          isLoading={isLoading} 
          onDelete={deleteDocument} 
        />
      </div>

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Documents</DialogTitle>
            <DialogDescription>
              Upload PDF files to add them to the knowledge base. They will be automatically processed and indexed.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            <ObjectUploader
              onGetUploadParameters={async (file) => {
                const res = await fetch("/api/uploads/request-url", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: file.name,
                    size: file.size,
                    contentType: file.type,
                  }),
                });
                const { uploadURL, objectPath } = await res.json();
                
                // We attach objectPath to the file object temporarily so we can access it on completion
                // This is a bit of a hack but effective with Uppy's constraints
                (file.meta as any).objectPath = objectPath;
                
                return {
                  method: "PUT",
                  url: uploadURL,
                  headers: { "Content-Type": file.type || "application/octet-stream" },
                };
              }}
              onComplete={(result) => {
                result.successful.forEach((file) => {
                  createDocument({
                    filename: file.name,
                    originalName: file.name,
                    contentType: file.type || "application/pdf",
                    size: file.size,
                    storagePath: (file.meta as any).objectPath,
                    status: "pending",
                    sensitivity: "amber"
                  });
                });
                setIsUploadOpen(false);
              }}
              buttonClassName="w-full h-32 border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 hover:bg-primary/5 rounded-xl flex flex-col items-center justify-center gap-2 transition-all group"
            >
              <div className="p-3 bg-muted rounded-full group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium text-foreground">Click to select files</p>
                <p className="text-sm text-muted-foreground">PDFs up to 10MB</p>
              </div>
            </ObjectUploader>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}

function StatCard({ label, value, description }: { label: string, value: string | number, description: string }) {
  return (
    <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-3xl font-display font-bold mt-2">{value}</p>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  );
}

import { format } from "date-fns";
import { Document } from "@shared/schema";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, FileText, Loader2, CheckCircle2, AlertTriangle, ShieldAlert } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface DocumentListProps {
  documents: Document[] | undefined;
  isLoading: boolean;
  onDelete: (id: number) => void;
}

export function DocumentList({ documents, isLoading, onDelete }: DocumentListProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground animate-pulse">
        <Loader2 className="h-8 w-8 mb-4 animate-spin text-primary" />
        <p>Loading documents...</p>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-border rounded-xl bg-muted/20">
        <div className="p-4 bg-muted rounded-full mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-semibold text-lg">No documents yet</h3>
        <p className="text-muted-foreground mt-1">Upload a PDF to get started.</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl overflow-hidden shadow-sm bg-card">
      <Table>
        <TableHeader className="bg-muted/40">
          <TableRow>
            <TableHead className="w-[400px]">Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Sensitivity</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Uploaded</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id} className="hover:bg-muted/20 transition-colors">
              <TableCell className="font-medium">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded text-blue-600 dark:text-blue-400">
                    <FileText className="h-4 w-4" />
                  </div>
                  <span className="truncate max-w-[300px]" title={doc.originalName}>
                    {doc.originalName}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={doc.status} />
              </TableCell>
              <TableCell>
                <SensitivityBadge level={doc.sensitivity} />
              </TableCell>
              <TableCell className="text-muted-foreground font-mono text-xs">
                {(doc.size / 1024).toFixed(1)} KB
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {doc.uploadedAt ? format(new Date(doc.uploadedAt), "MMM d, yyyy") : "-"}
              </TableCell>
              <TableCell className="text-right">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Document?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete "{doc.originalName}" and remove it from the knowledge base. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => onDelete(doc.id)}
                        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800",
    processing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
    ready: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  };

  const icons = {
    pending: Loader2,
    processing: Loader2,
    ready: CheckCircle2,
    failed: AlertTriangle,
  };

  const style = styles[status as keyof typeof styles] || styles.pending;
  const Icon = icons[status as keyof typeof icons] || Loader2;

  return (
    <Badge variant="outline" className={`${style} px-2 py-0.5 gap-1.5 capitalize`}>
      <Icon className={`h-3 w-3 ${(status === 'pending' || status === 'processing') ? 'animate-spin' : ''}`} />
      {status}
    </Badge>
  );
}

function SensitivityBadge({ level }: { level: string }) {
  const styles = {
    green: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200",
    amber: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200",
    red: "bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400 border-rose-200",
  };

  const style = styles[level as keyof typeof styles] || styles.amber;

  return (
    <Badge variant="outline" className={`${style} px-2 py-0.5 gap-1.5 capitalize border`}>
      <ShieldAlert className="h-3 w-3" />
      {level}
    </Badge>
  );
}

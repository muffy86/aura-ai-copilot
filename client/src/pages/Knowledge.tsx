import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import { Plus, Database, FileText } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export default function Knowledge() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const utils = trpc.useUtils();
  const { data: knowledge, isLoading } = trpc.knowledge.list.useQuery();

  const createKnowledge = trpc.knowledge.create.useMutation({
    onSuccess: () => {
      utils.knowledge.list.invalidate();
      setIsCreateOpen(false);
      setTitle("");
      setContent("");
      toast.success("Document added to knowledge base");
    },
    onError: (error) => {
      toast.error("Failed to add document: " + error.message);
    },
  });

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    await createKnowledge.mutateAsync({
      title: title.trim(),
      content: content.trim(),
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Knowledge Base</h1>
            <p className="text-muted-foreground">
              Store documents for RAG-powered semantic search
            </p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Document
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add to Knowledge Base</DialogTitle>
                <DialogDescription>
                  Add a document that AI agents can reference for context.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Title</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Document title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Content</label>
                  <Textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Paste your document content here..."
                    rows={12}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreate} disabled={createKnowledge.isPending}>
                  {createKnowledge.isPending ? "Adding..." : "Add Document"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-muted-foreground">Loading knowledge base...</div>
        ) : knowledge?.length === 0 ? (
          <Card className="p-12 text-center">
            <Database className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Knowledge Base is Empty</h3>
            <p className="text-muted-foreground mb-4">
              Add documents to enable RAG-powered context retrieval for AI agents.
            </p>
            <Button onClick={() => setIsCreateOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add First Document
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {knowledge?.map((doc) => (
              <Card key={doc.id} className="p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 truncate">{doc.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {doc.content.substring(0, 150)}...
                    </p>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  Added {new Date(doc.createdAt).toLocaleDateString()}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, FileText, Loader2 } from "lucide-react";
import { contractsAPI } from "@/lib/contractApi";
import { useToast } from "@/hooks/use-toast";

export const CreateContract = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (id) fetchContract();
  }, [id]);

  const fetchContract = async () => {
    setFetching(true);
    const result = await contractsAPI.getById(id!);

    if (!result.success || !result.data) {
      toast({ title: "Error", description: "Contract not found", variant: "destructive" });
      navigate("/contracts");
      return;
    }

    setTitle(result.data.title);
    setContent(result.data.content);
    setFetching(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({ title: "Required", description: "Please enter a contract title", variant: "destructive" });
      return;
    }

    if (!content.trim()) {
      toast({ title: "Required", description: "Please enter contract content", variant: "destructive" });
      return;
    }

    setLoading(true);

    const result = isEditMode
      ? await contractsAPI.update(id!, { title: title.trim(), content: content.trim() })
      : await contractsAPI.create({ title: title.trim(), content: content.trim() });

    setLoading(false);

    if (!result.success) {
      toast({
        title: "Error",
        description: result.message || `Failed to ${isEditMode ? "update" : "create"} contract`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: isEditMode ? "Contract Updated" : "Contract Created",
      description: `"${title}" saved successfully`,
    });
    navigate("/contracts");
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading contract...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 w-full p-4 md:p-6 space-y-5 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/contracts")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">
                  {isEditMode ? "Edit Contract" : "Create Contract"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isEditMode ? "Update your contract details" : "Create a new contract to send to influencers"}
                </p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link to="/contracts">Cancel</Link>
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="max-w-3xl">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Contract Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title" className="text-xs">Contract Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Standard Collaboration Agreement"
                    className="h-9"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="content" className="text-xs">Contract Content *</Label>
                  <Textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter the full contract text here...

Example:
This Collaboration Agreement is entered into between [Brand Name] and the Influencer.

1. SCOPE OF WORK
The Influencer agrees to create and publish content promoting [Product/Service] on their social media platforms.

2. DELIVERABLES
- [Number] Instagram posts
- [Number] Instagram stories
- [Number] TikTok videos

3. COMPENSATION
The Brand agrees to pay the Influencer [Amount] upon completion of all deliverables.

4. TIMELINE
Content must be published within [X] days of contract acceptance.

5. CONTENT GUIDELINES
- All content must be original
- Content must include required disclosures (#ad, #sponsored)
- Brand must approve content before publishing

By accepting this contract, both parties agree to the terms outlined above."
                    rows={20}
                    className="font-mono text-sm resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    Write your contract in plain text. This will be sent to influencers via email.
                  </p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/contracts")}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                    {isEditMode ? "Update Contract" : "Create Contract"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </main>
      </div>
    </div>
  );
};

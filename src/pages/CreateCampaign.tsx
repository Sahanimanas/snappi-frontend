import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Target, Users, FileText, Loader2, Link2, Plus, X } from "lucide-react";
import { campaignsAPI, Campaign } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const PLATFORMS = ["instagram", "youtube", "tiktok", "facebook", "twitter", "linkedin", "pinterest", "snapchat"];
const OBJECTIVES = [
  { value: "brand_awareness", label: "Brand Awareness" },
  { value: "increase_sales", label: "Increase Sales" },
  { value: "engagement", label: "Engagement" },
  { value: "lead_generation", label: "Lead Generation" },
  { value: "traffic", label: "Traffic" },
];
const CAMPAIGN_TYPES = [
  { value: "sponsored_post", label: "Sponsored Post" },
  { value: "product_review", label: "Product Review" },
  { value: "giveaway", label: "Giveaway" },
  { value: "brand_ambassador", label: "Brand Ambassador" },
  { value: "affiliate", label: "Affiliate" },
];

interface FormData {
  name: string;
  description: string;
  objective: string;
  campaignType: string;
  budget: string;
  startDate: string;
  endDate: string;
  targetPlatforms: string[];
  productUrls: string[];
}

export const CreateCampaign = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    objective: "",
    campaignType: "",
    budget: "",
    startDate: "",
    endDate: "",
    targetPlatforms: [],
    productUrls: [],
  });

  useEffect(() => {
    if (id) fetchCampaign();
  }, [id]);

  const fetchCampaign = async () => {
    setFetching(true);
    const result = await campaignsAPI.getById(id!);

    if (!result.success || !result.data) {
      toast({ title: "Error", description: "Campaign not found", variant: "destructive" });
      navigate("/campaigns");
      return;
    }

    const c = result.data;
    setFormData({
      name: c.name || "",
      description: c.description || "",
      objective: c.objective || "",
      campaignType: c.campaignType || "",
      budget: c.budget?.total?.toString() || "",
      startDate: c.startDate ? new Date(c.startDate).toISOString().split("T")[0] : "",
      endDate: c.endDate ? new Date(c.endDate).toISOString().split("T")[0] : "",
      targetPlatforms: c.targetPlatforms || [],
      productUrls: c.productUrls || [],
    });
    setFetching(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const togglePlatform = (platform: string) => {
    setFormData((prev) => ({
      ...prev,
      targetPlatforms: prev.targetPlatforms.includes(platform)
        ? prev.targetPlatforms.filter((p) => p !== platform)
        : [...prev.targetPlatforms, platform],
    }));
  };

  const addProductUrl = () => {
    setFormData((prev) => ({
      ...prev,
      productUrls: [...prev.productUrls, ""],
    }));
  };

  const removeProductUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      productUrls: prev.productUrls.filter((_, i) => i !== index),
    }));
  };

  const updateProductUrl = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      productUrls: prev.productUrls.map((url, i) => (i === index ? value : url)),
    }));
  };

  const handleSubmit = async (e: React.FormEvent, status: Campaign["status"] = "active") => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast({ title: "Required", description: "Please enter a campaign name", variant: "destructive" });
      return;
    }

    setLoading(true);

    const payload: Partial<Campaign> = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      objective: formData.objective as Campaign["objective"] || undefined,
      campaignType: formData.campaignType as Campaign["campaignType"] || undefined,
      status,
      budget: formData.budget ? { total: parseFloat(formData.budget) } : undefined,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
      targetPlatforms: formData.targetPlatforms,
      productUrls: formData.productUrls.filter(url => url.trim() !== ""),
    };

    const result = isEditMode
      ? await campaignsAPI.update(id!, payload)
      : await campaignsAPI.create(payload);

    setLoading(false);

    if (!result.success) {
      toast({
        title: "Error",
        description: result.message || `Failed to ${isEditMode ? "update" : "create"} campaign`,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: isEditMode ? "Campaign Updated" : "Campaign Created",
      description: `"${formData.name}" saved successfully`,
    });
    navigate("/campaigns");
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        Loading campaign...
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
              <Button variant="ghost" size="icon" onClick={() => navigate("/campaigns")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-xl font-bold">
                  {isEditMode ? "Edit Campaign" : "Create Campaign"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {isEditMode ? "Update your campaign details" : "Set up your influencer campaign"}
                </p>
              </div>
            </div>
            <Button variant="outline" asChild>
              <Link to="/campaigns">Cancel</Link>
            </Button>
          </div>

          <form onSubmit={(e) => handleSubmit(e)} className="space-y-5">
            <div className="grid lg:grid-cols-2 gap-5">
              {/* Campaign Details */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Campaign Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-xs">Campaign Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Spring Fashion Launch"
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="description" className="text-xs">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe your campaign goals..."
                      rows={3}
                      className="resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Objective</Label>
                      <Select
                        value={formData.objective}
                        onValueChange={(v) => setFormData({ ...formData, objective: v })}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select objective" />
                        </SelectTrigger>
                        <SelectContent>
                          {OBJECTIVES.map((o) => (
                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Campaign Type</Label>
                      <Select
                        value={formData.campaignType}
                        onValueChange={(v) => setFormData({ ...formData, campaignType: v })}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          {CAMPAIGN_TYPES.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label className="text-xs">Start Date</Label>
                      <Input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        className="h-9"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">End Date</Label>
                      <Input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        className="h-9"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Budget & Platforms */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Budget & Platforms
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Total Budget ($)</Label>
                    <Input
                      name="budget"
                      type="number"
                      min="0"
                      step="100"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="5000"
                      className="h-9"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs">Target Platforms</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {PLATFORMS.map((platform) => (
                        <label
                          key={platform}
                          className="flex items-center gap-2 p-2 rounded-md border cursor-pointer hover:bg-muted/50 transition-colors"
                        >
                          <Checkbox
                            checked={formData.targetPlatforms.includes(platform)}
                            onCheckedChange={() => togglePlatform(platform)}
                          />
                          <span className="text-sm capitalize">{platform}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Product URLs */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Link2 className="h-4 w-4" />
                  Product URLs
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Add the product URLs that influencers will promote in this campaign.
                </p>
                {formData.productUrls.map((url, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={url}
                      onChange={(e) => updateProductUrl(index, e.target.value)}
                      placeholder="https://example.com/product"
                      className="h-9 flex-1"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-muted-foreground hover:text-destructive"
                      onClick={() => removeProductUrl(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={addProductUrl}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Product URL
                </Button>
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                disabled={loading}
                onClick={(e) => handleSubmit(e, "draft")}
              >
                Save as Draft
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                {isEditMode ? "Update Campaign" : "Create Campaign"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
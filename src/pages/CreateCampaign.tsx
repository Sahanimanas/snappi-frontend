import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Users, Target, FileText } from "lucide-react";
import { campaignsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

export const CreateCampaign = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    objective: "",
    type: "",
    kpis: [] as string[],
    budget: "",
    startDate: "",
    endDate: "",
    platforms: [] as string[],
    targetAudience: "",
    deliverables: "",
    compensation: "",
    ageRange: "",
    gender: "",
    location: "",
  });

  // Generic change handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit to Backend API
  const handleSubmit = async (e: React.FormEvent, status: string = "active") => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!formData.name) {
        toast({
          title: "Missing Field",
          description: "Please enter a campaign name.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Prepare API payload
      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        objective: formData.objective || undefined,
        campaignType: formData.type || undefined,
        status: status as 'draft' | 'active',
        budget: formData.budget
          ? { total: parseFloat(formData.budget) }
          : undefined,
        timeline: {
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
        },
        targetPlatforms: formData.platforms.length ? formData.platforms : [],
        demographics: {
          ageRange: formData.ageRange ? [formData.ageRange] : [],
          gender: formData.gender ? [formData.gender] : [],
          location: formData.location ? { countries: [formData.location] } : undefined,
        },
        compensationType: formData.compensation || undefined,
        deliverables: formData.deliverables
          ? [{ type: "post", quantity: 1, description: formData.deliverables }]
          : undefined,
      };

      const result = await campaignsAPI.create(payload);

      if (!result.success) {
        throw new Error(result.message || "Failed to create campaign");
      }

      toast({
        title: "Campaign Created 🎉",
        description: `Campaign "${formData.name}" saved successfully.`,
      });
      navigate("/campaigns");
    } catch (err: any) {
      console.error("Failed to create campaign:", err);
      toast({
        title: "Error Creating Campaign",
        description: err?.message ?? "Unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = async (e: React.MouseEvent) => {
    e.preventDefault();
    await handleSubmit({ preventDefault: () => {} } as any, "draft");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text font-bold">Create New Campaign</h1>
              <p className="text-muted-foreground">
                Set up your influencer marketing campaign
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" asChild>
                <Link to="/campaigns">Cancel</Link>
              </Button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Campaign Details */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Campaign Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Campaign Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Spring Fashion Launch"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      placeholder="Describe your campaign goals..."
                      rows={3}
                    />
                  </div>

                  {/* Objective */}
                  <div className="space-y-2">
                    <Label>Campaign Objective</Label>
                    <Select
                      value={formData.objective}
                      onValueChange={(v) =>
                        setFormData({ ...formData, objective: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select objective" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="brand_awareness">
                          Brand Awareness
                        </SelectItem>
                        <SelectItem value="engagement">
                          Engagement & Community
                        </SelectItem>
                        <SelectItem value="content">
                          Content Creation (UGC)
                        </SelectItem>
                        <SelectItem value="traffic">
                          Traffic Generation
                        </SelectItem>
                        <SelectItem value="lead">Lead Generation</SelectItem>
                        <SelectItem value="sales">Sales & Conversions</SelectItem>
                        <SelectItem value="affiliate">
                          Affiliate / Performance
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type */}
                  <div className="space-y-2">
                    <Label>Campaign Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(v) =>
                        setFormData({ ...formData, type: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sponsored_post">Sponsored Post</SelectItem>
                        <SelectItem value="product_review">Product Review</SelectItem>
                        <SelectItem value="giveaway">Giveaway</SelectItem>
                        <SelectItem value="takeover">Account Takeover</SelectItem>
                        <SelectItem value="ambassador">Brand Ambassador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* KPIs */}
                  <div className="space-y-2">
                    <Label>Key KPIs</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        "Impressions",
                        "Engagement",
                        "Leads",
                        "Sales",
                        "Conversions",
                      ].map((kpi) => (
                        <label
                          key={kpi}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            onChange={(e) => {
                              if (e.target.checked)
                                setFormData({
                                  ...formData,
                                  kpis: [...formData.kpis, kpi],
                                });
                              else
                                setFormData({
                                  ...formData,
                                  kpis: formData.kpis.filter((k) => k !== kpi),
                                });
                            }}
                          />
                          <span>{kpi}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div>
                      <Label>End Date</Label>
                      <Input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Budget & Targeting */}
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>Budget & Targeting</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Label>Total Budget ($)</Label>
                  <Input
                    name="budget"
                    type="number"
                    value={formData.budget}
                    onChange={handleInputChange}
                    placeholder="5000"
                  />

                  {/* Platforms */}
                  <Label>Target Platforms</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      "instagram",
                      "tiktok",
                      "youtube",
                      "facebook",
                      "twitter",
                      "twitch",
                      "pinterest",
                      "linkedin",
                    ].map((platform) => (
                      <label
                        key={platform}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          onChange={(e) => {
                            if (e.target.checked)
                              setFormData({
                                ...formData,
                                platforms: [...formData.platforms, platform],
                              });
                            else
                              setFormData({
                                ...formData,
                                platforms: formData.platforms.filter(
                                  (p) => p !== platform
                                ),
                              });
                          }}
                        />
                        <span className="text-sm capitalize">{platform}</span>
                      </label>
                    ))}
                  </div>

                  {/* Demographics */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Demographics</CardTitle>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Age Range</Label>
                        <Select
                          onValueChange={(v) =>
                            setFormData({ ...formData, ageRange: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {["13-17", "18-24", "25-34", "35-44", "45+"].map(
                              (a) => (
                                <SelectItem key={a} value={a}>
                                  {a}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label>Gender</Label>
                        <Select
                          onValueChange={(v) =>
                            setFormData({ ...formData, gender: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {["all", "male", "female", "non-binary"].map(
                              (g) => (
                                <SelectItem key={g} value={g}>
                                  {g.charAt(0).toUpperCase() + g.slice(1)}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="col-span-2">
                        <Label>Location</Label>
                        <Input
                          name="location"
                          placeholder="Country / City"
                          onChange={handleInputChange}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <div>
                    <Label>Compensation Type</Label>
                    <Select
                      value={formData.compensation}
                      onValueChange={(v) =>
                        setFormData({ ...formData, compensation: v })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monetary">Paid Promotion</SelectItem>
                        <SelectItem value="affiliate">
                          Affiliate Commission
                        </SelectItem>
                        <SelectItem value="product">
                          Product Gifting
                        </SelectItem>
                        <SelectItem value="hybrid">
                          Hybrid (Paid + Product)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Deliverables & Contract */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="h-5 w-5" />
                  <span>Deliverables & Requirements</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Label>Expected Deliverables</Label>
                <Textarea
                  name="deliverables"
                  value={formData.deliverables}
                  onChange={handleInputChange}
                  placeholder="e.g., 2 reels, 3 stories, 1 YouTube video..."
                  rows={3}
                />
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveAsDraft}
                disabled={loading}
              >
                Save as Draft
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Creating..." : "Create Campaign"}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

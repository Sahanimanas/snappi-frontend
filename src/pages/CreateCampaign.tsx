import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [fetchingCampaign, setFetchingCampaign] = useState(isEditMode);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    objective: "",
    type: "",
    kpis: {
      impressions: false,
      engagement: false,
      clicks: false,
      conversions: false,
      sales: false,
      reach: false,
    },
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

  // Fetch campaign data if editing
  useEffect(() => {
    const fetchCampaign = async () => {
      if (!id) return;
      
      setFetchingCampaign(true);
      try {
        const result = await campaignsAPI.getById(id);
        
        if (!result.success) {
          toast({
            title: "Error",
            description: "Failed to load campaign data",
            variant: "destructive",
          });
          navigate("/campaigns");
          return;
        }

        const campaign = result.data;
        
        // Populate form with existing data
        setFormData({
          name: campaign.name || "",
          description: campaign.description || "",
          objective: campaign.objective || "",
          type: campaign.campaignType || "",
          kpis: campaign.kpis || {
            impressions: false,
            engagement: false,
            clicks: false,
            conversions: false,
            sales: false,
            reach: false,
          },
          budget: campaign.budget?.total?.toString() || "",
          startDate: campaign.startDate 
            ? new Date(campaign.startDate).toISOString().split('T')[0] 
            : "",
          endDate: campaign.endDate 
            ? new Date(campaign.endDate).toISOString().split('T')[0] 
            : "",
          platforms: campaign.targetPlatforms || [],
          targetAudience: campaign.targetAudience || "",
          deliverables: campaign.deliverables?.[0]?.description || "",
          compensation: campaign.compensationType || "",
          ageRange: campaign.demographics?.ageRange?.[0] || "",
          gender: campaign.demographics?.gender?.[0] || "",
          location: campaign.demographics?.location?.countries?.[0] || "",
        });
      } catch (err) {
        console.error("Error fetching campaign:", err);
        toast({
          title: "Error",
          description: "Failed to load campaign data",
          variant: "destructive",
        });
        navigate("/campaigns");
      } finally {
        setFetchingCampaign(false);
      }
    };

    fetchCampaign();
  }, [id, navigate, toast]);

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

      // Prepare API payload matching backend model
      const payload = {
        name: formData.name,
        description: formData.description || undefined,
        objective: formData.objective || undefined,
        campaignType: formData.type || undefined,
        status: status as 'draft' | 'active' | 'paused' | 'completed' | 'cancelled',
        budget: formData.budget
          ? { total: parseFloat(formData.budget) }
          : undefined,
        startDate: formData.startDate || undefined,
        endDate: formData.endDate || undefined,
        targetPlatforms: formData.platforms.length ? formData.platforms : [],
        demographics: {
          ageRange: formData.ageRange ? [formData.ageRange] : [],
          gender: formData.gender ? [formData.gender] : [],
          location: formData.location ? { countries: [formData.location] } : undefined,
        },
        compensationType: formData.compensation || undefined,
        kpis: formData.kpis,
        deliverables: formData.deliverables
          ? [{ type: "post", quantity: 1, description: formData.deliverables }]
          : undefined,
      };

      let result;
      if (isEditMode) {
        // Update existing campaign
        result = await campaignsAPI.update(id!, payload);
      } else {
        // Create new campaign
        result = await campaignsAPI.create(payload);
      }

      if (!result.success) {
        throw new Error(result.message || `Failed to ${isEditMode ? 'update' : 'create'} campaign`);
      }

      toast({
        title: isEditMode ? "Campaign Updated 🎉" : "Campaign Created 🎉",
        description: `Campaign "${formData.name}" ${isEditMode ? 'updated' : 'saved'} successfully.`,
      });
      navigate("/campaigns");
    } catch (err: any) {
      console.error(`Failed to ${isEditMode ? 'update' : 'create'} campaign:`, err);
      toast({
        title: `Error ${isEditMode ? 'Updating' : 'Creating'} Campaign`,
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

  if (fetchingCampaign) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading campaign data...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text font-bold">
                {isEditMode ? "Edit Campaign" : "Create New Campaign"}
              </h1>
              <p className="text-muted-foreground">
                {isEditMode 
                  ? "Update your influencer marketing campaign" 
                  : "Set up your influencer marketing campaign"}
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
                          Engagement
                        </SelectItem>
                        <SelectItem value="traffic">
                          Traffic
                        </SelectItem>
                        <SelectItem value="lead_generation">Lead Generation</SelectItem>
                        <SelectItem value="increase_sales">Sales</SelectItem>
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
                        <SelectItem value="brand_ambassador">Brand Ambassador</SelectItem>
                        <SelectItem value="affiliate">Affiliate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* KPIs */}
                  <div className="space-y-2">
                    <Label>Key KPIs</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { key: "impressions", label: "Impressions" },
                        { key: "engagement", label: "Engagement" },
                        { key: "clicks", label: "Clicks" },
                        { key: "conversions", label: "Conversions" },
                        { key: "sales", label: "Sales" },
                        { key: "reach", label: "Reach" },
                      ].map((kpi) => (
                        <label
                          key={kpi.key}
                          className="flex items-center space-x-2 text-sm"
                        >
                          <input
                            type="checkbox"
                            checked={formData.kpis[kpi.key as keyof typeof formData.kpis]}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                kpis: {
                                  ...formData.kpis,
                                  [kpi.key]: e.target.checked,
                                },
                              });
                            }}
                          />
                          <span>{kpi.label}</span>
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
                      "youtube",
                      "tiktok",
                      "facebook",
                      "twitter",
                      "linkedin",
                      "pinterest",
                    ].map((platform) => (
                      <label
                        key={platform}
                        className="flex items-center space-x-2"
                      >
                        <input
                          type="checkbox"
                          checked={formData.platforms.includes(platform)}
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
                          value={formData.ageRange}
                          onValueChange={(v) =>
                            setFormData({ ...formData, ageRange: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {["13-17", "18-24", "25-34", "35-44", "45-54", "55+"].map(
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
                          value={formData.gender}
                          onValueChange={(v) =>
                            setFormData({ ...formData, gender: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            {["all", "male", "female"].map(
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
                          value={formData.location}
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
                        <SelectItem value="monetary">Monetary</SelectItem>
                        <SelectItem value="product">Product</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                        <SelectItem value="affiliate">Affiliate</SelectItem>
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
                {loading 
                  ? (isEditMode ? "Updating..." : "Creating...") 
                  : (isEditMode ? "Update Campaign" : "Create Campaign")}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};
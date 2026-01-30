// CampaignDetail.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  Eye,
  MousePointerClick,
  Target,
  Edit,
  Play,
  Pause,
  CheckCircle,
  MoreHorizontal,
  Link as LinkIcon,
  Copy,
  Check,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { campaignsAPI, Campaign, Influencer, formatNumber } from "@/lib/api";
import { trackingLinkAPI, TrackingLink } from "@/lib/trackingLinkApi";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const CampaignDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [performance, setPerformance] = useState<any>(null);

  // Tracking link states
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);
  const [trackingLinks, setTrackingLinks] = useState<Record<string, TrackingLink>>({});
  const [selectedInfluencer, setSelectedInfluencer] = useState<any>(null);
  const [selectedLink, setSelectedLink] = useState<TrackingLink | null>(null);
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCampaign();
      fetchPerformance();
      fetchTrackingLinks();
    }
  }, [id]);

  const fetchCampaign = async () => {
    setLoading(true);
    const result = await campaignsAPI.getById(id!);
    if (result.success && result.data) {
      setCampaign(result.data);
    } else {
      toast({ title: "Error", description: "Campaign not found", variant: "destructive" });
      navigate("/campaigns");
    }
    setLoading(false);
  };

  const fetchPerformance = async () => {
    const result = await campaignsAPI.getPerformance(id!);
    if (result.success && result.data) {
      setPerformance(result.data);
    }
  };

  const fetchTrackingLinks = async () => {
    const result = await trackingLinkAPI.getByCampaign(id!);
    if (result.success && result.data) {
      const linksMap: Record<string, TrackingLink> = {};
      (result.data as TrackingLink[]).forEach((link) => {
        if (link.influencer && link.influencer._id) {
          linksMap[link.influencer._id] = link;
        }
      });
      setTrackingLinks(linksMap);
    }
  };

  const handleGenerateLink = async (influencer: any) => {
    // console.log(localStorage.getItem('snappi_user_token'));
    console.log('User Token:', localStorage.getItem('snappi_user_token'));
   console.log('Admin Token:', localStorage.getItem('adminToken'));
    // If link already exists, show it
    if (trackingLinks[influencer._id]) {
      setSelectedInfluencer(influencer);
      setSelectedLink(trackingLinks[influencer._id]);
      setShowLinkDialog(true);
      return;
    }

    // Generate new link
    setGeneratingFor(influencer._id);

    const result = await trackingLinkAPI.generate(id!, influencer._id);

    if (result.success && result.data) {
      const newLink = result.data as TrackingLink;
      setTrackingLinks((prev) => ({
        ...prev,
        [influencer._id]: newLink,
      }));
      setSelectedInfluencer(influencer);
      setSelectedLink(newLink);
      setShowLinkDialog(true);

      toast({
        title: "Link Generated!",
        description: "Tracking link created successfully",
      });
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to generate link",
        variant: "destructive",
      });
    }

    setGeneratingFor(null);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to copy",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    const result = await campaignsAPI.update(id!, { status: newStatus as any });
    if (result.success) {
      setCampaign((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      toast({ title: "Updated", description: `Campaign is now ${newStatus}` });
    } else {
      toast({ title: "Error", description: "Failed to update status", variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "default";
      case "completed":
        return "secondary";
      case "paused":
        return "outline";
      default:
        return "outline";
    }
  };

  const hasTrackingLink = (influencerId: string) => !!trackingLinks[influencerId];

  const getUsername = (influencer: any) => {
    if (influencer.platforms && influencer.platforms.length > 0) {
      return influencer.platforms[0]?.username || "unknown";
    }
    return "unknown";
  };

  const getTotalFollowers = (influencer: any) => {
    if (influencer.totalFollowers) return influencer.totalFollowers;
    if (influencer.platforms) {
      return influencer.platforms.reduce((sum: number, p: any) => sum + (p.followers || 0), 0);
    }
    return 0;
  };

  const getAvgEngagement = (influencer: any) => {
    if (influencer.avgEngagement) return influencer.avgEngagement;
    if (influencer.platforms && influencer.platforms.length > 0) {
      const total = influencer.platforms.reduce((sum: number, p: any) => sum + (p.engagement || 0), 0);
      return total / influencer.platforms.length;
    }
    return 0;
  };

  const budgetSpent = campaign?.budget?.spent || 0;
  const budgetTotal = campaign?.budget?.total || 1;
  const budgetPercent = Math.round((budgetSpent / budgetTotal) * 100);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading campaign...
      </div>
    );
  }

  if (!campaign) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 w-full p-4 md:p-6 space-y-5 overflow-y-auto">
          {/* Back + Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate("/campaigns")}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold">{campaign.name}</h1>
                  <Badge variant={getStatusColor(campaign.status)} className="capitalize">
                    {campaign.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {campaign.description || "No description"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/edit-campaign/${campaign._id}`}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    Actions
                    <MoreHorizontal className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {campaign.status !== "active" && (
                    <DropdownMenuItem onClick={() => handleStatusChange("active")}>
                      <Play className="h-4 w-4 mr-2" />
                      {campaign.status === "paused" ? "Resume" : "Launch"}
                    </DropdownMenuItem>
                  )}
                  {campaign.status === "active" && (
                    <DropdownMenuItem onClick={() => handleStatusChange("paused")}>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Completed
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                label: "Budget",
                value: `$${formatNumber(campaign.budget?.total || 0)}`,
                sub: `$${formatNumber(budgetSpent)} spent`,
                icon: DollarSign,
                color: "text-green-600",
              },
              {
                label: "Total Reach",
                value: formatNumber(campaign.performance?.totalReach || 0),
                icon: Eye,
                color: "text-blue-600",
              },
              {
                label: "Engagement",
                value: formatNumber(campaign.performance?.totalEngagement || 0),
                icon: TrendingUp,
                color: "text-purple-600",
              },
              {
                label: "Influencers",
                value: campaign.influencers?.length || campaign.influencerCount || 0,
                icon: Users,
                color: "text-orange-600",
              },
            ].map((stat) => (
              <Card key={stat.label} className="border-0 shadow-sm">
                <CardContent className="p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    <span className="text-xs text-muted-foreground">{stat.label}</span>
                  </div>
                  <p className="text-xl font-bold">{stat.value}</p>
                  {stat.sub && <p className="text-[10px] text-muted-foreground">{stat.sub}</p>}
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-4">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-4">
              {/* Budget Progress */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Budget Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm mb-2">
                    <span>${formatNumber(budgetSpent)} spent</span>
                    <span>
                      ${formatNumber(campaign.budget?.remaining || budgetTotal - budgetSpent)}{" "}
                      remaining
                    </span>
                  </div>
                  <Progress value={budgetPercent} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {budgetPercent}% of budget used
                  </p>
                </CardContent>
              </Card>

              {/* Performance Metrics */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                      {
                        label: "Reach",
                        value: formatNumber(campaign.performance?.totalReach || 0),
                        icon: Eye,
                      },
                    ].map((m) => (
                      <div key={m.label} className="text-center p-3 bg-muted/50 rounded-lg">
                        <m.icon className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                        <p className="text-lg font-bold">{m.value}</p>
                        <p className="text-[10px] text-muted-foreground">{m.label}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Influencers with Generate Link */}
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium">Campaign Influencers</CardTitle>
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/influencers?campaign=${campaign._id}`}>
                      <Users className="h-3 w-3 mr-1" />
                      Add
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {Array.isArray(campaign.influencers) && campaign.influencers.length > 0 ? (
                    <div className="space-y-2">
                      {(campaign.influencers as any[]).map((inf: any) => (
                        <div
                          key={inf._id || inf}
                          className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                          {/* Influencer Info */}
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={inf.profileImage} />
                              <AvatarFallback>
                                {inf.name
                                  ?.split(" ")
                                  .map((n: string) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2) || "IN"}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium truncate">
                                  {inf.name || "Influencer"}
                                </p>
                                {hasTrackingLink(inf._id) && (
                                  <Badge variant="secondary" className="text-[10px] h-5">
                                    <LinkIcon className="h-3 w-3 mr-1" />
                                    Link Active
                                  </Badge>
                                )}
                              </div>
                              <p className="text-[11px] text-muted-foreground">
                                @{getUsername(inf)}
                              </p>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="hidden sm:flex items-center gap-4 px-4">
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {formatNumber(getTotalFollowers(inf))}
                              </p>
                              <p className="text-[10px] text-muted-foreground">followers</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">
                                {getAvgEngagement(inf).toFixed(1)}%
                              </p>
                              <p className="text-[10px] text-muted-foreground">eng.</p>
                            </div>
                          </div>

                          {/* Generate Link Button */}
                          <Button
                            variant={hasTrackingLink(inf._id) ? "outline" : "default"}
                            size="sm"
                            onClick={() => handleGenerateLink(inf)}
                            disabled={generatingFor === inf._id}
                            className="shrink-0 gap-1.5"
                          >
                            {generatingFor === inf._id ? (
                              <>
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                <span className="hidden sm:inline">Generating...</span>
                              </>
                            ) : hasTrackingLink(inf._id) ? (
                              <>
                                <LinkIcon className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">View Link</span>
                              </>
                            ) : (
                              <>
                                <LinkIcon className="h-3.5 w-3.5" />
                                <span className="hidden sm:inline">Generate Link</span>
                              </>
                            )}
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-6">
                      No influencers added yet
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              {/* Campaign Details */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Objective</span>
                    <span className="capitalize">
                      {campaign.objective?.replace("_", " ") || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span className="capitalize">
                      {campaign.campaignType?.replace("_", " ") || "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Start Date</span>
                    <span>
                      {campaign.startDate
                        ? new Date(campaign.startDate).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">End Date</span>
                    <span>
                      {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Platforms</span>
                    <div className="flex gap-1">
                      {campaign.targetPlatforms?.map((p) => (
                        <PlatformIcon key={p} platform={p} className="h-4 w-4" />
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created</span>
                    <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                    <Link to={`/edit-campaign/${campaign._id}`}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Campaign
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                    <Link to={`/influencers`}>
                      <Users className="h-4 w-4 mr-2" />
                      Find Influencers
                    </Link>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm" asChild>
                    <Link to={`/tracking`}>
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Performance Tracking
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Tracking Link Dialog */}
      <Dialog open={showLinkDialog} onOpenChange={setShowLinkDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              Tracking Link Ready
            </DialogTitle>
            <DialogDescription>
              Share this link with {selectedInfluencer?.name} so they can submit their post URLs.
            </DialogDescription>
          </DialogHeader>

          {selectedInfluencer && selectedLink && (
            <div className="space-y-4 pt-2">
              {/* Influencer Info */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedInfluencer.profileImage} />
                  <AvatarFallback>
                    {selectedInfluencer.name
                      ?.split(" ")
                      .map((n: string) => n[0])
                      .join("")
                      .toUpperCase()
                      .slice(0, 2) || "IN"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{selectedInfluencer.name}</p>
                  <p className="text-sm text-muted-foreground">
                    @{getUsername(selectedInfluencer)}
                  </p>
                </div>
              </div>

              {/* Tracking Link */}
              <div className="space-y-2">
                <Label>Tracking Link</Label>
                <div className="flex gap-2">
                  <Input
                    value={selectedLink.trackingUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    variant={copied ? "default" : "outline"}
                    size="icon"
                    onClick={() => copyToClipboard(selectedLink.trackingUrl)}
                    className="shrink-0"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Tracking Code */}
              <div className="space-y-2">
                <Label>Tracking Code</Label>
                <Input
                  value={selectedLink.trackingCode}
                  readOnly
                  className="font-mono text-sm bg-muted"
                />
              </div>

              {/* Info Box */}
              <div className="bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 text-sm">
                  How it works:
                </h4>
                <ol className="text-sm text-blue-800 dark:text-blue-200 space-y-1 list-decimal list-inside">
                  <li>Send this link to {selectedInfluencer.name}</li>
                  <li>They'll submit their social media post URLs through this link</li>
                  <li>Review submissions in Performance Tracking</li>
                  <li>Approve posts to track their metrics</li>
                </ol>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(selectedLink.trackingUrl, "_blank")}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Preview
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => copyToClipboard(selectedLink.trackingUrl)}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
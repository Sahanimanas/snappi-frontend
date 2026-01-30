// pages/InfluencerTracking.tsx
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlatformIcon } from "@/components/ui/platform-icon";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Link as LinkIcon,
  BarChart3,
  Users,
  TrendingUp,
  Eye,
  MousePointerClick,
  Calendar,
  ChevronRight,
  Loader2,
  FileText,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { campaignsAPI, Campaign, formatNumber } from "@/lib/api";
import { trackingLinkAPI, TrackingStats } from "@/lib/trackingLinkApi";
import { CampaignInfluencersModal } from "@/components/tracking/CampaignInfluencersModal";

const getStatusColor = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "default";
    case "completed":
      return "secondary";
    case "paused":
      return "outline";
    case "draft":
      return "outline";
    default:
      return "outline";
  }
};

export const InfluencerTracking = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [stats, setStats] = useState<TrackingStats | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch campaigns
    const campaignsResult = await campaignsAPI.getAll();
    if (campaignsResult.success) {
      setCampaigns(Array.isArray(campaignsResult.data) ? campaignsResult.data : []);
    } else {
      toast({
        title: "Error",
        description: campaignsResult.message || "Failed to load campaigns",
        variant: "destructive",
      });
    }

    // Fetch tracking stats
    const statsResult = await trackingLinkAPI.getStats();
    if (statsResult.success) {
      setStats(statsResult.data);
    }

    setLoading(false);
  };

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch =
      campaign.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" ||
      campaign.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getInfluencerCount = (campaign: Campaign) => {
    return campaign.influencers?.length || campaign.influencerCount || 0;
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 w-full p-6 md:p-8 space-y-6 overflow-y-auto h-[calc(100vh-theme(spacing.16))]">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text">
              Performance Tracking
            </h1>
            <p className="text-muted-foreground mt-1">
              Generate tracking links and monitor influencer campaign performance
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <LinkIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Links</p>
                  <p className="text-2xl font-bold">
                    {stats?.overview.activeLinks || 0}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* <Card className="shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-500/10">
                  <MousePointerClick className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                  <p className="text-2xl font-bold">
                    {formatNumber(stats?.overview.totalClicks || 0)}
                  </p>
                </div>
              </CardContent>
            </Card> */}

            <Card className="shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Posts</p>
                  <p className="text-2xl font-bold">
                    {stats?.overview.totalPosts || 0}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Reach</p>
                  <p className="text-2xl font-bold">
                    {formatNumber(stats?.overview.totalReach || 0)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                className="pl-11 h-11 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px] h-11">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Campaigns List */}
          <Tabs defaultValue="campaigns" className="space-y-4">
            <TabsList className="h-11">
              <TabsTrigger value="campaigns" className="text-sm px-5">
                Campaigns
              </TabsTrigger>
              <TabsTrigger value="overview" className="text-sm px-5">
                Performance Overview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="campaigns" className="space-y-3 mt-4">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-3 text-muted-foreground">Loading campaigns...</span>
                </div>
              ) : filteredCampaigns.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Calendar className="h-12 w-12 mx-auto mb-4 opacity-40" />
                  <p className="text-lg">No campaigns found</p>
                  {searchQuery || statusFilter !== "all" ? (
                    <Button
                      variant="link"
                      onClick={() => {
                        setSearchQuery("");
                        setStatusFilter("all");
                      }}
                    >
                      Clear filters
                    </Button>
                  ) : null}
                </div>
              ) : (
                filteredCampaigns.map((campaign) => (
                  <Card
                    key={campaign._id}
                    className="border hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => setSelectedCampaign(campaign)}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between gap-6">
                        {/* Left: Campaign Info */}
                        <div className="flex items-center gap-4 min-w-0 flex-1">
                          <div className="min-w-0">
                            <div className="flex items-center gap-3">
                              <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                                {campaign.name}
                              </h3>
                              <Badge
                                variant={getStatusColor(campaign.status)}
                                className="text-xs px-2.5 py-0.5 capitalize"
                              >
                                {campaign.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              {campaign.targetPlatforms?.slice(0, 4).map((p: string) => (
                                <PlatformIcon
                                  key={p}
                                  platform={p}
                                  className="h-4 w-4 opacity-70"
                                />
                              ))}
                              {(campaign.targetPlatforms?.length || 0) > 4 && (
                                <span className="text-xs text-muted-foreground">
                                  +{campaign.targetPlatforms!.length - 4}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Center: Stats */}
                        <div className="hidden md:flex items-center gap-8">
                          <div className="text-center min-w-[80px]">
                            <p className="text-xs text-muted-foreground mb-1">
                              Influencers
                            </p>
                            <p className="font-semibold text-base flex items-center justify-center gap-1">
                              <Users className="h-4 w-4 text-primary" />
                              {getInfluencerCount(campaign)}
                            </p>
                          </div>
                          <div className="text-center min-w-[80px]">
                            <p className="text-xs text-muted-foreground mb-1">
                              Budget
                            </p>
                            <p className="font-semibold text-base">
                              ${campaign.budget?.total?.toLocaleString() || 0}
                            </p>
                          </div>
                          <div className="text-center min-w-[100px]">
                            <p className="text-xs text-muted-foreground mb-1">
                              Duration
                            </p>
                            <p className="font-semibold text-sm">
                              {campaign.startDate
                                ? new Date(campaign.startDate).toLocaleDateString(
                                    "en-US",
                                    { month: "short", day: "numeric" }
                                  )
                                : "—"}
                              {" - "}
                              {campaign.endDate
                                ? new Date(campaign.endDate).toLocaleDateString(
                                    "en-US",
                                    { month: "short", day: "numeric" }
                                  )
                                : "—"}
                            </p>
                          </div>
                        </div>

                        {/* Right: Action */}
                        <div className="flex items-center gap-2 shrink-0">
                          <Button variant="outline" size="default" className="h-10">
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Manage Links
                          </Button>
                          <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>

            <TabsContent value="overview" className="space-y-6 mt-4">
              {/* Performance Summary Cards */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Eye className="h-5 w-5 text-primary" />
                      Engagement Overview
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Total Views
                        </span>
                        <span className="font-semibold">
                          {formatNumber(stats?.overview.totalViews || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Total Likes
                        </span>
                        <span className="font-semibold">
                          {formatNumber(stats?.overview.totalLikes || 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Total Comments
                        </span>
                        <span className="font-semibold">
                          {formatNumber(stats?.overview.totalComments || 0)}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card> */}
<Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-green-600" />
                      Quick Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Total Campaigns
                        </span>
                        <span className="font-semibold">{campaigns.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Active Campaigns
                        </span>
                        <span className="font-semibold text-green-600">
                          {campaigns.filter((c) => c.status === "active").length}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Total Links
                        </span>
                        <span className="font-semibold">
                          {stats?.overview.totalLinks || 0}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="shadow-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      Posts by Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats?.postsByStatus?.map((item) => (
                        <div
                          key={item._id}
                          className="flex justify-between items-center"
                        >
                          <span className="text-sm text-muted-foreground capitalize">
                            {item._id || "Unknown"}
                          </span>
                          <Badge variant="outline">{item.count}</Badge>
                        </div>
                      ))}
                      {(!stats?.postsByStatus || stats.postsByStatus.length === 0) && (
                        <p className="text-sm text-muted-foreground text-center py-2">
                          No data available
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                
              </div>

              {/* Top Campaigns */}
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle>Top Campaigns by Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stats?.topCampaigns?.slice(0, 5).map((item) => (
                      <div
                        key={item._id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => {
                          const campaign = campaigns.find(c => c._id === item._id);
                          if (campaign) setSelectedCampaign(campaign);
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-sm font-bold">
                            {item.campaignName?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{item.campaignName}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.linkCount} links • {item.postCount} posts
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {formatNumber(item.totalClicks)} clicks
                          </Badge>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    ))}
                    {(!stats?.topCampaigns || stats.topCampaigns.length === 0) && (
                      <p className="text-center text-muted-foreground py-8">
                        No tracking data yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>

      {/* Campaign Influencers Modal */}
      <CampaignInfluencersModal
        isOpen={!!selectedCampaign}
        onClose={() => setSelectedCampaign(null)}
        campaign={selectedCampaign}
      />
    </div>
  );
};

export default InfluencerTracking;
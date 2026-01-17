import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlatformIcon } from "@/components/ui/platform-icon";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  MoreHorizontal,
  Play,
  Pause,
  Eye,
  Download,
  ChevronRight,
} from "lucide-react";
import { campaignsAPI, Campaign, formatNumber } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const getStatusAction = (status: string) => {
  switch (status?.toLowerCase()) {
    case "active":
      return { icon: Pause, label: "Pause", next: "paused" };
    case "paused":
      return { icon: Play, label: "Resume", next: "active" };
    case "draft":
      return { icon: Play, label: "Launch", next: "active" };
    default:
      return { icon: Eye, label: "View", next: "active" };
  }
};

export const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCount, setActiveCount] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    const result = await campaignsAPI.getAll();

    if (!result.success) {
      toast({
        title: "Error",
        description: result.message || "Failed to load campaigns",
        variant: "destructive",
      });
      setCampaigns([]);
    } else {
      const campaignData = Array.isArray(result.data) ? result.data : [];
      setCampaigns(campaignData);

      const active = campaignData.filter(
        (c: Campaign) => c.status?.toLowerCase() === "active"
      ).length;
      setActiveCount(active);

      const total = campaignData.reduce(
        (sum: number, c: Campaign) => sum + (c.budget?.total || 0),
        0
      );
      setTotalBudget(total);
    }
    setLoading(false);
  };

  const filterCampaignsByStatus = (status: string) => {
    let filtered = campaigns;
    if (status !== "all") {
      filtered = campaigns.filter(
        (c) => c.status?.toLowerCase() === status.toLowerCase()
      );
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter((c) =>
        c.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const handleStatusChange = async (e: React.MouseEvent, campaign: Campaign) => {
    e.stopPropagation();
    const next = getStatusAction(campaign.status).next;
    const result = await campaignsAPI.update(campaign._id, { status: next as any });

    if (!result.success) {
      toast({ title: "Error", description: "Failed to update status.", variant: "destructive" });
    } else {
      setCampaigns((prev) =>
        prev.map((c) => (c._id === campaign._id ? { ...c, status: next as any } : c))
      );
      toast({ title: "Updated", description: `${campaign.name} is now ${next}` });
    }
  };

  const handleComplete = async (e: React.MouseEvent, campaign: Campaign) => {
    e.stopPropagation();
    const result = await campaignsAPI.update(campaign._id, { status: "completed" });

    if (!result.success) {
      toast({ title: "Error", description: "Failed to complete campaign.", variant: "destructive" });
    } else {
      setCampaigns((prev) =>
        prev.map((c) => (c._id === campaign._id ? { ...c, status: "completed" } : c))
      );
      toast({ title: "Completed", description: `${campaign.name} marked as completed` });
    }
  };

  const handleCardClick = (campaignId: string) => {
    navigate(`/campaigns/${campaignId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading campaigns...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 w-full p-6 md:p-8 space-y-6 overflow-y-auto h-[calc(100vh-theme(spacing.16))]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Campaigns</h1>
              <p className="text-base text-muted-foreground mt-1">Manage your influencer campaigns</p>
            </div>
            <div className="flex items-center gap-3">
              <Button size="lg" asChild>
                <Link to="/create-campaign">
                  <Plus className="mr-2 h-5 w-5" />
                  Create Campaign
                </Link>
              </Button>
              {/* <Button variant="outline" size="lg">
                <Download className="h-5 w-5" />
              </Button> */}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Active", value: activeCount, icon: Calendar, color: "text-primary", bg: "bg-primary/10" },
              { label: "Total Budget", value: `$${formatNumber(totalBudget)}`, icon: DollarSign, color: "text-green-600", bg: "bg-green-500/10" },
              { label: "Influencers", value: campaigns.reduce((sum, c) => sum + (c.influencers?.length || c.influencerCount || 0), 0), icon: Users, color: "text-blue-600", bg: "bg-blue-500/10" },
              { label: "Avg Performance", value: "+21%", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-500/10" },
            ].map((stat) => (
              <Card key={stat.label} className="border shadow-sm">
                <CardContent className="p-5 flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold mt-0.5">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Search */}
          <div className="flex gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search campaigns..."
                className="pl-11 h-11 text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {/* <Button variant="outline" size="lg">
              <Filter className="mr-2 h-5 w-5" />
              Filter
            </Button> */}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="h-11">
              <TabsTrigger value="all" className="text-sm px-5">All</TabsTrigger>
              <TabsTrigger value="active" className="text-sm px-5">Active</TabsTrigger>
              <TabsTrigger value="draft" className="text-sm px-5">Draft</TabsTrigger>
              <TabsTrigger value="completed" className="text-sm px-5">Completed</TabsTrigger>
            </TabsList>

            {["all", "active", "draft", "completed"].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-3 mt-4">
                {filterCampaignsByStatus(tab).map((campaign) => {
                  const ActionIcon = getStatusAction(campaign.status).icon;
                  return (
                    <Card
                      key={campaign._id}
                      className="border hover:border-primary/40 hover:shadow-lg transition-all cursor-pointer group"
                      onClick={() => handleCardClick(campaign._id)}
                    >
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between gap-6">
                          {/* Left: Name + Badge + Platforms */}
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
                                {campaign.targetPlatforms?.slice(0, 5).map((p: string) => (
                                  <PlatformIcon key={p} platform={p} className="h-4 w-4 opacity-70" />
                                ))}
                                {(campaign.targetPlatforms?.length || 0) > 5 && (
                                  <span className="text-xs text-muted-foreground">
                                    +{campaign.targetPlatforms!.length - 5}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Center: Stats */}
                          <div className="hidden md:flex items-center gap-8">
                            <div className="text-center min-w-[80px]">
                              <p className="text-xs text-muted-foreground mb-1">Budget</p>
                              <p className="font-semibold text-base">
                                ${campaign.budget?.total?.toLocaleString() || 0}
                              </p>
                            </div>
                            <div className="text-center min-w-[80px]">
                              <p className="text-xs text-muted-foreground mb-1">Reach</p>
                              <p className="font-semibold text-base">
                                {campaign.performance?.totalReach
                                  ? formatNumber(campaign.performance.totalReach)
                                  : "—"}
                              </p>
                            </div>
                            <div className="text-center min-w-[80px]">
                              <p className="text-xs text-muted-foreground mb-1">Engagement</p>
                              <p className="font-semibold text-base">
                                {campaign.performance?.totalEngagement
                                  ? formatNumber(campaign.performance.totalEngagement)
                                  : "—"}
                              </p>
                            </div>
                            <div className="text-center min-w-[100px]">
                              <p className="text-xs text-muted-foreground mb-1">Duration</p>
                              <p className="font-semibold text-sm">
                                {campaign.startDate
                                  ? new Date(campaign.startDate).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : "—"}
                                {" - "}
                                {campaign.endDate
                                  ? new Date(campaign.endDate).toLocaleDateString("en-US", {
                                      month: "short",
                                      day: "numeric",
                                    })
                                  : "—"}
                              </p>
                            </div>
                          </div>

                          {/* Right: Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            <Button
                              variant="outline"
                              size="default"
                              className="h-10 px-4"
                              onClick={(e) => handleStatusChange(e, campaign)}
                            >
                              <ActionIcon className="h-4 w-4 mr-2" />
                              {getStatusAction(campaign.status).label}
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="default"
                                  className="h-10 w-10 p-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <MoreHorizontal className="h-5 w-5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/edit-campaign/${campaign._id}`);
                                  }}
                                >
                                  Edit Campaign
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => handleComplete(e, campaign)}>
                                  Mark as Completed
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>

                            <ChevronRight className="h-5 w-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {filterCampaignsByStatus(tab).length === 0 && (
                  <div className="text-center py-16 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-40" />
                    <p className="text-lg">No {tab === "all" ? "" : tab} campaigns found</p>
                    <Button asChild variant="link" className="mt-2 text-base">
                      <Link to="/create-campaign">Create your first campaign</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
    </div>
  );
};
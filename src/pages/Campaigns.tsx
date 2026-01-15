import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
} from "lucide-react";
import { campaignsAPI, Campaign } from "@/lib/api";
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

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoading(true);
      
      const result = await campaignsAPI.getAll();

      if (!result.success) {
        console.error("Error fetching campaigns:", result.message);
        toast({
          title: "Error",
          description: "Failed to load campaigns",
          variant: "destructive",
        });
      } else {
        const campaignData = (result.data as any)?.campaigns || result.data || [];
        if (Array.isArray(campaignData)) {
          setCampaigns(campaignData);
          // Calculate active campaigns and total budget
          const active = campaignData.filter((c: Campaign) => c.status?.toLowerCase() === "active").length;
          setActiveCount(active);
          // Total budget
          const total = campaignData.reduce((sum: number, c: Campaign) => sum + (c.budget?.total || 0), 0);
          setTotalBudget(total);
        }
      }
      setLoading(false);
    };

    fetchCampaigns();
  }, []);

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

  const handleStatusChange = async (campaign: Campaign) => {
    const next = getStatusAction(campaign.status).next;
    const result = await campaignsAPI.update(campaign._id, { status: next as any });

    if (!result.success) {
      toast({
        title: "Error",
        description: "Failed to update campaign status.",
        variant: "destructive",
      });
    } else {
      setCampaigns((prev) =>
        prev.map((c) =>
          c._id === campaign._id ? { ...c, status: next as any } : c
        )
      );
      toast({
        title: "Status Updated",
        description: `${campaign.name} is now ${next}`,
      });
    }
  };

  const handleComplete = async (campaign: Campaign) => {
    const result = await campaignsAPI.update(campaign._id, { status: "completed" });

    if (!result.success) {
      toast({
        title: "Error",
        description: "Failed to mark campaign as completed.",
        variant: "destructive",
      });
    } else {
      setCampaigns((prev) =>
        prev.map((c) =>
          c._id === campaign._id ? { ...c, status: "completed" } : c
        )
      );
      toast({
        title: "Campaign Updated",
        description: `${campaign.name} marked as Completed`,
      });
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Loading campaigns...
      </div>
    );

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 w-full p-4 md:p-6 space-y-8 overflow-y-auto h-[calc(100vh-theme(spacing.16))]">
          
          {/* Page Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text">
                Campaigns
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Manage and track your influencer campaigns
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link to="/create-campaign">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Campaign
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
                onClick={() => console.log("Exporting campaigns...")}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Static Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <Card className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground font-medium">
                    Active Campaigns
                  </p>
                  <p className="text-2xl font-bold mt-1">{activeCount}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-success/10 rounded-lg">
                  <DollarSign className="h-5 w-5 text-success" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground font-medium">
                    Total Budget
                  </p>
                  <p className="text-2xl font-bold mt-1">${totalBudget.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-accent/10 rounded-lg">
                  <Users className="h-5 w-5 text-accent-foreground" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground font-medium">
                    Total Influencers
                  </p>
                  <p className="text-2xl font-bold mt-1">
                    {campaigns.reduce((sum, c) => sum + (c.influencers?.length || 0), 0)}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-6 flex items-center space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground font-medium">
                    Average Performance
                  </p>
                  <p className="text-2xl font-bold mt-1">+21%</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search */}
          <Card className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search campaigns..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="all" className="space-y-6">
            <div className="w-full overflow-x-auto pb-2">
              <TabsList>
                <TabsTrigger value="all">All Campaigns</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="draft">Draft</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </div>

            {["all", "active", "draft", "completed"].map((tab) => (
              <TabsContent key={tab} value={tab} className="space-y-4">
                {filterCampaignsByStatus(tab).map((campaign) => {
                  const ActionIcon = getStatusAction(campaign.status).icon;
                  return (
                    <Card
                      key={campaign._id}
                      className="shadow-card hover:shadow-elegant transition-shadow"
                    >
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                          
                          <div className="space-y-3 flex-1 w-full">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-semibold truncate">
                                {campaign.name}
                              </h3>
                              <Badge variant={getStatusColor(campaign.status)} className="capitalize">
                                {campaign.status}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Budget</p>
                                <p className="font-medium">
                                  ${campaign.budget?.total?.toLocaleString() || "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Reach</p>
                                <p className="font-medium">
                                  {campaign.performance?.totalReach?.toLocaleString() || "—"}
                                </p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">
                                  Engagement
                                </p>
                                <p className="font-medium">
                                  {campaign.performance?.totalEngagement?.toLocaleString() || "—"}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 space-y-2">
                              <div className="flex items-center justify-between text-sm md:w-3/4">
                                <span className="text-muted-foreground">
                                  Start Date:
                                </span>
                                <span className="font-medium">
                                  {campaign.startDate ? new Date(campaign.startDate).toLocaleDateString() : "—"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm md:w-3/4">
                                <span className="text-muted-foreground">
                                  End Date:
                                </span>
                                <span className="font-medium">
                                  {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : "—"}
                                </span>
                              </div>
                              <div className="flex items-center justify-between text-sm md:w-3/4">
                                <span className="text-muted-foreground">
                                  Target Platforms:
                                </span>
                                <div className="flex items-center space-x-2">
                                  {campaign.targetPlatforms?.map((p: string) => (
                                    <div
                                      key={p}
                                      className="flex items-center space-x-1"
                                    >
                                      <PlatformIcon platform={p} />
                                      <span className="text-xs capitalize">{p}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-row md:flex-col lg:flex-row items-center space-x-2 md:space-x-0 md:space-y-2 lg:space-y-0 lg:space-x-2 w-full md:w-auto mt-2 md:mt-0">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 md:flex-none"
                              onClick={() => handleStatusChange(campaign)}
                            >
                              <ActionIcon className="h-4 w-4 mr-2" />
                              {getStatusAction(campaign.status).label}
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="px-2">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link 
                                    to={`/edit-campaign/${campaign._id}`}
                                    className="cursor-pointer"
                                  >
                                    Edit Campaign
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleComplete(campaign)}
                                  className="cursor-pointer"
                                >
                                  Mark as Completed
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                {filterCampaignsByStatus(tab).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No {tab} campaigns found
                    </p>
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
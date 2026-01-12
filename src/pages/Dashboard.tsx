import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { UpgradeCard } from "@/components/upgrade/UpgradeCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  Target, 
  TrendingUp, 
  DollarSign,
  Plus,
  MessageSquare,
  ExternalLink
} from "lucide-react";

import { useEffect, useState } from "react";
import { dashboardAPI, campaignsAPI, Campaign } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ReferralCard from "@/components/referrals/ReferralCard";

// Static data for top influencers (will be replaced when backend is ready)
const topInfluencers = [
  {
    id: 1,
    name: "Sarah Johnson",
    handle: "@sarahjstyle",
    platform: "Instagram",
    followers: "24.5K",
    engagement: "6.2%",
    niche: "Fashion",
    matchScore: 94
  },
  {
    id: 2,
    name: "Mike Chen",
    handle: "@techreviewmike",
    platform: "YouTube",
    followers: "18.3K",
    engagement: "8.1%",
    niche: "Technology",
    matchScore: 89
  },
  {
    id: 3,
    name: "Emma Wellness",
    handle: "@emmawellness",
    platform: "TikTok",
    followers: "32.1K",
    engagement: "7.4%",
    niche: "Health & Wellness",
    matchScore: 92
  }
];

export const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeCount, setActiveCount] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      
      try {
        // Try to get dashboard overview first
        const dashboardResult = await dashboardAPI.getOverview();
        
        if (dashboardResult.success && dashboardResult.data) {
          const data = dashboardResult.data;
          setActiveCount(data.stats?.activeCampaigns || 0);
          setTotalBudget(data.stats?.totalSpend || 0);
          if (data.recentCampaigns) {
            setCampaigns(data.recentCampaigns);
          }
        } else {
          // Fallback to campaigns API
          const campaignsResult = await campaignsAPI.getAll({ limit: 5 });
          if (campaignsResult.success && campaignsResult.data) {
            const campaignData = (campaignsResult.data as any).campaigns || campaignsResult.data;
            if (Array.isArray(campaignData)) {
              setCampaigns(campaignData);
              const active = campaignData.filter((c: Campaign) => c.status === 'active').length;
              setActiveCount(active);
              const total = campaignData.reduce((sum: number, c: Campaign) => sum + (c.budget?.total || 0), 0);
              setTotalBudget(total);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const userName = user?.name?.split(' ')[0] || 'User';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 w-full p-4 md:p-6 space-y-8 overflow-y-auto h-[calc(100vh-theme(spacing.16))]">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
               <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Welcome back, {userName}! 👋</h1>
               <div className="flex items-center gap-2">
                 <h1 className="text-3xl md:text-4xl bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text font-bold tracking-tight">Dashboard</h1>
               </div>
               <p className="text-base md:text-lg text-muted-foreground mt-2">Here's what's happening with your influencer campaigns today.</p>
            </div>
            <div className="w-full md:w-auto">
              <button className="w-full md:w-auto text-md border text-white rounded-md px-6 py-2 bg-blue-500 hover:bg-blue-600 transition-all shadow-sm">
                Export
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatsCard
              title="Active Campaigns"
              value={loading ? "..." : activeCount.toLocaleString()}
              change={{ value: "+2", type: "increase" }}
              icon={<Target className="h-4 w-4" />}
            />
            <StatsCard
              title="Total Reach"
              value="2.4M"
              change={{ value: "+23%", type: "increase" }}
              icon={<Users className="h-4 w-4" />}
            />
            <StatsCard
              title="Campaign ROI"
              value="245%"
              change={{ value: "+12%", type: "increase" }}
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <StatsCard
              title="Total Spend"
              value={loading ? "..." : `$${totalBudget.toLocaleString()}`}
              change={{ value: "+8%", type: "increase" }}
              icon={<DollarSign className="h-4 w-4" />}
            />
          </div>

          {/* Recent Campaigns & Top Influencers */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
            {/* Recent Campaigns */}
            <Card className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg md:text-xl">Recent Campaigns</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/create-campaign">
                    <Plus className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">New Campaign</span>
                    <span className="sm:hidden">New</span>
                  </Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {loading ? (
                  <div className="text-center py-4">Loading campaigns...</div>
                ) : campaigns.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No campaigns yet. Create your first campaign!
                  </div>
                ) : (
                  campaigns.slice(0, 3).map((campaign) => (
                    <div key={campaign._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-accent/50 transition-colors gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-sm md:text-base">{campaign.name}</h4>
                          <Badge 
                            variant={campaign.status === "active" ? "default" : campaign.status === "completed" ? "secondary" : "outline"}
                            className="text-[10px] md:text-xs capitalize"
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs md:text-sm text-muted-foreground">
                          <span>{campaign.influencers?.length || 0} influencers</span>
                          <span>${campaign.budget?.total?.toLocaleString() || 0}</span>
                        </div>
                      </div>
                      <div className="flex justify-between sm:block text-right">
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0 sm:h-8 sm:w-8">
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Top Influencers */}
            <Card className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg md:text-xl">Top Performing</CardTitle>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/influencers">View All</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {topInfluencers.map((influencer) => (
                  <div key={influencer.id} className="flex items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-primary-foreground font-medium text-xs md:text-sm">
                        {influencer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="overflow-hidden">
                        <div className="font-medium text-sm md:text-base truncate">{influencer.name}</div>
                        <div className="text-xs md:text-sm text-muted-foreground truncate">{influencer.handle}</div>
                      </div>
                    </div>
                    <div className="text-right space-y-1 shrink-0">
                      <div className="flex items-center justify-end space-x-2">
                        <Badge variant="secondary" className="text-[10px] md:text-xs">
                          {influencer.matchScore}%
                        </Badge>
                      </div>
                      <div className="text-[10px] md:text-xs text-muted-foreground">
                        {influencer.followers} • {influencer.engagement}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Upgrade Card */}
            <div className="xl:col-span-1">
               <UpgradeCard />
            </div>
          </div>

          {/* Referral */}
          <ReferralCard />

          {/* Quick Actions */}
          <Card className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                <Button variant="outline" size="lg" className="h-auto py-6 flex-col space-y-2" asChild>
                  <Link to="/search">
                    <Users className="h-6 w-6" />
                    <span className="text-xs md:text-sm">Search</span>
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-auto py-6 flex-col space-y-2" asChild>
                  <Link to="/create-campaign">
                    <Target className="h-6 w-6" />
                    <span className="text-xs md:text-sm">Create</span>
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-auto py-6 flex-col space-y-2" asChild>
                  <Link to="/analytics">
                    <TrendingUp className="h-6 w-6" />
                    <span className="text-xs md:text-sm">Analytics</span>
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="h-auto py-6 flex-col space-y-2">
                  <MessageSquare className="h-6 w-6" />
                  <span className="text-xs md:text-sm">Help</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};
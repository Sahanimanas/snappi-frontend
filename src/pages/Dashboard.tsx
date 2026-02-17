import { Link, useNavigate } from "react-router-dom";
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
import { 
  dashboardAPI, 
  campaignsAPI,
  influencersAPI,
  Campaign,
  Influencer,
  formatNumber 
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import ReferralCard from "@/components/referrals/ReferralCard";

interface DashboardStatsData {
  activeCampaigns: number;
  activeCampaignsChange: number;
  totalReach: string;
  totalReachChange: number;
  campaignROI: string;
  campaignROIChange: number;
  totalSpend: string;
  totalSpendChange: number;
}

interface RecentCampaign {
  _id: string;
  name: string;
  status: string;
  budget: number;
  spent: number;
  influencerCount: number;
  createdAt: string;
}

export const Dashboard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [influencersLoading, setInfluencersLoading] = useState(true);
  
  const [stats, setStats] = useState<DashboardStatsData>({
    activeCampaigns: 0,
    activeCampaignsChange: 0,
    totalReach: "0",
    totalReachChange: 0,
    campaignROI: "0%",
    campaignROIChange: 0,
    totalSpend: "$0",
    totalSpendChange: 0,
  });
  const [campaigns, setCampaigns] = useState<RecentCampaign[]>([]);
  const [topInfluencers, setTopInfluencers] = useState<Influencer[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setInfluencersLoading(true);
      
      try {
        const dashboardResult = await dashboardAPI.getOverview();
        
        if (dashboardResult.success && dashboardResult.data) {
          const data = dashboardResult.data;
          
          if (data.stats) {
            setStats({
              activeCampaigns: data.stats.activeCampaigns?.value || 0,
              activeCampaignsChange: data.stats.activeCampaigns?.change || 0,
              totalReach: data.stats.totalReach?.formatted || "0",
              totalReachChange: data.stats.totalReach?.changePercent || 0,
              campaignROI: data.stats.campaignROI?.formatted || "0%",
              campaignROIChange: data.stats.campaignROI?.changePercent || 0,
              totalSpend: data.stats.totalSpend?.formatted || "$0",
              totalSpendChange: data.stats.totalSpend?.changePercent || 0,
            });
          }
          
          if (data.recentCampaigns) {
            setCampaigns(data.recentCampaigns);
          }
          
          if (data.topPerformingInfluencers) {
            setTopInfluencers(data.topPerformingInfluencers);
          }
        } else {
          await fetchFallbackData();
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
        await fetchFallbackData();
      } finally {
        setLoading(false);
        setInfluencersLoading(false);
      }
    };

    const fetchFallbackData = async () => {
      try {
        // Fetch campaigns
        const campaignsResult = await campaignsAPI.getAll({ limit: 5 });
        if (campaignsResult.success && campaignsResult.data) {
          const campaignData = Array.isArray(campaignsResult.data) ? campaignsResult.data : [];
          const formattedCampaigns: RecentCampaign[] = campaignData.map((c: Campaign) => ({
            _id: c._id,
            name: c.name,
            status: c.status,
            budget: c.budget?.total || 0,
            spent: c.budget?.spent || 0,
            influencerCount: c.influencers?.length || c.influencerCount || 0,
            createdAt: c.createdAt,
          }));
          setCampaigns(formattedCampaigns);
          
          const active = campaignData.filter((c: Campaign) => c.status === 'active').length;
          const totalSpent = campaignData.reduce((sum: number, c: Campaign) => sum + (c.budget?.spent || 0), 0);
          
          setStats(prev => ({
            ...prev,
            activeCampaigns: active,
            totalSpend: `$${totalSpent.toLocaleString()}`,
          }));
        }

        // Fetch top influencers by engagement
        const influencersResult = await influencersAPI.getTopByEngagement({ limit: 5 });
        if (influencersResult.success && influencersResult.data) {
          setTopInfluencers(influencersResult.data as Influencer[]);
        }
      } catch (error) {
        console.error("Error in fallback data fetch:", error);
      }
    };

    fetchDashboardData();
  }, [toast]);

  const userName = user?.name?.split(' ')[0] || 'User';

  const formatChange = (value: number, isPercent: boolean = false): string => {
    const sign = value >= 0 ? '+' : '';
    return isPercent ? `${sign}${value}%` : `${sign}${value}`;
  };

  const handleCampaignClick = (campaignId: string) => {
    navigate(`/campaigns?id=${campaignId}`);
  };

  const getInfluencerFollowers = (influencer: Influencer): number => {
    if (influencer.totalFollowers) return influencer.totalFollowers;
    if (influencer.platforms?.length > 0) {
      return influencer.platforms.reduce((sum, p) => sum + (p.followers || 0), 0);
    }
    return 0;
  };

  const getInfluencerEngagement = (influencer: Influencer): number => {
    if (influencer.avgEngagement) return influencer.avgEngagement;
    if (influencer.platforms?.length > 0) {
      const total = influencer.platforms.reduce((sum, p) => sum + (p.engagement || 0), 0);
      return Math.round((total / influencer.platforms.length) * 100) / 100;
    }
    return 0;
  };

  const getInfluencerPlatform = (influencer: Influencer): string => {
    if (influencer.platforms?.length > 0) {
      const topPlatform = influencer.platforms.reduce((top, p) => 
        (!top || p.followers > top.followers) ? p : top
      , influencer.platforms[0]);
      return topPlatform.platform;
    }
    return '';
  };

  const getInfluencerUsername = (influencer: Influencer): string => {
    if (influencer.platforms?.length > 0) {
      return `@${influencer.platforms[0].username}`;
    }
    return '';
  };

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
                 <h1 className="text-3xl md:text-4xl text-gray-900 font-bold tracking-tight">Dashboard</h1>
               </div>
               <p className="text-base md:text-lg text-muted-foreground mt-2">Here's what's happening with your influencer campaigns today.</p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatsCard
              title="Active Campaigns"
              value={loading ? "..." : stats.activeCampaigns.toString()}
              change={{ 
                value: formatChange(stats.activeCampaignsChange), 
                type: stats.activeCampaignsChange >= 0 ? "increase" : "decrease" 
              }}
              icon={<Target className="h-4 w-4" />}
            />
            <StatsCard
              title="Total Reach"
              value={loading ? "..." : stats.totalReach}
              change={{ 
                value: formatChange(stats.totalReachChange, true), 
                type: stats.totalReachChange >= 0 ? "increase" : "decrease" 
              }}
              icon={<Users className="h-4 w-4" />}
            />
            <StatsCard
              title="Campaign ROI"
              value={loading ? "..." : stats.campaignROI}
              change={{ 
                value: formatChange(stats.campaignROIChange, true), 
                type: stats.campaignROIChange >= 0 ? "increase" : "decrease" 
              }}
              icon={<TrendingUp className="h-4 w-4" />}
            />
            <StatsCard
              title="Total Spend"
              value={loading ? "..." : stats.totalSpend}
              change={{ 
                value: formatChange(stats.totalSpendChange, true), 
                type: stats.totalSpendChange >= 0 ? "increase" : "decrease" 
              }}
              icon={<DollarSign className="h-4 w-4" />}
            />
          </div>

          {/* Recent Campaigns & Top Influencers */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
            {/* Recent Campaigns */}
            <Card className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg md:text-xl">Recent Campaigns</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  aria-label="Create new campaign"
                >
                  <Link to="/create-campaign">
                    <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
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
                    <div 
                      key={campaign._id} 
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-accent/50 transition-colors gap-3 cursor-pointer"
                      onClick={() => handleCampaignClick(campaign._id)}
                      onKeyDown={(e) => e.key === 'Enter' && handleCampaignClick(campaign._id)}
                      tabIndex={0}
                      role="button"
                      aria-label={`View campaign: ${campaign.name}`}
                    >
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
                          <span>{campaign.influencerCount || 0} influencers</span>
                          <span>${(campaign.budget || 0).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex justify-between sm:block text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-6 w-6 p-0 sm:h-8 sm:w-8"
                          aria-label={`Open campaign ${campaign.name}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCampaignClick(campaign._id);
                          }}
                        >
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  aria-label="View all influencers"
                >
                  <Link to="/influencers">View All</Link>
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {influencersLoading ? (
                  <div className="text-center py-4">Loading influencers...</div>
                ) : topInfluencers.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No influencers found.
                  </div>
                ) : (
                  topInfluencers.map((influencer) => (
                    <div 
                      key={influencer._id} 
                      className="flex items-center justify-between p-3 md:p-4 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => navigate(`/influencers?id=${influencer._id}`)}
                      onKeyDown={(e) => e.key === 'Enter' && navigate(`/influencers?id=${influencer._id}`)}
                      tabIndex={0}
                      role="button"
                      aria-label={`View influencer: ${influencer.name}`}
                    >
                      <div className="flex items-center space-x-3">
                        {influencer.profileImage ? (
                          <img 
                            src={influencer.profileImage} 
                            alt={influencer.name}
                            className="h-8 w-8 md:h-10 md:w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-8 w-8 md:h-10 md:w-10 rounded-full bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center text-primary-foreground font-medium text-xs md:text-sm">
                            {influencer.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </div>
                        )}
                        <div className="overflow-hidden">
                          <div className="font-medium text-sm md:text-base truncate flex items-center gap-1">
                            {influencer.name}
                            {influencer.isVerified && (
                              <svg className="h-4 w-4 text-blue-500" viewBox="0 0 24 24" fill="currentColor" aria-label="Verified">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/>
                              </svg>
                            )}
                          </div>
                          <div className="text-xs md:text-sm text-muted-foreground truncate">
                            {getInfluencerUsername(influencer)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1 shrink-0">
                        <div className="flex items-center justify-end space-x-2">
                          <Badge variant="secondary" className="text-[10px] md:text-xs capitalize">
                            {getInfluencerPlatform(influencer)}
                          </Badge>
                        </div>
                        <div className="text-[10px] md:text-xs text-muted-foreground">
                          {formatNumber(getInfluencerFollowers(influencer))} • {getInfluencerEngagement(influencer).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  ))
                )}
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
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-auto py-6 flex-col space-y-2" 
                  asChild
                  aria-label="Search influencers"
                >
                  <Link to="/search">
                    <Users className="h-6 w-6" aria-hidden="true" />
                    <span className="text-xs md:text-sm">Search</span>
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-auto py-6 flex-col space-y-2" 
                  asChild
                  aria-label="Create campaign"
                >
                  <Link to="/create-campaign">
                    <Target className="h-6 w-6" aria-hidden="true" />
                    <span className="text-xs md:text-sm">Create</span>
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-auto py-6 flex-col space-y-2" 
                  asChild
                  aria-label="View analytics"
                >
                  <Link to="/analytics">
                    <TrendingUp className="h-6 w-6" aria-hidden="true" />
                    <span className="text-xs md:text-sm">Analytics</span>
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-auto py-6 flex-col space-y-2"
                  asChild
                  aria-label="Get help"
                >
                  <Link to="/help">
                    <MessageSquare className="h-6 w-6" aria-hidden="true" />
                    <span className="text-xs md:text-sm">Help</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};
import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import {
  TrendingUp,
  Eye,
  Heart,
  MousePointer,
  Download,
  Loader2,
} from "lucide-react";
import { dashboardAPI, formatNumber } from "@/lib/api";

export const Analytics = () => {
  const [dateRange, setDateRange] = useState("30days");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [topInfluencers, setTopInfluencers] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [analytics, setAnalytics] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [overviewRes, analyticsRes] = await Promise.all([
        dashboardAPI.getOverview(),
        dashboardAPI.getAnalytics(dateRange),
      ]);

      if (overviewRes.success && overviewRes.data) {
        setStats(overviewRes.data.stats);
        setCampaigns(overviewRes.data.recentCampaigns || []);
        setTopInfluencers(overviewRes.data.topPerformingInfluencers || []);
        setSummary(overviewRes.data.summary);
      }

      if (analyticsRes.success && analyticsRes.data) {
        setAnalytics(analyticsRes.data);
      }
    } catch (err) {
      console.error("Failed to fetch analytics:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const handleExport = async () => {
    try {
      const token = localStorage.getItem("snappi_user_token");
      const API_BASE = import.meta.env.VITE_API_URL || "/api";
      const res = await fetch(`${API_BASE}/dashboard/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `analytics_report_${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
    } catch {
      console.error("Export failed");
    }
  };

  // Build chart data from analytics
  const monthlyTrendData = analytics?.monthlyTrend?.map((m: any) => ({
    name: m.month,
    spent: m.spent || 0,
    budget: m.budget || 0,
    campaigns: m.campaigns || 0,
  })) || [];

  const platformData = analytics?.platformBreakdown?.map((p: any) => {
    const colors: Record<string, string> = {
      instagram: "#E4405F",
      tiktok: "#000000",
      youtube: "#FF0000",
      facebook: "#1877F2",
      twitter: "#1DA1F2",
      linkedin: "#0A66C2",
    };
    return {
      name: p.platform,
      value: p.count,
      color: colors[p.platform] || "#8884d8",
    };
  }) || [];

  const totalReach = stats?.totalReach?.value || 0;
  const totalSpent = stats?.totalSpend?.value || 0;
  const totalConversions = summary?.totalCampaigns || 0;
  const roi = stats?.campaignROI?.value || 0;
  const totalClicks = campaigns.reduce((sum: number, c: any) => sum + (c.clicks || 0), 0);

  // Engagement rate: totalEngagement / totalReach * 100
  const engagementRate = totalReach > 0 ? ((stats?.totalReach?.value || 0) > 0 ? (roi > 0 ? Math.min(roi / 30, 15) : 0) : 0) : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex min-w-0">
          <Sidebar />
          <main className="flex-1 p-4 md:p-6 w-full min-w-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex min-w-0">
        <Sidebar />

        <main className="flex-1 p-4 md:p-6 w-full min-w-0 space-y-8 max-w-7xl">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Analytics Dashboard</h1>
                <p className="text-base sm:text-lg text-muted-foreground">Track your campaign performance and influencer metrics</p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                    <SelectItem value="12months">Last year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleExport}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <Card className="shadow-card">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Eye className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">Total Reach</p>
                    <p className="text-xl sm:text-2xl font-bold truncate">{stats?.totalReach?.formatted || "0"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-green-500/10 rounded-lg">
                    <Heart className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">Active Campaigns</p>
                    <p className="text-xl sm:text-2xl font-bold">{stats?.activeCampaigns?.value || 0}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">ROI</p>
                    <p className="text-xl sm:text-2xl font-bold">{stats?.campaignROI?.formatted || "0%"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MousePointer className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-muted-foreground">Total Spend</p>
                    <p className="text-xl sm:text-2xl font-bold truncate">{stats?.totalSpend?.formatted || "$0"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Trend Chart */}
          {monthlyTrendData.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Monthly Spend Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={monthlyTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: number) => [`$${formatNumber(value)}`, '']} />
                    <Bar dataKey="budget" fill="hsl(var(--primary))" name="Budget" opacity={0.3} />
                    <Bar dataKey="spent" fill="hsl(var(--primary))" name="Spent" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Platform Breakdown & Quick Stats */}
          <div className="grid lg:grid-cols-2 gap-6">
            {platformData.length > 0 && (
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Campaigns by Platform</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={platformData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }: any) => `${name}: ${value}`}
                      >
                        {platformData.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Campaigns</span>
                  <span className="font-semibold">{summary?.totalCampaigns || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Campaigns</span>
                  <span className="font-semibold">{stats?.activeCampaigns?.value || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Influencers Worked With</span>
                  <span className="font-semibold">{summary?.totalInfluencersWorkedWith || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Budget</span>
                  <span className="font-semibold">${formatNumber(summary?.totalBudget || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Spend</span>
                  <span className="font-semibold">{stats?.totalSpend?.formatted || "$0"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Campaign ROI</span>
                  <span className="font-semibold">{stats?.campaignROI?.formatted || "0%"}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Campaigns */}
          {campaigns.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Recent Campaigns</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaigns.map((campaign: any) => (
                    <div key={campaign._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium truncate">{campaign.name}</h4>
                          <Badge variant={campaign.status === "active" ? "default" : campaign.status === "completed" ? "secondary" : "outline"}>
                            {campaign.status}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                          <span>Budget: ${formatNumber(campaign.budget || 0)}</span>
                          <span>Spent: ${formatNumber(campaign.spent || 0)}</span>
                          <span>Influencers: {campaign.influencerCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Top Influencers */}
          {topInfluencers.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Top Influencers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topInfluencers.map((inf: any) => (
                  <div key={inf._id} className="flex items-center justify-between p-3 border rounded gap-3">
                    <div className="min-w-0">
                      <div className="font-medium truncate">{inf.name}</div>
                      <div className="text-sm text-muted-foreground capitalize">{inf.platform || inf.niche || ""}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-medium">{formatNumber(inf.followers || 0)} followers</div>
                      <div className="text-sm text-muted-foreground">{(inf.engagement || 0).toFixed(1)}% eng.</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Campaign Status Breakdown */}
          {analytics?.statusBreakdown?.length > 0 && (
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Campaign Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {analytics.statusBreakdown.map((s: any) => (
                    <div key={s.status} className="text-center p-4 border rounded-lg">
                      <p className="text-2xl font-bold">{s.count}</p>
                      <p className="text-sm text-muted-foreground capitalize">{s.status}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </main>
      </div>
    </div>
  );
};

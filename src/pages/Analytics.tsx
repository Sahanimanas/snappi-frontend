import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/analytics/DateRangePicker";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { 
  TrendingUp, 
  Users, 
  Eye, 
  Heart, 
  MessageSquare,
  Download,
  Calendar,
  Target,
  MousePointer
} from "lucide-react";

// Sample data for charts
const reachData = [
  { name: 'Week 1', reach: 45000 },
  { name: 'Week 2', reach: 52000 },
  { name: 'Week 3', reach: 61000 },
  { name: 'Week 4', reach: 58000 },
  { name: 'Week 5', reach: 67000 },
  { name: 'Week 6', reach: 74000 },
  { name: 'Week 7', reach: 82000 },
  { name: 'Week 8', reach: 78000 },
];

const engagementByPlatform = [
  { name: 'Instagram', value: 45, color: '#E4405F' },
  { name: 'TikTok', value: 25, color: '#000000' },
  { name: 'YouTube', value: 20, color: '#FF0000' },
  { name: 'Facebook', value: 10, color: '#1877F2' },
];

const campaignPerformance = [
  {
    id: 1,
    name: "Summer Fashion Launch",
    status: "Active",
    reach: "124K",
    engagement: "6.2%",
    clicks: "2.4K",
    conversions: "186",
    roi: "+234%",
    spend: "£2,340"
  },
  {
    id: 2,
    name: "Wellness Brand Partnership", 
    status: "Completed",
    reach: "89K",
    engagement: "8.1%",
    clicks: "3.1K",
    conversions: "267",
    roi: "+456%",
    spend: "£2,800"
  },
  {
    id: 3,
    name: "Holiday Gift Guide",
    status: "Paused",
    reach: "67K", 
    engagement: "5.8%",
    clicks: "1.8K",
    conversions: "124",
    roi: "+178%",
    spend: "£1,890"
  }
];

const influencerStats = [
  { name: "Sarah Johnson", campaigns: 3, totalReach: "94K", avgEngagement: "7.2%" },
  { name: "Mike Chen", campaigns: 2, totalReach: "78K", avgEngagement: "8.1%" },
  { name: "Emma Wellness", campaigns: 4, totalReach: "156K", avgEngagement: "6.8%" }
];

const audienceInsights = [
  { metric: "Age 18-24", percentage: "32%" },
  { metric: "Age 25-34", percentage: "41%" },
  { metric: "Age 35-44", percentage: "18%" },
  { metric: "Age 45+", percentage: "9%" }
];

export const Analytics = () => {
  const [dateRange, setDateRange] = useState("30days");

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-8 max-w-7xl">
          {/* Header with Date Range Selector */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text tracking-tight">Analytics Dashboard</h1>
                <p className="text-lg text-muted-foreground">Track your campaign performance and influencer metrics</p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                    <SelectItem value="6months">Last 6 months</SelectItem>
                    <SelectItem value="1year">Last year</SelectItem>
                    <SelectItem value="custom">Custom range</SelectItem>
                  </SelectContent>
                </Select>
                {dateRange === "custom" && (
                  <DateRangePicker onDateRangeChange={(start, end) => console.log('Date range:', start, end)} />
                )}
                <Button variant="outline" onClick={() => console.log('Exporting report...')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Eye className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Reach</p>
                    <p className="text-2xl font-bold">2.4M</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-success/10 rounded-lg">
                    <Heart className="h-4 w-4 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Engagement Rate</p>
                    <p className="text-2xl font-bold">6.8%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <TrendingUp className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">ROI</p>
                    <p className="text-2xl font-bold">245%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MousePointer className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Link Clicks</p>
                    <p className="text-2xl font-bold">8.2K</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Reach Over Time Chart */}
          <Card className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Reach Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={reachData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${(value as number / 1000).toFixed(0)}K`, 'Reach']} />
                  <Line type="monotone" dataKey="reach" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Engagement by Platform & Audience Insights */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Engagement Rate by Platform</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={engagementByPlatform}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {engagementByPlatform.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Audience Insights */}
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Audience Demographics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {audienceInsights.map((insight, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm">{insight.metric}</span>
                    <span className="font-semibold">{insight.percentage}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Top Performing Campaigns */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {campaignPerformance.map((campaign) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium">{campaign.name}</h4>
                        <Badge variant={campaign.status === "Active" ? "default" : campaign.status === "Completed" ? "secondary" : "outline"}>
                          {campaign.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm text-muted-foreground">
                        <span>Reach: {campaign.reach}</span>
                        <span>Engagement: {campaign.engagement}</span>
                        <span>Clicks: {campaign.clicks}</span>
                        <span>Conversions: {campaign.conversions}</span>
                        <span>ROI: {campaign.roi}</span>
                        <span>Spend: {campaign.spend}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Influencer Performance & Additional Stats */}
          <div className="grid lg:grid-cols-2 gap-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Top Influencers</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {influencerStats.map((influencer, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded">
                    <div>
                      <div className="font-medium">{influencer.name}</div>
                      <div className="text-sm text-muted-foreground">{influencer.campaigns} campaigns</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{influencer.totalReach} reach</div>
                      <div className="text-sm text-muted-foreground">{influencer.avgEngagement} avg eng.</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-card">
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Total Campaigns</span>
                  <span className="font-semibold">12</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Influencers</span>
                  <span className="font-semibold">347</span>
                </div>
                <div className="flex justify-between">
                  <span>Total Spend</span>
                  <span className="font-semibold">£24,680</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg. Cost Per Click</span>
                  <span className="font-semibold">£0.89</span>
                </div>
                <div className="flex justify-between">
                  <span>Conversion Rate</span>
                  <span className="font-semibold">3.2%</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};
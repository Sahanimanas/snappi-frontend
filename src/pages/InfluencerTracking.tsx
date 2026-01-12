import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Copy,
  Link as LinkIcon,
  BarChart3,
  Users,
  TrendingUp,
  ExternalLink,
  Share2,
  Eye,
  Calendar,
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Influencer {
  id: number;
  name: string;
  handle: string;
  platform: string;
  followers: string;
  engagement: string;
  trackingLink?: string;
}

const mockInfluencers: Influencer[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    handle: "@sarahjstyle",
    platform: "Instagram",
    followers: "24.5K",
    engagement: "6.2%",
    trackingLink: "https://track.snappi.com/campaign/summer-fashion/sarah-johnson"
  },
  {
    id: 2,
    name: "Mike Chen", 
    handle: "@techreviewmike",
    platform: "YouTube",
    followers: "18.3K",
    engagement: "8.1%",
    trackingLink: "https://track.snappi.com/campaign/tech-review/mike-chen"
  },
  {
    id: 3,
    name: "Emma Wellness",
    handle: "@emmawellness", 
    platform: "TikTok",
    followers: "32.1K",
    engagement: "7.4%",
    trackingLink: "https://track.snappi.com/campaign/wellness/emma-wellness"
  }
];

export const InfluencerTracking = () => {
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);
  const { toast } = useToast();

  const generateTrackingLink = (influencer: Influencer) => {
    const baseUrl = "https://track.snappi.com";
    const campaignSlug = "current-campaign"; // This would come from actual campaign data
    const influencerSlug = influencer.handle.replace("@", "").toLowerCase();
    return `${baseUrl}/campaign/${campaignSlug}/${influencerSlug}`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Tracking link copied to clipboard",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-6">
          <div>
            <h1 className="text-3xl bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text font-bold">Influencer Performance Tracking</h1>
            <p className="text-muted-foreground">Generate and manage tracking links for your influencer campaigns</p>
          </div>

          <Tabs defaultValue="active" className="space-y-6">
            <TabsList>
              <TabsTrigger value="active">Active Campaigns</TabsTrigger>
              <TabsTrigger value="performance">Performance Overview</TabsTrigger>
              <TabsTrigger value="links">Manage Links</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-6">
              <div className="grid gap-4">
                {mockInfluencers.map((influencer) => (
                  <Card key={influencer.id} className="shadow-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                            {influencer.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="font-semibold">{influencer.name}</h3>
                            <p className="text-sm text-muted-foreground">{influencer.handle} • {influencer.platform}</p>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                              <span>{influencer.followers} followers</span>
                              <span>{influencer.engagement} engagement</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedInfluencer(influencer)}
                          >
                            <LinkIcon className="h-4 w-4 mr-2" />
                            Generate Link
                          </Button>
                          {influencer.trackingLink && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => copyToClipboard(influencer.trackingLink!)}
                            >
                              <Copy className="h-4 w-4 mr-2" />
                              Copy Link
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <BarChart3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {influencer.trackingLink && (
                        <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="text-xs text-muted-foreground mb-1">Tracking Link:</p>
                              <p className="text-sm font-mono break-all">{influencer.trackingLink}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(influencer.trackingLink, '_blank')}
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Eye className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Total Clicks</p>
                        <p className="text-2xl font-bold">1,247</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-success/10 rounded-lg">
                        <TrendingUp className="h-4 w-4 text-success" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Conversion Rate</p>
                        <p className="text-2xl font-bold">3.2%</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-2">
                      <div className="p-2 bg-accent/10 rounded-lg">
                        <Users className="h-4 w-4 text-accent-foreground" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Active Links</p>
                        <p className="text-2xl font-bold">{mockInfluencers.filter(i => i.trackingLink).length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockInfluencers.map((influencer) => (
                      <div key={influencer.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground text-sm font-bold">
                            {influencer.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <p className="font-medium">{influencer.name}</p>
                            <p className="text-sm text-muted-foreground">Last activity: 2 hours ago</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">127 clicks</p>
                          <p className="text-sm text-success">+23% vs yesterday</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="links" className="space-y-6">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Link Generator</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedInfluencer && (
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-3">Generate tracking link for {selectedInfluencer.name}</h4>
                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="campaign">Campaign Name</Label>
                          <Input id="campaign" placeholder="Enter campaign name" />
                        </div>
                        <div>
                          <Label htmlFor="link">Generated Tracking Link</Label>
                          <div className="flex items-center space-x-2">
                            <Input 
                              id="link" 
                              value={generateTrackingLink(selectedInfluencer)}
                              readOnly
                              className="font-mono text-sm"
                            />
                            <Button
                              size="sm"
                              onClick={() => copyToClipboard(generateTrackingLink(selectedInfluencer))}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <Button onClick={() => {
                          // Here you would save the tracking link
                          toast({
                            title: "Success!",
                            description: "Tracking link generated and saved",
                          });
                          setSelectedInfluencer(null);
                        }}>
                          Save Tracking Link
                        </Button>
                      </div>
                    </div>
                  )}
                  
                  {!selectedInfluencer && (
                    <p className="text-muted-foreground text-center py-8">
                      Select an influencer from the Active Campaigns tab to generate a tracking link
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};
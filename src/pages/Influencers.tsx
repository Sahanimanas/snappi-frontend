import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useInfluencers } from "@/hooks/useInfluencers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  MessageSquare,
  Mail,
  Users,
  TrendingUp,
  Heart,
  Eye,
  MoreHorizontal
} from "lucide-react";
import sofiaImage from "@/assets/sofia-martinez.jpg";
import jamesImage from "@/assets/james-thompson.jpg";
import mayaImage from "@/assets/maya-chen.jpg";

export const Influencers = () => {

  const { influencers, loading, error, canAccessContactInfo } = useInfluencers();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Available": return "default";
      case "Busy": return "destructive";
      case "Pending": return "secondary";
      default: return "outline";
    }
  };

  const getProfileImage = (name: string, profileImage: string | null) => {
    // Use imported images for our three influencers
    switch (name) {
      case 'Sofia Martinez': return sofiaImage;
      case 'James Thompson': return jamesImage;
      case 'Maya Chen': return mayaImage;
      default: return profileImage;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform?.toLowerCase()) {
      case "instagram": return "text-pink-500";
      case "youtube": return "text-red-500";
      case "tiktok": return "text-purple-500";
      case "twitch": return "text-purple-600";
      case "twitter": return "text-blue-500";
      case "facebook": return "text-blue-600";
      case "linkedin": return "text-blue-700";
      default: return "text-gray-500";
    }
  };
  const handleMessageClick = (influencer: any) => {
    if (!influencer.email) {
      alert("No contact email available for this influencer.");
      return;
    }

    const subject = `Collaboration Opportunity with Your Brand`;
    const body = `Hi ${influencer.name},

I hope you're doing great! We would love to collaborate with you.

Looking forward to hearing from you.

Best regards,
[Your Name]`;

    // Try Gmail first, then fallback
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      influencer.email
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Open Gmail in new tab
    window.open(gmailUrl, "_blank");

    // Also trigger default mail app if Gmail is not configured
    setTimeout(() => {
      window.location.href = `mailto:${influencer.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    }, 500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text font-bold tracking-tight">Influencers</h1>
                <p className="text-muted-foreground">Manage your influencer network</p>
              </div>
              <Link to="/search">
                <Button>
                  <Search className="mr-2 h-4 w-4" />
                  Find New Influencers
                </Button>
              </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Influencers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? "..." : influencers.length}</div>
                  <p className="text-xs text-muted-foreground">+2 new this month</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Collaborations</CardTitle>
                  <Heart className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3</div>
                  <p className="text-xs text-muted-foreground">+1 from last month</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? "..." : influencers.length > 0
                      ? (influencers.reduce((acc, inf) => acc + inf.engagement_rate, 0) / influencers.length).toFixed(1) + "%"
                      : "0%"
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">+0.3% from last month</p>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {loading ? "..." : influencers.length > 0
                      ? Math.round(influencers.reduce((acc, inf) => acc + (inf.follower_count || 0), 0) / 1000) + "K"
                      : "0"
                    }
                  </div>
                  <p className="text-xs text-muted-foreground">Combined followers</p>
                </CardContent>
              </Card>
            </div>

            {/* Search and Filters */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by name or niche..." className="pl-10" />
                  </div>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                  </Button>
                  <Button variant="outline">
                    Sort By
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Influencers List */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                {loading ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Loading influencers...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-destructive">Error: {error}</p>
                  </div>
                ) : (
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="all">All ({influencers.length})</TabsTrigger>
                      <TabsTrigger value="collaborating">Collaborating (0)</TabsTrigger>
                      <TabsTrigger value="favorites">Favorites (0)</TabsTrigger>
                      <TabsTrigger value="potential">Potential (0)</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-6">
                      {influencers.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-muted-foreground">No influencers found.</p>
                        </div>
                      ) : (
                        influencers.map((influencer) => (
                          <Card key={influencer.id} className="transition-all duration-300 hover:shadow-lg border-0 shadow-md bg-card/50 backdrop-blur-sm">
                            <CardContent className="p-6">
                              <div className="flex flex-col lg:flex-row gap-6">
                                {/* Profile Info */}
                                <div className="flex items-start space-x-4">
                                  {getProfileImage(influencer.name, influencer.profile_image) ? (
                                    <img
                                      src={getProfileImage(influencer.name, influencer.profile_image) as string}
                                      alt={influencer.name}
                                      className="h-16 w-16 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                                      {influencer.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                  )}
                                  <div className="space-y-2">
                                    <div>
                                      <h3 className="text-lg font-semibold">{influencer.name}</h3>
                                      {canAccessContactInfo(influencer.id) && influencer.email && (
                                        <p className="text-sm text-muted-foreground">{influencer.email}</p>
                                      )}
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                      <div className="flex items-center space-x-1">
                                        <span className={getPlatformColor(influencer.platform || '')}>●</span>
                                        <span>{influencer.platform || 'Unknown'}</span>
                                      </div>
                                      <span>{influencer.location || 'Location not specified'}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Badge variant="secondary">{influencer.categories || 'General'}</Badge>
                                      <Badge variant="outline">Available</Badge>
                                    </div>
                                  </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="text-center">
                                    <div className="text-lg font-bold">
                                      {influencer.follower_count
                                        ? (influencer.follower_count / 1000).toFixed(1) + 'K'
                                        : 'N/A'
                                      }
                                    </div>
                                    <div className="text-xs text-muted-foreground">Followers</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-success">
                                      {influencer.engagement_rate.toFixed(1)}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">Engagement</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold">
                                      {influencer.average_views
                                        ? (influencer.average_views / 1000).toFixed(1) + 'K'
                                        : 'N/A'
                                      }
                                    </div>
                                    <div className="text-xs text-muted-foreground">Avg Views</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-primary">
                                      {influencer.match_score ? influencer.match_score + '%' : 'N/A'}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Match Score</div>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col space-y-2 min-w-[120px]">
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => handleMessageClick(influencer)}
                                    disabled={!influencer.email}
                                  >
                                    <MessageSquare className="h-4 w-4 mr-2" />
                                    Message
                                  </Button>
                                  {canAccessContactInfo(influencer.id) ? (
                                    <Button size="sm" variant="outline">
                                      <Mail className="h-4 w-4 mr-2" />
                                      Contact
                                    </Button>
                                  ) : (
                                    <Button size="sm" variant="outline" disabled>
                                      <Mail className="h-4 w-4 mr-2" />
                                      Upgrade to Contact
                                    </Button>
                                  )}
                                  <Button size="sm" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}
                    </TabsContent>

                    <TabsContent value="collaborating" className="space-y-6">
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No active collaborations found.</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="favorites" className="space-y-6">
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No favorite influencers yet.</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="potential" className="space-y-6">
                      <div className="text-center py-8">
                        <p className="text-muted-foreground">No potential influencers identified.</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};
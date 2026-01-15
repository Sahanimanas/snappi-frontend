import { useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useInfluencers, InfluencerQueryParams } from "@/hooks/useInfluencers";
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
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";

import sofiaImage from "@/assets/sofia-martinez.jpg";
import jamesImage from "@/assets/james-thompson.jpg";
import mayaImage from "@/assets/maya-chen.jpg";

export const Influencers = () => {
  // --- STATE MANAGEMENT ---
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  // Filter States
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("");
  const [country, setCountry] = useState("");
  
  // Sort States
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("desc");

  // Construct the query object
  const queryParams: InfluencerQueryParams = {
    page,
    limit: 10,
    search: searchTerm,
    platform: platform || undefined,
    country: country || undefined,
  };

  // Pass queryParams to the hook
  const { influencers, pagination, loading, error, canAccessContactInfo } = useInfluencers(queryParams);

  // --- HANDLERS ---

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset page to 1 when filters change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1); 
  };

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    // Value format expected: "field-direction" (e.g. "followers-desc")
    const [field, direction] = value.split('-');
    setSortBy(field);
    setSortOrder(direction as 'asc' | 'desc');
    setPage(1);
  };

  const clearFilters = () => {
    setPlatform("");
    setStatus("");
    setCountry("");
    setSearchTerm("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setPage(1);
  };

  // --- HELPERS ---

  const getProfileImage = (name: string, profileImage: string | undefined) => {
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
    const subject = `Collaboration Opportunity`;
    const body = `Hi ${influencer.name},\n\nWe would love to collaborate with you.`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(influencer.email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank");
  };

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  const totalPages = pagination?.pages || 1;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />

        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Page Header */}
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
                  <div className="text-2xl font-bold">{pagination?.total || 0}</div>
                  <p className="text-xs text-muted-foreground">Based on current filters</p>
                </CardContent>
              </Card>
              
              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Collaborations</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Engagement</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {influencers.length > 0
                      ? (influencers.reduce((acc, inf) => acc + inf.engagement, 0) / influencers.length).toFixed(1) + "%"
                      : "0%"
                    }
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Reach</CardTitle>
                  <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {influencers.length > 0
                      ? Math.round(influencers.reduce((acc, inf) => acc + inf.followers, 0) / 1000) + "K"
                      : "0"
                    }
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* --- SEARCH & FILTER SECTION --- */}
            <Card className="shadow-card overflow-visible">
              <CardContent className="p-6">
                <div className="flex flex-col gap-4">
                  {/* Row 1: Search, Filter Toggle, Sort */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search by name, niche, or bio..." 
                        className="pl-10" 
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                    </div>
                    
                    <Button 
                      variant={showFilters ? "secondary" : "outline"} 
                      onClick={() => setShowFilters(!showFilters)}
                    >
                      <Filter className="mr-2 h-4 w-4" />
                      Filters {(platform || status || country) && "(Active)"}
                    </Button>

                    {/* Sort Dropdown */}
                    <div className="min-w-[180px]">
                      <select 
                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={`${sortBy}-${sortOrder}`}
                        onChange={(e) => handleSortChange(e.target.value)}
                      >
                        <option value="createdAt-desc">Newest First</option>
                        <option value="createdAt-asc">Oldest First</option>
                        <option value="followers-desc">Followers (High to Low)</option>
                        <option value="followers-asc">Followers (Low to High)</option>
                        <option value="engagement-desc">Engagement (High to Low)</option>
                        <option value="matchScore-desc">Match Score (High to Low)</option>
                      </select>
                    </div>
                  </div>

                  {/* Row 2: Expanded Filters */}
                  {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t animate-in fade-in slide-in-from-top-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Platform</label>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={platform}
                          onChange={(e) => handleFilterChange(setPlatform, e.target.value)}
                        >
                          <option value="">All Platforms</option>
                          <option value="instagram">Instagram</option>
                          <option value="youtube">YouTube</option>
                          <option value="tiktok">TikTok</option>
                          <option value="twitter">Twitter</option>
                          <option value="linkedin">LinkedIn</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Status</label>
                        <select 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={status}
                          onChange={(e) => handleFilterChange(setStatus, e.target.value)}
                        >
                          <option value="">All Statuses</option>
                          <option value="available">Available</option>
                          <option value="busy">Busy</option>
                          <option value="unavailable">Unavailable</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Country</label>
                        <Input 
                          placeholder="e.g. USA, UK" 
                          value={country}
                          onChange={(e) => handleFilterChange(setCountry, e.target.value)}
                        />
                      </div>

                      <div className="flex items-end">
                        <Button 
                          variant="ghost" 
                          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={clearFilters}
                        >
                          <X className="mr-2 h-4 w-4" /> Reset Filters
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* --- INFLUENCERS LIST --- */}
            <Card className="shadow-card">
              <CardContent className="p-6">
                {loading ? (
                  <div className="text-center py-20"><p className="text-muted-foreground animate-pulse">Loading influencers...</p></div>
                ) : error ? (
                  <div className="text-center py-20 text-destructive">Error: {error}</div>
                ) : (
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="grid w-full grid-cols-4 mb-6">
                      <TabsTrigger value="all">All ({pagination?.total || influencers.length})</TabsTrigger>
                      <TabsTrigger value="collaborating">Collaborating</TabsTrigger>
                      <TabsTrigger value="favorites">Favorites</TabsTrigger>
                      <TabsTrigger value="potential">Potential</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-6">
                      {influencers.length === 0 ? (
                        <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed">
                          <p className="text-lg font-medium">No influencers found</p>
                          <p className="text-muted-foreground">Try adjusting your search or filters</p>
                          <Button variant="link" onClick={clearFilters} className="mt-2">Clear all filters</Button>
                        </div>
                      ) : (
                        influencers.map((influencer) => (
                          <Card key={influencer._id} className="transition-all hover:shadow-lg border-0 shadow-md bg-card/50">
                            <CardContent className="p-6">
                              <div className="flex flex-col lg:flex-row gap-6">
                                {/* Profile Info */}
                                <div className="flex items-start space-x-4 min-w-[280px]">
                                  {getProfileImage(influencer.name, influencer.profileImage) ? (
                                    <img 
                                      src={getProfileImage(influencer.name, influencer.profileImage) as string} 
                                      className="h-16 w-16 rounded-full object-cover" 
                                      alt={influencer.name} 
                                    />
                                  ) : (
                                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                      {influencer.name.slice(0, 2).toUpperCase()}
                                    </div>
                                  )}
                                  <div>
                                    <h3 className="text-lg font-semibold">{influencer.name}</h3>
                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                      <span className={getPlatformColor(influencer.platform)}>●</span>
                                      <span className="capitalize">{influencer.platform}</span>
                                    </div>
                                    <div className="flex gap-1 mt-1">
                                      <Badge variant="secondary" className="text-[10px]">
                                        {influencer.country || 'Global'}
                                      </Badge>
                                      {influencer.categories && influencer.categories.length > 0 && (
                                        <Badge variant="outline" className="text-[10px]">
                                          {influencer.categories[0]}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Stats */}
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="text-center">
                                    <div className="text-lg font-bold">
                                      {formatFollowerCount(influencer.followers)}
                                    </div>
                                    <div className="text-xs text-muted-foreground">Followers</div>
                                  </div>  
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-success">
                                      {influencer.engagement.toFixed(1)}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">Engagement</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold">
                                      {influencer.avgViews 
                                        ? formatFollowerCount(influencer.avgViews)
                                        : '0'
                                      }
                                    </div>
                                    <div className="text-xs text-muted-foreground">Avg Views</div>
                                  </div>
                                  <div className="text-center">
                                    <div className="text-lg font-bold text-primary">
                                      {influencer.matchScore || 0}%
                                    </div>
                                    <div className="text-xs text-muted-foreground">Match</div>
                                  </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col space-y-2 min-w-[120px]">
                                  <Button 
                                    size="sm" 
                                    onClick={() => handleMessageClick(influencer)} 
                                    disabled={!influencer.email}
                                  >
                                    <MessageSquare className="h-4 w-4 mr-2" /> Message
                                  </Button>
                                  <Button size="sm" variant="outline">
                                    <Mail className="h-4 w-4 mr-2" /> Contact
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      )}

                      {/* --- Pagination Controls --- */}
                      <div className="flex items-center justify-between border-t pt-6 mt-8">
                        <p className="text-sm text-muted-foreground">
                          Page <span className="font-medium text-foreground">{page}</span> of <span className="font-medium text-foreground">{totalPages}</span>
                        </p>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={!pagination?.hasPrevPage}
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={!pagination?.hasNextPage}
                          >
                            Next <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
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
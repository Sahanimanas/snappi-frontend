import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddToCampaignDialog } from "@/components/AddToCampaignDialog";
import {
  Search,
  Filter,
  MessageSquare,
  Users,
  TrendingUp,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  Loader2,
  ExternalLink,
  Plus,
} from "lucide-react";
import { influencersAPI, Influencer, Platform, formatNumber } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// PlatformIconLink component (same as before)
const PlatformIconLink = ({ platform }: { platform: Platform }) => {
  const getIcon = (name: string) => {
    const iconClass = "h-5 w-5";
    switch (name?.toLowerCase()) {
      case "instagram":
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
          </svg>
        );
      case "youtube":
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
        );
      case "tiktok":
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
          </svg>
        );
      case "twitter":
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        );
      case "facebook":
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        );
      case "linkedin":
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        );
      default:
        return <ExternalLink className={iconClass} />;
    }
  };

  const getColor = (name: string) => {
    switch (name?.toLowerCase()) {
      case "instagram": return "text-pink-500 hover:text-pink-600";
      case "youtube": return "text-red-500 hover:text-red-600";
      case "tiktok": return "text-gray-900 hover:text-black dark:text-white";
      case "twitter": return "text-gray-900 hover:text-black dark:text-white";
      case "facebook": return "text-blue-600 hover:text-blue-700";
      case "linkedin": return "text-blue-700 hover:text-blue-800";
      default: return "text-gray-500 hover:text-gray-600";
    }
  };

  return (
    <a
      href={platform.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`${getColor(platform.platform)} transition-colors inline-flex items-center`}
      title={`@${platform.username} on ${platform.platform} (${formatNumber(platform.followers)} followers)`}
      onClick={(e) => e.stopPropagation()}
    >
      {getIcon(platform.platform)}
    </a>
  );
};

export const Influencers = () => {
  const { toast } = useToast();

  // Data state
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("");
  const [country, setCountry] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Campaign Dialog
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetchInfluencers();
  }, [page, searchTerm, platform, status, country, sortBy, sortOrder]);

  const fetchInfluencers = async () => {
    setLoading(true);
    setError(null);

    const result = await influencersAPI.getAll({
      page,
      limit: 10,
      search: searchTerm || undefined,
      platform: platform || undefined,
      status: status || undefined,
      country: country || undefined,
      sortBy,
      sortOrder,
    });

    if (!result.success) {
      setError(result.message || "Failed to load influencers");
      setInfluencers([]);
    } else {
      const data = Array.isArray(result.data) ? result.data : [];
      setInfluencers(data);
      setTotal(result.total || data.length);
      setTotalPages(result.totalPages || Math.ceil((result.total || data.length) / 10));
    }
    setLoading(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (setter: React.Dispatch<React.SetStateAction<string>>, value: string) => {
    setter(value);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    const [field, direction] = value.split("-");
    setSortBy(field);
    setSortOrder(direction as "asc" | "desc");
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

  const handleContactClick = (influencer: Influencer) => {
    const email = influencer.email || influencer.contactInfo?.email;
    if (!email) {
      toast({
        title: "No contact info",
        description: "No email available for this influencer.",
        variant: "destructive",
      });
      return;
    }
    const subject = `Collaboration Opportunity`;
    const body = `Hi ${influencer.name},\n\nWe would love to collaborate with you.`;
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank");
  };

  const handleAddToShortlist = (influencer: Influencer) => {
    setSelectedInfluencer({ id: influencer._id, name: influencer.name });
    setCampaignDialogOpen(true);
  };

  // Stats
  const avgEngagement = influencers.length > 0
    ? (influencers.reduce((acc, inf) => acc + (inf.avgEngagement || 0), 0) / influencers.length).toFixed(1)
    : "0";
  const totalReach = influencers.reduce((acc, inf) => acc + (inf.totalFollowers || 0), 0);
  const hasActiveFilters = platform || status || country || searchTerm;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 w-full p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold">Influencers</h1>
              <p className="text-base text-muted-foreground mt-1">Manage your influencer network</p>
            </div>
            {/* <Button size="lg" asChild>
              <Link to="/search">
                <Search className="mr-2 h-5 w-5" />
                Find New Influencers
              </Link>
            </Button> */}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Influencers", value: total, icon: Users, color: "text-primary", bg: "bg-primary/10" },
              { label: "Active Collaborations", value: 0, icon: TrendingUp, color: "text-green-600", bg: "bg-green-500/10" },
              { label: "Avg Engagement", value: `${avgEngagement}%`, icon: TrendingUp, color: "text-blue-600", bg: "bg-blue-500/10" },
              { label: "Total Reach", value: formatNumber(totalReach), icon: Eye, color: "text-purple-600", bg: "bg-purple-500/10" },
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

          {/* Search & Filters */}
          <Card className="shadow-sm">
            <CardContent className="p-5">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, username, or bio..."
                      className="pl-11 h-11 text-base"
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                  </div>

                  <Button
                    variant={showFilters ? "secondary" : "outline"}
                    size="lg"
                    onClick={() => setShowFilters(!showFilters)}
                  >
                    <Filter className="mr-2 h-5 w-5" />
                    Filters {hasActiveFilters && "(Active)"}
                  </Button>

                  <select
                    className="h-11 min-w-[200px] rounded-md border border-input bg-background px-4 text-sm"
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => handleSortChange(e.target.value)}
                  >
                    <option value="createdAt-desc">Newest First</option>
                    <option value="createdAt-asc">Oldest First</option>
                    <option value="followers-desc">Followers (High to Low)</option>
                    <option value="followers-asc">Followers (Low to High)</option>
                    <option value="engagement-desc">Engagement (High to Low)</option>
                  </select>
                </div>

                {showFilters && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Platform</label>
                      <select
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                        value={platform}
                        onChange={(e) => handleFilterChange(setPlatform, e.target.value)}
                      >
                        <option value="">All Platforms</option>
                        <option value="instagram">Instagram</option>
                        <option value="youtube">YouTube</option>
                        <option value="tiktok">TikTok</option>
                        <option value="twitter">Twitter/X</option>
                        <option value="facebook">Facebook</option>
                        <option value="linkedin">LinkedIn</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Status</label>
                      <select
                        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
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
                        placeholder="e.g. USA, UK, India"
                        className="h-10"
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
                        <X className="mr-2 h-4 w-4" /> Reset
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Influencers List */}
          <Card className="shadow-sm">
            <CardContent className="p-5">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              ) : error ? (
                <div className="text-center py-20 text-destructive">{error}</div>
              ) : (
                <Tabs defaultValue="all" className="w-full">
                  <TabsList className="h-11 mb-6">
                    <TabsTrigger value="all" className="px-6">All ({total})</TabsTrigger>
                    <TabsTrigger value="collaborating" className="px-6">Collaborating</TabsTrigger>
                    <TabsTrigger value="favorites" className="px-6">Favorites</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-3">
                    {influencers.length === 0 ? (
                      <div className="text-center py-16 bg-muted/20 rounded-lg border border-dashed">
                        <Users className="h-12 w-12 mx-auto mb-4 opacity-40" />
                        <p className="text-lg font-medium">No influencers found</p>
                        <p className="text-muted-foreground">Try adjusting your filters</p>
                        <Button variant="link" onClick={clearFilters} className="mt-2">
                          Clear all filters
                        </Button>
                      </div>
                    ) : (
                      influencers.map((influencer) => (
                        <Card
                          key={influencer._id}
                          className="border hover:border-primary/40 hover:shadow-md transition-all"
                        >
                          <CardContent className="p-5">
                            <div className="flex items-center gap-6">
                              {/* Avatar + Info */}
                              <div className="flex items-center gap-4 min-w-[320px]">
                                <Avatar className="h-14 w-14 border-2 border-muted">
                                  <AvatarImage src={influencer.profileImage} alt={influencer.name} />
                                  <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                                    {influencer.name?.slice(0, 2).toUpperCase()}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold truncate">{influencer.name}</h3>
                                    {influencer.isVerified && (
                                      <Badge className="bg-blue-500 text-white text-[10px] px-1.5">✓</Badge>
                                    )}
                                  </div>

                                  {/* Platform Icons */}
                                  <div className="flex items-center gap-3 mt-2">
                                    {influencer.platforms?.map((p) => (
                                      <PlatformIconLink key={p._id || p.platform} platform={p} />
                                    ))}
                                  </div>

                                  {/* Location */}
                                  {(influencer.location?.city || influencer.location?.country) && (
                                    <div className="flex items-center gap-1 mt-1.5 text-sm text-muted-foreground">
                                      <MapPin className="h-3.5 w-3.5" />
                                      {[influencer.location.city, influencer.location.country]
                                        .filter(Boolean)
                                        .join(", ")}
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Stats */}
                              <div className="flex-1 flex items-center justify-center gap-8">
                                <div className="text-center">
                                  <p className="text-2xl font-bold">
                                    {formatNumber(influencer.totalFollowers || 0)}
                                  </p>
                                  <p className="text-xs text-muted-foreground">Total Followers</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-2xl font-bold text-green-600">
                                    {(influencer.avgEngagement || 0).toFixed(1)}%
                                  </p>
                                  <p className="text-xs text-muted-foreground">Avg Engagement</p>
                                </div>
                                <div className="text-center">
                                  <p className="text-2xl font-bold">
                                    {influencer.platformCount || influencer.platforms?.length || 0}
                                  </p>
                                  <p className="text-xs text-muted-foreground">Platforms</p>
                                </div>
                                <div className="text-center">
                                  <Badge
                                    variant={influencer.status === 'available' ? 'default' : 'secondary'}
                                    className="mb-1"
                                  >
                                    {influencer.status || 'Available'}
                                  </Badge>
                                  <p className="text-xs text-muted-foreground">Status</p>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex flex-col gap-2 min-w-[150px]">
                                <Button onClick={() => handleAddToShortlist(influencer)}>
                                  <Plus className="h-4 w-4 mr-2" />
                                  Add to Shortlist
                                </Button>
                                <Button variant="outline" onClick={() => handleContactClick(influencer)}>
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  Contact
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}

                    {/* Pagination */}
                    {influencers.length > 0 && (
                      <div className="flex items-center justify-between border-t pt-6 mt-6">
                        <p className="text-sm text-muted-foreground">
                          Page <span className="font-medium">{page}</span> of{" "}
                          <span className="font-medium">{totalPages}</span>
                          <span className="ml-2">({total} total)</span>
                        </p>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page <= 1}
                          >
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Previous
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page >= totalPages}
                          >
                            Next
                            <ChevronRight className="h-4 w-4 ml-1" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="collaborating">
                    <div className="text-center py-16 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-40" />
                      <p>No active collaborations</p>
                    </div>
                  </TabsContent>

                  <TabsContent value="favorites">
                    <div className="text-center py-16 text-muted-foreground">
                      <Users className="h-12 w-12 mx-auto mb-4 opacity-40" />
                      <p>No favorite influencers yet</p>
                    </div>
                  </TabsContent>
                </Tabs>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Add to Campaign Dialog */}
      {selectedInfluencer && (
        <AddToCampaignDialog
          open={campaignDialogOpen}
          onOpenChange={setCampaignDialogOpen}
          influencerId={selectedInfluencer.id}
          influencerName={selectedInfluencer.name}
          onSuccess={(campaignId, campaignName) => {
            // Optional: refresh data or show additional feedback
          }}
        />
      )}
    </div>
  );
};
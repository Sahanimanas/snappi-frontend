import { useState, useEffect, useCallback } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { influencersAPI, Influencer } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Link } from "react-router-dom";
import {
  Search,
  Filter,
  MapPin,
  Users,
  Plus,
  Smartphone,
  Target,
  BarChart3,
  Hash,
  X,
  Loader2,
  Sparkles
} from "lucide-react";

const mainCountries = [
  { value: "usa", label: "🇺🇸 United States" },
  { value: "uk", label: "🇬🇧 United Kingdom" },
  { value: "canada", label: "🇨🇦 Canada" },
  { value: "australia", label: "🇦🇺 Australia" },
  { value: "germany", label: "🇩🇪 Germany" },
  { value: "france", label: "🇫🇷 France" },
];

const otherCountries = [
  { value: "afghanistan", label: "🇦🇫 Afghanistan" },
  { value: "albania", label: "🇦🇱 Albania" },
  { value: "algeria", label: "🇩🇿 Algeria" },
  { value: "argentina", label: "🇦🇷 Argentina" },
  { value: "brazil", label: "🇧🇷 Brazil" },
  { value: "china", label: "🇨🇳 China" },
  { value: "india", label: "🇮🇳 India" },
  { value: "japan", label: "🇯🇵 Japan" },
  { value: "mexico", label: "🇲🇽 Mexico" },
  { value: "south-korea", label: "🇰🇷 South Korea" },
];

const platformOptions = [
  { value: "instagram", label: "Instagram", platform: "instagram" },
  { value: "tiktok", label: "TikTok", platform: "tiktok" },
  { value: "youtube", label: "YouTube", platform: "youtube" },
  { value: "facebook", label: "Facebook", platform: "facebook" },
  { value: "twitter", label: "X (Twitter)", platform: "twitter" },
  { value: "linkedin", label: "LinkedIn", platform: "linkedin" },
  { value: "pinterest", label: "Pinterest", platform: "pinterest" }
];

const nicheOptions = [
  { value: "all", label: "All niches" },
  { value: "fashion", label: "Fashion & Beauty" },
  { value: "tech", label: "Technology" },
  { value: "wellness", label: "Health & Wellness" },
  { value: "food", label: "Food & Drink" },
  { value: "travel", label: "Travel" },
  { value: "fitness", label: "Fitness" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "parenting", label: "Parenting" },
  { value: "gaming", label: "Gaming" },
  { value: "finance", label: "Finance" },
  { value: "education", label: "Education" },
  { value: "business", label: "Business" }
];

// Local storage key for shortlist
const SHORTLIST_KEY = 'snappi_shortlist';

export const SearchInfluencers = () => {
  // Search state
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter states - all default to "all" or empty (meaning all)
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedNiche, setSelectedNiche] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [campaignObjective, setCampaignObjective] = useState("both"); // Default to "both"
  const [keywords, setKeywords] = useState("");
  const [followerRange, setFollowerRange] = useState([1000, 500000]);
  const [engagementRange, setEngagementRange] = useState([0, 15.0]);

  // UI states
  const [showResults, setShowResults] = useState(false);
  const [shortlist, setShortlist] = useState<string[]>([]);
  const [displayLimit, setDisplayLimit] = useState(20);
  const [mode, setMode] = useState<"none" | "search" | "all" | "recommendations">("none");
  const [initialLoad, setInitialLoad] = useState(true);

  // Load shortlist from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SHORTLIST_KEY);
    if (stored) {
      try {
        setShortlist(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading shortlist:', e);
      }
    }
  }, []);

  // Save shortlist to localStorage
  useEffect(() => {
    localStorage.setItem(SHORTLIST_KEY, JSON.stringify(shortlist));
  }, [shortlist]);

  // Auto-load all influencers on initial mount
  useEffect(() => {
    if (initialLoad) {
      handleViewAll();
      setInitialLoad(false);
    }
  }, [initialLoad]);

  // API call: Search influencers
  const handleSearch = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMode("search");
    setShowResults(true);

    try {
      const result = await influencersAPI.search({
        search: searchQuery || undefined,
        platforms: selectedPlatforms.length > 0 ? selectedPlatforms : undefined,
        niche: selectedNiche === "all" ? undefined : selectedNiche,
        location: selectedLocation === "all" ? undefined : selectedLocation,
        keywords: keywords || undefined,
        minFollowers: followerRange[0],
        maxFollowers: followerRange[1],
        minEngagement: engagementRange[0],
        maxEngagement: engagementRange[1],
        campaignObjective: campaignObjective as 'awareness' | 'sales' | 'both'
      });

      if (result.success && result.data) {
        setInfluencers(result.data);
        setTotalCount(result.total || result.count || result.data.length);
      } else {
        setError(result.message || 'Failed to search influencers');
        setInfluencers([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search influencers');
      setInfluencers([]);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedPlatforms, selectedNiche, selectedLocation, keywords, followerRange, engagementRange, campaignObjective]);

  // API call: View all influencers
  const handleViewAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMode("all");
    setShowResults(true);

    try {
      const result = await influencersAPI.getAllNoPagination();

      if (result.success && result.data) {
        setInfluencers(result.data);
        setTotalCount(result.count || result.data.length);
      } else {
        setError(result.message || 'Failed to load influencers');
        setInfluencers([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load influencers');
      setInfluencers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // API call: Get AI recommendations
  const handleGetRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    setMode("recommendations");
    setShowResults(true);

    try {
      const result = await influencersAPI.getRecommendations({
        campaignObjective: campaignObjective,
        platforms: selectedPlatforms.length > 0 ? selectedPlatforms : undefined,
        niche: selectedNiche === "all" ? undefined : selectedNiche,
        limit: 50
      });

      if (result.success && result.data) {
        setInfluencers(result.data);
        setTotalCount(result.count || result.data.length);
      } else {
        setError(result.message || 'Failed to get recommendations');
        setInfluencers([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to get recommendations');
      setInfluencers([]);
    } finally {
      setLoading(false);
    }
  }, [campaignObjective, selectedPlatforms, selectedNiche]);

  // Results to display with pagination
  const resultsToShow = influencers.slice(0, displayLimit);
  const hasMoreResults = influencers.length > displayLimit;

  // Reset display limit when results change
  useEffect(() => {
    setDisplayLimit(20);
  }, [influencers]);

  // Add influencer to shortlist
  const addToShortlist = (influencerId: string) => {
    if (!shortlist.includes(influencerId)) {
      setShortlist([...shortlist, influencerId]);
    }
  };

  // Remove influencer from shortlist
  const removeFromShortlist = (influencerId: string) => {
    setShortlist(shortlist.filter(id => id !== influencerId));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedPlatforms([]);
    setSelectedNiche("all");
    setSelectedLocation("all");
    setKeywords("");
    setFollowerRange([1000, 500000]);
    setEngagementRange([0, 15.0]);
    setCampaignObjective("both");
  };

  // Send email to influencer
  const handleContactForRates = (influencer: Influencer) => {
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

    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      influencer.email
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, "_blank");

    setTimeout(() => {
      window.location.href = `mailto:${influencer.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    }, 500);
  };

  const formatFollowerCount = (count: number) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  // Get active filter count
  const getActiveFilterCount = () => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedPlatforms.length > 0) count++;
    if (selectedNiche && selectedNiche !== "all") count++;
    if (selectedLocation && selectedLocation !== "all") count++;
    if (keywords) count++;
    if (followerRange[0] !== 1000 || followerRange[1] !== 500000) count++;
    if (engagementRange[0] !== 0 || engagementRange[1] !== 15.0) count++;
    return count;
  };

  // Select/Deselect all platforms
  const toggleAllPlatforms = () => {
    if (selectedPlatforms.length === platformOptions.length) {
      setSelectedPlatforms([]);
    } else {
      setSelectedPlatforms(platformOptions.map(p => p.value));
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 w-full p-4 md:p-6 space-y-8 overflow-y-auto h-[calc(100vh-theme(spacing.16))]">
          
          {/* Header Section */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              <h1 className="text-3xl md:text-4xl bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text font-bold tracking-tight">
                AI-Powered Influencer Search
              </h1>
              <div className="flex">
                <Badge variant="secondary" className="bg-gradient-primary text-primary-foreground font-medium px-3 py-1 w-fit">
                  AI
                </Badge>
              </div>
            </div>
            <p className="text-base md:text-lg text-muted-foreground">
              Find the perfect influencers for your campaigns across all platforms.
              {totalCount > 0 && ` ${totalCount} influencers available.`}
            </p>
          </div>

          {/* Search Filters Card */}
          <Card className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                  <Filter className="h-5 w-5" />
                  <span>Search Filters</span>
                  {getActiveFilterCount() > 0 && (
                    <Badge variant="secondary" className="ml-2">
                      {getActiveFilterCount()} active
                    </Badge>
                  )}
                </CardTitle>
                {getActiveFilterCount() > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear all
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Campaign Objective */}
              <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h3 className="font-medium text-primary text-sm md:text-base">Campaign Objective (optional):</h3>
                <RadioGroup value={campaignObjective} onValueChange={setCampaignObjective} className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="awareness" id="awareness" />
                    <Label htmlFor="awareness">Boost brand awareness</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sales" id="sales" />
                    <Label htmlFor="sales">Increase sales</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="both" id="both" />
                    <Label htmlFor="both">Increase awareness and sales</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Search Bar */}
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-5 text-muted-foreground z-10" />
                <Input
                  placeholder="Search by name, category, niche, or bio..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-12 min-h-[52px] text-base shadow-lg border bg-background/80 backdrop-blur-sm focus:shadow-xl transition-all duration-300 rounded-xl w-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {/* Platforms */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2 md:mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Smartphone className="h-5 w-5 text-primary" />
                      </div>
                      <label className="text-base font-semibold text-foreground">Platforms</label>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={toggleAllPlatforms}
                      className="h-6 px-2 text-xs"
                    >
                      {selectedPlatforms.length === platformOptions.length ? 'Clear All' : 'Select All'}
                    </Button>
                  </div>
                  <div className="space-y-3 p-4 border rounded-xl bg-background/50 backdrop-blur-sm max-h-64 overflow-y-auto shadow-sm">
                    {platformOptions.map((platform) => (
                      <div key={platform.value} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <Checkbox
                          id={platform.value}
                          checked={selectedPlatforms.includes(platform.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedPlatforms([...selectedPlatforms, platform.value]);
                            } else {
                              setSelectedPlatforms(selectedPlatforms.filter(p => p !== platform.value));
                            }
                          }}
                        />
                        <label htmlFor={platform.value} className="flex items-center space-x-3 cursor-pointer flex-1">
                          <PlatformIcon platform={platform.platform} />
                          <span className="text-sm font-medium">{platform.label}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {selectedPlatforms.length === 0 
                      ? 'All platforms selected' 
                      : `${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''} selected`}
                  </p>
                </div>

                {/* Niche */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2 md:mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <label className="text-base font-semibold text-foreground">Niche</label>
                    </div>
                    {selectedNiche && selectedNiche !== "all" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedNiche("all")}
                        className="h-6 px-2 text-xs"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                    <SelectTrigger className="min-h-[48px] rounded-xl border-0 bg-background/50 backdrop-blur-sm shadow-sm w-full">
                      <SelectValue placeholder="All niches" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-sm z-50 max-h-60 rounded-xl border shadow-lg">
                      {nicheOptions.map((niche) => (
                        <SelectItem key={niche.value} value={niche.value}>
                          {niche.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2 md:mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <MapPin className="h-5 w-5 text-primary" />
                      </div>
                      <label className="text-base font-semibold text-foreground">Location</label>
                    </div>
                    {selectedLocation && selectedLocation !== "all" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLocation("all")}
                        className="h-6 px-2 text-xs"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="min-h-[48px] rounded-xl border-0 bg-background/50 backdrop-blur-sm shadow-sm w-full">
                      <SelectValue placeholder="Any location" />
                    </SelectTrigger>
                    <SelectContent align="end" side="bottom" className="max-h-60 bg-background/95 backdrop-blur-sm z-50 rounded-xl border shadow-lg">
                      <SelectItem value="all">Any location</SelectItem>
                      {mainCountries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                      <div className="border-t my-1"></div>
                      {otherCountries.map((country) => (
                        <SelectItem key={country.value} value={country.value}>
                          {country.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Engagement Range */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-2 md:mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <BarChart3 className="h-5 w-5 text-primary" />
                    </div>
                    <label className="text-base font-semibold text-foreground">Engagement Range</label>
                  </div>
                  <div className="p-4 bg-background/50 backdrop-blur-sm rounded-xl shadow-sm">
                    <Slider
                      value={engagementRange}
                      onValueChange={setEngagementRange}
                      max={15}
                      min={0}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-3">
                      <span>0%</span>
                      <span className="font-medium text-primary">{engagementRange[0]}% - {engagementRange[1]}%</span>
                      <span>15%</span>
                    </div>
                  </div>
                </div>

                {/* Follower Count Range */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-2 md:mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <label className="text-base font-semibold text-foreground">Follower Count Range</label>
                  </div>
                  <div className="p-4 bg-background/50 backdrop-blur-sm rounded-xl shadow-sm">
                    <Slider
                      value={followerRange}
                      onValueChange={setFollowerRange}
                      max={500000}
                      min={1000}
                      step={5000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-3">
                      <span>1K</span>
                      <span className="font-medium text-primary">
                        {formatFollowerCount(followerRange[0])} - {formatFollowerCount(followerRange[1])}
                      </span>
                      <span>500K</span>
                    </div>
                  </div>
                </div>

                {/* Keywords/Tags */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-2 md:mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Hash className="h-5 w-5 text-primary" />
                      </div>
                      <label className="text-base font-semibold text-foreground">Keywords/Tags</label>
                    </div>
                    {keywords && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setKeywords("")}
                        className="h-6 px-2 text-xs"
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                  <Input
                    placeholder="e.g., sustainable, vegan, tech (comma-separated)"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="min-h-[48px] rounded-xl border-0 bg-background/50 backdrop-blur-sm shadow-sm w-full"
                  />
                  {keywords && (
                    <p className="text-xs text-muted-foreground">
                      Searching for: {keywords.split(',').map(k => k.trim()).filter(k => k).join(', ')}
                    </p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <Button
                  className="w-full md:w-auto flex-1 md:flex-none"
                  onClick={handleSearch}
                  disabled={loading}
                >
                  {loading && mode === "search" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4 mr-2" />
                  )}
                  Search Influencers
                </Button>
                <Button
                  variant="outline"
                  className="w-full md:w-auto"
                  onClick={handleViewAll}
                  disabled={loading}
                >
                  {loading && mode === "all" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Users className="h-4 w-4 mr-2" />
                  )}
                  View All Influencers
                </Button>
                <Button
                  variant="secondary"
                  className="w-full md:w-auto"
                  onClick={handleGetRecommendations}
                  disabled={loading}
                >
                  {loading && mode === "recommendations" ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  AI Recommendations
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {showResults && (
            <div className="space-y-4 pb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {mode === "recommendations" ? "AI Recommendations" : "Search Results"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Showing {resultsToShow.length} of {influencers.length} influencers
                    {mode === "search" && getActiveFilterCount() > 0 && 
                      ` (${getActiveFilterCount()} filter${getActiveFilterCount() > 1 ? 's' : ''} applied)`
                    }
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/shortlist">
                      <Plus className="h-4 w-4 mr-2" />
                      View Shortlist ({shortlist.length})
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="grid gap-6">
                {loading ? (
                  <div className="text-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-muted-foreground">Loading influencers...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-destructive">Error: {error}</p>
                    <Button variant="outline" className="mt-4" onClick={handleViewAll}>
                      Try Again
                    </Button>
                  </div>
                ) : resultsToShow.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="max-w-md mx-auto space-y-4">
                      <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                        <Search className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-semibold">No influencers found</h3>
                      <p className="text-muted-foreground">
                        Try adjusting your filters or search criteria to find more results.
                      </p>
                      {getActiveFilterCount() > 0 && (
                        <Button variant="outline" onClick={clearAllFilters}>
                          Clear all filters
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  resultsToShow.map((influencer) => (
                    <Card key={influencer._id} className="shadow-card hover:shadow-elegant transition-shadow duration-300">
                      <CardContent className="p-4 md:p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Profile Info */}
                          <div className="flex items-start space-x-4 min-w-[250px]">
                            <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                              {influencer.name.split(' ').map((n: string) => n[0]).join('')}
                            </div>
                            <div className="space-y-2">
                              <div>
                                <h3 className="text-lg font-semibold">{influencer.name}</h3>
                                {influencer.email && (
                                  <p className="text-sm text-muted-foreground break-all">{influencer.email}</p>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-sm">
                                <div className="flex items-center space-x-1">
                                  <PlatformIcon platform={influencer.platform} />
                                  <span className="capitalize">{influencer.platform}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{influencer.country || 'Location not specified'}</span>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {influencer.categories && influencer.categories.slice(0, 2).map((cat: string, idx: number) => (
                                  <Badge key={idx} variant="secondary">{cat}</Badge>
                                ))}
                                {influencer.niche && influencer.niche.slice(0, 2).map((n: string, idx: number) => (
                                  <Badge key={idx} variant="outline">{n}</Badge>
                                ))}
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
                              <div className="text-lg font-bold text-primary">
                                {influencer.matchScore ? influencer.matchScore + '%' : 'N/A'}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {mode === "recommendations" ? "Rec. Score" : "Match Score"}
                              </div>
                            </div>
                            <div className="text-center">
                              <button
                                onClick={() => handleContactForRates(influencer)}
                                className="text-sm font-bold text-blue-600 hover:text-blue-800 underline"
                              >
                                Contact for rates
                              </button>
                              <div className="text-xs text-muted-foreground">Per Post</div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full lg:w-auto">
                            <Button
                              size="sm"
                              className="w-full"
                              onClick={() =>
                                shortlist.includes(influencer._id)
                                  ? removeFromShortlist(influencer._id)
                                  : addToShortlist(influencer._id)
                              }
                              variant={shortlist.includes(influencer._id) ? "secondary" : "default"}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              {shortlist.includes(influencer._id) ? "In Shortlist" : "Add to Shortlist"}
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => window.open(influencer.profileUrl || '#', "_blank", "noopener,noreferrer")}
                            >
                              View Profile
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Load More */}
              {hasMoreResults && !loading && (
                <div className="text-center pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setDisplayLimit(prev => prev + 20)}
                  >
                    Load More Results ({influencers.length - displayLimit} remaining)
                  </Button>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default SearchInfluencers;
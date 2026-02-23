// pages/SearchInfluencers.tsx
import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AddToCampaignDialog } from "@/components/AddToCampaignDialog";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Users,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ExternalLink,
  Plus,
  Filter,
  Sparkles,
  MapPin,
  ChevronDown,
  ChevronUp,
  X,
  TrendingUp,
  Star,
} from "lucide-react";
import { influencersAPI, Influencer, Platform, SearchFilters, formatNumber } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

// Platform Icon with Link
const PlatformIconLink = ({ platform }: { platform: Platform }) => {
  const getIcon = (name: string) => {
    const iconClass = "h-5 w-5";
    switch (name?.toLowerCase()) {
      case "instagram":
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        );
      case "youtube":
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
          </svg>
        );
      case "tiktok":
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        );
      case "twitter":
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        );
      case "facebook":
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        );
      case "linkedin":
        return (
          <svg viewBox="0 0 24 24" className={iconClass} fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
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

// Match Score Badge
const MatchScoreBadge = ({ score }: { score: number }) => {
  const getColor = () => {
    if (score >= 80) return "bg-green-100 text-green-700 border-green-200";
    if (score >= 60) return "bg-blue-100 text-blue-700 border-blue-200";
    if (score >= 40) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    return "bg-gray-100 text-gray-600 border-gray-200";
  };

  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${getColor()}`}>
      <Star className="h-3 w-3" />
      {score}% match
    </div>
  );
};

// Influencer Card Component
const InfluencerCard = ({
  influencer,
  onAddToShortlist,
  onContact,
}: {
  influencer: Influencer & { matchScore?: number };
  onAddToShortlist: (inf: Influencer) => void;
  onContact: (inf: Influencer) => void;
}) => {
  const primaryKeyword = influencer.keywords?.[0];

  return (
    <Card className="border hover:border-primary/40 hover:shadow-md transition-all">
      <CardContent className="p-5">
        <div className="flex items-center gap-6">
          {/* Avatar + Info */}
          <div className="flex items-center gap-4 min-w-[280px]">
            <Avatar className="h-14 w-14 border-2 border-muted">
              <AvatarImage src={influencer.profileImage} alt={influencer.name} />
              <AvatarFallback className="text-lg font-bold bg-primary/10 text-primary">
                {influencer.name?.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold truncate">{influencer.name}</h3>
                {(influencer as any).matchScore > 0 && (
                  <MatchScoreBadge score={(influencer as any).matchScore} />
                )}
              </div>
              {primaryKeyword && (
                <p className="text-sm text-muted-foreground">
                  {primaryKeyword.displayName || primaryKeyword.name}
                </p>
              )}
              {influencer.location?.country && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3" />
                  {[influencer.location.city, influencer.location.country].filter(Boolean).join(", ")}
                </p>
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
            {/* Platform Icons */}
            {influencer.platforms && influencer.platforms.length > 0 && (
              <div className="flex items-center gap-2">
                {influencer.platforms.map((p, idx) => (
                  <PlatformIconLink key={idx} platform={p} />
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2 min-w-[150px]">
            <Button onClick={() => onAddToShortlist(influencer)}>
              <Plus className="h-4 w-4 mr-2" />
              Add to Shortlist
            </Button>
            <Button variant="outline" onClick={() => onContact(influencer)}>
              Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Follower range presets
const FOLLOWER_PRESETS = [
  { label: "Any", min: undefined, max: undefined },
  { label: "Nano (1K-10K)", min: 1000, max: 10000 },
  { label: "Micro (10K-50K)", min: 10000, max: 50000 },
  { label: "Mid-tier (50K-500K)", min: 50000, max: 500000 },
  { label: "Macro (500K-1M)", min: 500000, max: 1000000 },
  { label: "Mega (1M+)", min: 1000000, max: undefined },
];

export const SearchInfluencers = () => {
  const { toast } = useToast();

  // Data state
  const [influencers, setInfluencers] = useState<(Influencer & { matchScore?: number })[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 20;
  const totalPages = Math.ceil(total / LIMIT);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [niche, setNiche] = useState("");
  const [location, setLocation] = useState("");
  const [keywords, setKeywords] = useState("");
  const [minFollowers, setMinFollowers] = useState<string>("");
  const [maxFollowers, setMaxFollowers] = useState<string>("");
  const [minEngagement, setMinEngagement] = useState<string>("");
  const [maxEngagement, setMaxEngagement] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("followers");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Suggestions
  const [suggestions, setSuggestions] = useState<{ names: string[]; niches: string[]; categories: string[] }>({ names: [], niches: [], categories: [] });
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsTimeout = useRef<ReturnType<typeof setTimeout>>();
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Campaign Dialog
  const [campaignDialogOpen, setCampaignDialogOpen] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<{id: string; name: string} | null>(null);

  // Available platforms for multi-select
  const PLATFORMS = [
    { id: "instagram", label: "Instagram" },
    { id: "youtube", label: "YouTube" },
    { id: "tiktok", label: "TikTok" },
    { id: "twitter", label: "Twitter/X" },
    { id: "facebook", label: "Facebook" },
    { id: "linkedin", label: "LinkedIn" },
    { id: "snapchat", label: "Snapchat" },
    { id: "threads", label: "Threads" },
  ];

  const togglePlatform = (platformId: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(platformId)
        ? prev.filter(p => p !== platformId)
        : [...prev, platformId]
    );
  };

  // Fetch suggestions as user types
  const fetchSuggestions = async (query: string) => {
    if (query.length < 2) {
      setSuggestions({ names: [], niches: [], categories: [] });
      return;
    }
    const result = await influencersAPI.getSearchSuggestions(query);
    if (result.success && result.data) {
      setSuggestions(result.data);
    }
  };

  const handleSearchInputChange = (value: string) => {
    setSearchTerm(value);
    if (suggestionsTimeout.current) clearTimeout(suggestionsTimeout.current);
    suggestionsTimeout.current = setTimeout(() => {
      fetchSuggestions(value);
      setShowSuggestions(true);
    }, 300);
  };

  const applySuggestion = (value: string) => {
    setSearchTerm(value);
    setShowSuggestions(false);
    // Trigger search immediately
    performSearch(value);
  };

  // Core search function using POST /api/influencers/search
  const performSearch = async (overrideSearch?: string, overridePage?: number) => {
    setLoading(true);
    setHasSearched(true);
    setShowSuggestions(false);

    const currentPage = overridePage ?? page;

    const filters: SearchFilters = {
      search: (overrideSearch ?? searchTerm) || undefined,
      platforms: selectedPlatforms.length > 0 ? selectedPlatforms : undefined,
      niche: niche || undefined,
      location: location || undefined,
      keywords: keywords || undefined,
      minFollowers: minFollowers ? parseInt(minFollowers) : undefined,
      maxFollowers: maxFollowers ? parseInt(maxFollowers) : undefined,
      minEngagement: minEngagement ? parseFloat(minEngagement) : undefined,
      maxEngagement: maxEngagement ? parseFloat(maxEngagement) : undefined,
      sortBy,
      sortOrder,
      limit: LIMIT,
      skip: (currentPage - 1) * LIMIT,
    };

    const result = await influencersAPI.search(filters);

    if (result.success && result.data) {
      setInfluencers(result.data);
      setTotal(result.total || result.count || result.data.length);
    } else {
      setInfluencers([]);
      setTotal(0);
    }
    setLoading(false);
  };

  // Handle search form submit
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    performSearch(undefined, 1);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    performSearch(undefined, newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Apply follower preset
  const applyFollowerPreset = (preset: typeof FOLLOWER_PRESETS[0]) => {
    setMinFollowers(preset.min?.toString() || "");
    setMaxFollowers(preset.max?.toString() || "");
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedPlatforms([]);
    setNiche("");
    setLocation("");
    setKeywords("");
    setMinFollowers("");
    setMaxFollowers("");
    setMinEngagement("");
    setMaxEngagement("");
    setSortBy("followers");
    setSortOrder("desc");
    setPage(1);
  };

  // Count active filters
  const activeFilterCount = [
    selectedPlatforms.length > 0,
    niche,
    location,
    keywords,
    minFollowers,
    maxFollowers,
    minEngagement,
    maxEngagement,
  ].filter(Boolean).length;

  // Handlers
  const handleAddToShortlist = (influencer: Influencer) => {
    setSelectedInfluencer({ id: influencer._id, name: influencer.name });
    setCampaignDialogOpen(true);
  };

  const handleContact = (influencer: Influencer) => {
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

  // Load initial results on mount
  useEffect(() => {
    performSearch(undefined, 1);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 w-full p-6 md:p-8 space-y-6 overflow-y-auto">
          {/* AI-Powered Search Bar */}
          <Card className="shadow-lg border-2 border-blue-200 bg-gradient-to-r from-blue-50/50 to-white">
            <CardContent className="p-8">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-bold">AI-Powered Influencer Search</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Describe who you're looking for — e.g. <span className="font-medium text-foreground">"health influencer male"</span>, <span className="font-medium text-foreground">"fashion blogger female India"</span>, <span className="font-medium text-foreground">"tech reviewer with 100K+ followers"</span>
              </p>
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-6 w-6 text-blue-500" />
                  <Input
                    ref={searchInputRef}
                    placeholder="e.g., health influencer male, fitness blogger, beauty guru, food vlogger..."
                    className="pl-14 h-16 text-lg border-2 border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 shadow-lg shadow-blue-100 rounded-xl"
                    value={searchTerm}
                    onChange={(e) => handleSearchInputChange(e.target.value)}
                    onFocus={() => suggestions.names.length > 0 && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  />
                  <Button
                    type="submit"
                    size="lg"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-8 bg-blue-600 hover:bg-blue-700"
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Search
                  </Button>

                  {/* Autocomplete Suggestions */}
                  {showSuggestions && (suggestions.names.length > 0 || suggestions.niches.length > 0 || suggestions.categories.length > 0) && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                      {suggestions.niches.length > 0 && (
                        <div className="px-3 py-2">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Niches</p>
                          {suggestions.niches.map((n, i) => (
                            <button
                              key={i}
                              type="button"
                              className="block w-full text-left px-2 py-1.5 text-sm hover:bg-blue-50 rounded transition-colors"
                              onMouseDown={() => applySuggestion(n)}
                            >
                              <Sparkles className="h-3 w-3 inline mr-2 text-blue-500" />
                              {n}
                            </button>
                          ))}
                        </div>
                      )}
                      {suggestions.categories.length > 0 && (
                        <div className="px-3 py-2 border-t">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Categories</p>
                          {suggestions.categories.map((c, i) => (
                            <button
                              key={i}
                              type="button"
                              className="block w-full text-left px-2 py-1.5 text-sm hover:bg-blue-50 rounded transition-colors"
                              onMouseDown={() => applySuggestion(c)}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      )}
                      {suggestions.names.length > 0 && (
                        <div className="px-3 py-2 border-t">
                          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Influencers</p>
                          {suggestions.names.map((name, i) => (
                            <button
                              key={i}
                              type="button"
                              className="block w-full text-left px-2 py-1.5 text-sm hover:bg-blue-50 rounded transition-colors"
                              onMouseDown={() => applySuggestion(name)}
                            >
                              {name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Filters Card */}
          <Card className="shadow-sm">
            <CardContent className="p-6">
              {/* Header with toggle */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold">Filters</h2>
                  {activeFilterCount > 0 && (
                    <Badge className="bg-blue-100 text-blue-700">{activeFilterCount} active</Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                >
                  {showAdvancedFilters ? "Hide" : "Show"} Advanced Filters
                  {showAdvancedFilters ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                </Button>
              </div>

              {/* Basic Filters - Always Visible */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {/* Niche/Category */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-purple-100 flex items-center justify-center">
                      <Sparkles className="h-3.5 w-3.5 text-purple-600" />
                    </div>
                    Niche / Category
                  </Label>
                  <Input
                    placeholder="e.g., fitness, tech, beauty, gaming..."
                    className="h-10"
                    value={niche}
                    onChange={(e) => setNiche(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                  />
                </div>

                {/* Location */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-green-100 flex items-center justify-center">
                      <MapPin className="h-3.5 w-3.5 text-green-600" />
                    </div>
                    Location
                  </Label>
                  <Input
                    placeholder="e.g., USA, India, London..."
                    className="h-10"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                  />
                </div>

                {/* Keywords */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <div className="w-7 h-7 rounded bg-orange-100 flex items-center justify-center">
                      <Search className="h-3.5 w-3.5 text-orange-600" />
                    </div>
                    Keywords
                  </Label>
                  <Input
                    placeholder="e.g., vegan, sustainable, luxury..."
                    className="h-10"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                  />
                </div>
              </div>

              {/* Platform Multi-Select */}
              <div className="mb-6">
                <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded bg-blue-100 flex items-center justify-center">
                    <svg className="h-3.5 w-3.5 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                      <line x1="12" y1="18" x2="12" y2="18"/>
                    </svg>
                  </div>
                  Platforms
                  {selectedPlatforms.length > 0 && (
                    <Badge variant="secondary" className="ml-1">
                      {selectedPlatforms.length} selected
                    </Badge>
                  )}
                </Label>
                <div className="flex flex-wrap gap-4">
                  {PLATFORMS.map((p) => (
                    <div key={p.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`platform-${p.id}`}
                        checked={selectedPlatforms.includes(p.id)}
                        onCheckedChange={() => togglePlatform(p.id)}
                      />
                      <label
                        htmlFor={`platform-${p.id}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {p.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Filters - Collapsible */}
              {showAdvancedFilters && (
                <div className="border-t pt-6 mb-6 space-y-6">
                  {/* Follower Range */}
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded bg-indigo-100 flex items-center justify-center">
                        <Users className="h-3.5 w-3.5 text-indigo-600" />
                      </div>
                      Follower Count
                    </Label>
                    {/* Quick presets */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {FOLLOWER_PRESETS.map((preset) => {
                        const isActive =
                          (preset.min?.toString() || "") === minFollowers &&
                          (preset.max?.toString() || "") === maxFollowers;
                        return (
                          <Button
                            key={preset.label}
                            type="button"
                            variant={isActive ? "default" : "outline"}
                            size="sm"
                            className="h-8 text-xs"
                            onClick={() => applyFollowerPreset(preset)}
                          >
                            {preset.label}
                          </Button>
                        );
                      })}
                    </div>
                    {/* Custom range */}
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        placeholder="Min followers"
                        className="h-9 w-40"
                        value={minFollowers}
                        onChange={(e) => setMinFollowers(e.target.value)}
                      />
                      <span className="text-muted-foreground text-sm">to</span>
                      <Input
                        type="number"
                        placeholder="Max followers"
                        className="h-9 w-40"
                        value={maxFollowers}
                        onChange={(e) => setMaxFollowers(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Engagement Range */}
                  <div>
                    <Label className="text-sm font-medium flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded bg-emerald-100 flex items-center justify-center">
                        <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                      </div>
                      Engagement Rate (%)
                    </Label>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Min %"
                        className="h-9 w-40"
                        value={minEngagement}
                        onChange={(e) => setMinEngagement(e.target.value)}
                      />
                      <span className="text-muted-foreground text-sm">to</span>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="Max %"
                        className="h-9 w-40"
                        value={maxEngagement}
                        onChange={(e) => setMaxEngagement(e.target.value)}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1.5">
                      Tip: 1-3% is average, 3-6% is good, 6%+ is excellent
                    </p>
                  </div>

                  {/* Sort */}
                  <div className="flex items-center gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Sort By</Label>
                      <Select value={sortBy} onValueChange={(v) => setSortBy(v)}>
                        <SelectTrigger className="w-44 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="followers">Followers</SelectItem>
                          <SelectItem value="engagement">Engagement</SelectItem>
                          <SelectItem value="rating">Rating</SelectItem>
                          <SelectItem value="totalCollaborations">Collaborations</SelectItem>
                          <SelectItem value="createdAt">Newest</SelectItem>
                          <SelectItem value="name">Name</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Order</Label>
                      <Select value={sortOrder} onValueChange={(v: "asc" | "desc") => setSortOrder(v)}>
                        <SelectTrigger className="w-36 h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="desc">High to Low</SelectItem>
                          <SelectItem value="asc">Low to High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4 mr-2" />
                  Apply Filters
                </Button>
                <Button
                  variant="outline"
                  onClick={() => { clearAllFilters(); performSearch("", 1); }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  View All
                </Button>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    onClick={clearAllFilters}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                {hasSearched ? "Search Results" : "All Influencers"}
              </h2>
              <p className="text-sm text-muted-foreground">
                Showing {influencers.length} of {total} influencers
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : influencers.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="py-16 text-center">
                  <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <p className="text-lg font-medium">No influencers found</p>
                  <p className="text-muted-foreground">Try different search terms or adjust your filters</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {influencers.map((influencer) => (
                  <InfluencerCard
                    key={influencer._id}
                    influencer={influencer}
                    onAddToShortlist={handleAddToShortlist}
                    onContact={handleContact}
                  />
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between border-t pt-6 mt-6">
                    <p className="text-sm text-muted-foreground">
                      Page {page} of {totalPages} ({total} results)
                    </p>
                    <div className="flex gap-2">
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
              </div>
            )}
          </div>
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
            toast({
              title: "Success!",
              description: `Added to "${campaignName}"`,
            });
          }}
        />
      )}
    </div>
  );
};

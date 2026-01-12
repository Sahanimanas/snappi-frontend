import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { useInfluencers } from "@/hooks/useInfluencers";
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
  Hash
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

// Local storage key for shortlist
const SHORTLIST_KEY = 'snappi_shortlist';

export const SearchInfluencers = () => {
  const { influencers, loading, error, canAccessContactInfo } = useInfluencers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedNiche, setSelectedNiche] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [campaignObjective, setCampaignObjective] = useState("");
  const [keywords, setKeywords] = useState("");
  const [followerRange, setFollowerRange] = useState([5000, 50000]);
  const [engagementRange, setEngagementRange] = useState([4.0, 10.0]);

  const [showResults, setShowResults] = useState(false);
  const [shortlist, setShortlist] = useState<string[]>([]);

  const [mode, setMode] = useState<"none" | "all" | "filtered">("none");
  
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

  // Filter influencers based on search criteria
  const filteredInfluencers = influencers.filter(influencer => {
    const matchesQuery = !searchQuery ||
      influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (influencer.categories && influencer.categories.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPlatform = selectedPlatforms.length === 0 ||
      (influencer.platform && selectedPlatforms.includes(influencer.platform.toLowerCase()));

    const matchesLocation = !selectedLocation ||
      (influencer.location && influencer.location.toLowerCase().includes(selectedLocation));

    const matchesFollowerRange = !influencer.follower_count ||
      (influencer.follower_count >= followerRange[0] && influencer.follower_count <= followerRange[1]);

    const matchesEngagementRange =
      (influencer.engagement_rate >= engagementRange[0] && influencer.engagement_rate <= engagementRange[1]);

    return matchesQuery && matchesPlatform && matchesLocation && matchesFollowerRange && matchesEngagementRange;
  });

  const resultsToShow = mode === "all" ? influencers : filteredInfluencers;

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

  // send email to influencer on click contact for rates
  const handleContactForRates = (influencer: any) => {
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
            <p className="text-base md:text-lg text-muted-foreground">Find the perfect micro influencers for your campaigns across all platforms.</p>
          </div>

          {/* Search Filters Card */}
          <Card className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-lg md:text-xl">
                <Filter className="h-5 w-5" />
                <span>Search Filters</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Campaign Objective */}
              {!showResults && (
                <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h3 className="font-medium text-primary text-sm md:text-base">First, tell us about your campaign objective:</h3>
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
              )}

              {/* Search Bar */}
              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
                <Input
                  placeholder="Fashion micro-influencer in New York City"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 min-h-[52px] text-base shadow-lg border-0 bg-background/80 backdrop-blur-sm focus:shadow-xl transition-all duration-300 rounded-xl w-full"
                />
              </div>

              {/* Filter Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                {/* Platforms */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-2 md:mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Smartphone className="h-5 w-5 text-primary" />
                    </div>
                    <label className="text-base font-semibold text-foreground">Platforms</label>
                  </div>
                  <div className="space-y-3 p-4 border rounded-xl bg-background/50 backdrop-blur-sm max-h-64 overflow-y-auto shadow-sm">
                    {[
                      { value: "instagram", label: "Instagram", platform: "instagram" },
                      { value: "tiktok", label: "TikTok", platform: "tiktok" },
                      { value: "youtube", label: "YouTube", platform: "youtube" },
                      { value: "facebook", label: "Facebook", platform: "facebook" },
                      { value: "x", label: "X (Twitter)", platform: "twitter" },
                      { value: "threads", label: "Threads", platform: "threads" },
                      { value: "twitch", label: "Twitch", platform: "twitch" },
                      { value: "pinterest", label: "Pinterest", platform: "pinterest" }
                    ].map((platform) => (
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
                </div>

                {/* Niche */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-2 md:mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <label className="text-base font-semibold text-foreground">Niche</label>
                  </div>
                  <Select value={selectedNiche} onValueChange={setSelectedNiche}>
                    <SelectTrigger className="min-h-[48px] rounded-xl border-0 bg-background/50 backdrop-blur-sm shadow-sm w-full">
                      <SelectValue placeholder="All niches" />
                    </SelectTrigger>
                    <SelectContent className="bg-background/95 backdrop-blur-sm z-50 max-h-60 rounded-xl border shadow-lg">
                      <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="wellness">Health & Wellness</SelectItem>
                      <SelectItem value="food">Food & Drink</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="parenting">Parenting</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="finance">Finance</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-2 md:mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <label className="text-base font-semibold text-foreground">Location</label>
                  </div>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="min-h-[48px] rounded-xl border-0 bg-background/50 backdrop-blur-sm shadow-sm w-full">
                      <SelectValue placeholder="Any location" />
                    </SelectTrigger>
                    <SelectContent align="end" side="bottom" className="max-h-60 bg-background/95 backdrop-blur-sm z-50 rounded-xl border shadow-lg">
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
                      min={1}
                      step={0.5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-3">
                      <span>1%</span>
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
                      max={100000}
                      min={1000}
                      step={1000}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-3">
                      <span>1K</span>
                      <span className="font-medium text-primary">{(followerRange[0] / 1000).toFixed(0)}K - {(followerRange[1] / 1000).toFixed(0)}K</span>
                      <span>100K</span>
                    </div>
                  </div>
                </div>

                {/* Keywords/Tags */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-2 md:mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Hash className="h-5 w-5 text-primary" />
                    </div>
                    <label className="text-base font-semibold text-foreground">Keywords/Tags</label>
                  </div>
                  <Input
                    placeholder="e.g., sustainable, vegan, tech reviews, makeup tutorials"
                    value={keywords}
                    onChange={(e) => setKeywords(e.target.value)}
                    className="min-h-[48px] rounded-xl border-0 bg-background/50 backdrop-blur-sm shadow-sm w-full"
                  />
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 pt-4">
                <Button
                  className="w-full md:w-auto flex-1 md:flex-none"
                  onClick={() => {
                    setMode("filtered");
                    setShowResults(true);
                  }}
                  disabled={!campaignObjective}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search Influencers
                </Button>
                <Button
                  variant="outline"
                  className="w-full md:w-auto"
                  onClick={() => {
                    setMode("all");
                    setShowResults(true);
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  View All Influencers
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {showResults && (
            <div className="space-y-4 pb-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-xl font-semibold">Search Results</h2>
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
                    <p className="text-muted-foreground">Loading influencers...</p>
                  </div>
                ) : error ? (
                  <div className="text-center py-8">
                    <p className="text-destructive">Error: {error}</p>
                  </div>
                ) : resultsToShow.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No influencers found matching your criteria.</p>
                  </div>
                ) : (
                  resultsToShow.map((influencer) => (
                    <Card key={influencer.id} className="shadow-card hover:shadow-elegant transition-shadow duration-300">
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
                                {canAccessContactInfo(influencer.id) && influencer.email && (
                                  <p className="text-sm text-muted-foreground break-all">{influencer.email}</p>
                                )}
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-sm">
                                <div className="flex items-center space-x-1">
                                  <PlatformIcon platform={influencer.platform || 'instagram'} />
                                  <span>{influencer.platform || 'Unknown'}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{influencer.location || 'Location not specified'}</span>
                                </div>
                              </div>
                              <Badge variant="secondary">{influencer.categories || 'General'}</Badge>
                            </div>
                          </div>

                          {/* Stats */}
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
                              <div className="text-lg font-bold text-primary">
                                {influencer.match_score ? influencer.match_score + '%' : 'N/A'}
                              </div>
                              <div className="text-xs text-muted-foreground">Match Score</div>
                            </div>
                            <div className="text-center">
                                <button
                                  onClick={() => handleContactForRates(influencer)}
                                  className="text-lg font-bold text-blue-600  hover:text-blue-800"
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
                                shortlist.includes(influencer.id)
                                  ? removeFromShortlist(influencer.id)
                                  : addToShortlist(influencer.id)
                              }
                              variant={shortlist.includes(influencer.id) ? "secondary" : "default"}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              {shortlist.includes(influencer.id) ? "In Shortlist" : "Add to Shortlist"}
                            </Button>

                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => window.open(influencer.platform_link || '#', "_blank", "noopener,noreferrer")}
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
              <div className="text-center pt-4">
                <Button variant="outline" onClick={() => {
                  console.log('Loading more influencer results...');
                }}>
                  Load More Results
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
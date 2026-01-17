import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Search, Menu, Bell, User, LogOut, Loader2, Users, Megaphone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { influencersAPI, campaignsAPI, Influencer, Campaign, formatNumber } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  isLandingPage?: boolean;
}

export const Header = ({ isLandingPage = false }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [influencerResults, setInfluencerResults] = useState<Influencer[]>([]);
  const [campaignResults, setCampaignResults] = useState<Campaign[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (!searchTerm.trim()) {
      setInfluencerResults([]);
      setCampaignResults([]);
      setShowResults(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      setShowResults(true);

      try {
        // Search influencers and campaigns in parallel
        const [influencerRes, campaignRes] = await Promise.all([
          influencersAPI.getAll({ search: searchTerm, limit: 5 }),
          campaignsAPI.getAll({ search: searchTerm, limit: 5 }),
        ]);

        if (influencerRes.success) {
          setInfluencerResults(Array.isArray(influencerRes.data) ? influencerRes.data : []);
        }
        if (campaignRes.success) {
          setCampaignResults(Array.isArray(campaignRes.data) ? campaignRes.data : []);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchTerm]);

  const handleResultClick = (type: 'influencer' | 'campaign', id: string) => {
    setShowResults(false);
    setSearchTerm("");
    if (type === 'influencer') {
      navigate(`/influencers/${id}`);
    } else {
      navigate(`/campaigns/${id}`);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowResults(false);
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const hasResults = influencerResults.length > 0 || campaignResults.length > 0;

  if (isLandingPage) {
    return (
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo textSize="xl" iconSize={20} />
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="/pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </Link>
            <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
              About
            </Link>
            <Link to="/faq" className="text-sm font-medium hover:text-primary transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/signin">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container flex h-16 items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <Link to="/dashboard" className="flex items-center">
            <Logo textSize="md" iconSize={18} className="md:flex hidden" />
            <Logo showIcon={true} textSize="md" iconSize={18} className="md:hidden flex" />
          </Link>
        </div>

        {/* Search bar with dropdown */}
        <div className="flex-1 max-w-xl mx-4 relative" ref={searchRef}>
          <form onSubmit={handleSearchSubmit}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search influencers, campaigns..."
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => searchTerm.trim() && setShowResults(true)}
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </form>

          {/* Search Results Dropdown */}
          {showResults && searchTerm.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border rounded-md shadow-lg z-50 max-h-[400px] overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                  Searching...
                </div>
              ) : !hasResults ? (
                <div className="p-4 text-center text-muted-foreground">
                  No results found for "{searchTerm}"
                </div>
              ) : (
                <>
                  {/* Influencer Results */}
                  {influencerResults.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/50 flex items-center gap-2">
                        <Users className="h-3 w-3" />
                        Influencers
                      </div>
                      {influencerResults.map((influencer) => (
                        <button
                          key={influencer._id}
                          className="w-full px-3 py-2 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
                          onClick={() => handleResultClick('influencer', influencer._id)}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={influencer.profileImage} alt={influencer.name} />
                            <AvatarFallback className="text-xs">
                              {influencer.name?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{influencer.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatNumber(influencer.totalFollowers || 0)} followers • {(influencer.avgEngagement || 0).toFixed(1)}% engagement
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Campaign Results */}
                  {campaignResults.length > 0 && (
                    <div>
                      <div className="px-3 py-2 text-xs font-semibold text-muted-foreground bg-muted/50 flex items-center gap-2">
                        <Megaphone className="h-3 w-3" />
                        Campaigns
                      </div>
                      {campaignResults.map((campaign) => (
                        <button
                          key={campaign._id}
                          className="w-full px-3 py-2 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
                          onClick={() => handleResultClick('campaign', campaign._id)}
                        >
                          <div className="h-8 w-8 rounded ">
                            <p className="text-primary text-sm font-semibold">{campaign.name.toUpperCase()}</p>
                          </div>
                          {/* <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{campaign.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {campaign.status} • ${formatNumber(campaign.budget || 0)} budget
                            </p>
                          </div> */}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* View All Results */}
                  <button
                    className="w-full px-3 py-2 text-sm text-primary hover:bg-muted/50 transition-colors border-t"
                    onClick={() => {
                      setShowResults(false);
                      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
                    }}
                  >
                    View all results for "{searchTerm}"
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>

          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              title="Logout"
              className="hover:text-red-600"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { Search, Menu, Bell, User, LogOut, Loader2, Users, Megaphone } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useSidebar } from "@/context/SidebarContext";
import { influencersAPI, campaignsAPI, Influencer, Campaign, formatNumber } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  isLandingPage?: boolean;
}

export const Header = ({ isLandingPage = false }: HeaderProps) => {
  const { user, signOut } = useAuth();
  const { toggle: toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  const location = useLocation();
  
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
        <div className="w-full px-4 md:px-6 flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center">
            <Logo textSize="xl" iconSize={20} />
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {[
              { to: "/features", label: "Features" },
              { to: "/pricing", label: "Pricing" },
              { to: "/about", label: "About" },
              { to: "/faq", label: "FAQ" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? "text-primary border-b-2 border-primary pb-0.5"
                    : "hover:text-primary"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            {user ? (
              <>
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  Hi, {user.name?.split(" ")[0] || "there"}
                </span>
                <Button size="sm" asChild>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/signin">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/signup">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="w-full px-4 md:px-6 flex h-16 items-center justify-between">
        {/* Left section */}
        <div className="flex items-center space-x-4">
          <Button type="button" variant="ghost" size="icon" className="md:hidden" onClick={toggleSidebar} title="Open menu">
            <Menu className="h-5 w-5" />
          </Button>

          <Link to="/dashboard" className="flex items-center">
            <Logo textSize="md" iconSize={18} className="md:flex hidden" />
            <Logo showIcon={true} textSize="md" iconSize={18} className="md:hidden flex" />
          </Link>
        </div>

        {/* Right section */}
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" onClick={() => navigate('/settings')} title="Settings">
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
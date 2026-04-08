import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calendar,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  PlusCircle,
  TrendingUp,
  Target,
  Puzzle,
  Gift,
  FileText
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useSidebar } from "@/context/SidebarContext";

const navigationItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: BarChart3,
    badge: null,
  },
  {
    title: "Search Influencers",
    href: "/search",
    icon: Search,
    badge: "AI",
  },
  {
    title: "Campaigns",
    href: "/campaigns",
    icon: Target,
    badge: null,
  },
  {
    title: "Analytics",
    href: "/analytics",
    icon: TrendingUp,
    badge: null,
  },
  {
    title: "Influencers",
    href: "/influencers",
    icon: Users,
    badge: null,
  },
  {
    title: "Performance Tracking",
    href: "/tracking",
    icon: Calendar,
    badge: "New",
  },
  {
    title: "Contracts",
    href: "/contracts",
    icon: FileText,
    badge: null,
  },
];

const secondaryItems = [
  // {
  //   title: "Integrations",
  //   href: "/integrations",
  //   icon: Puzzle,
  // },
  {
    title: "Refer and Earn",
    href: "/refer",
    icon: Gift,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
  {
    title: "Help Center",
    href: "/help",
    icon: HelpCircle,
  },
];

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const location = useLocation();
  return (
    <div className="flex h-full w-full flex-col bg-background">
      <div className="p-4 md:p-6 border-b">
        <Button className="w-full" size="lg" asChild onClick={onNavigate}>
          <Link to="/create-campaign">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <div className="flex items-center space-x-3">
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Link>
            );
          })}
        </div>

        <div className="pt-4 mt-4 border-t space-y-1">
          {secondaryItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                  isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      <div className="p-4 border-t">
        <div className="rounded-lg bg-primary-light p-4">
          <h4 className="text-sm font-medium text-primary mb-2">Upgrade to Pro</h4>
          <p className="text-xs text-muted-foreground mb-3">
            Unlock unlimited searches and advanced analytics
          </p>
          <Button size="sm" className="w-full" asChild onClick={onNavigate}>
            <Link to="/pricing">Upgrade Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const { open, setOpen } = useSidebar();
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex h-full w-64 flex-col border-r bg-background shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 w-72 max-w-[85vw]">
          <SidebarContent onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
};
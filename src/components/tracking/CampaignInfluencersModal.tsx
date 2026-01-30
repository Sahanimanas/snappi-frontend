// components/tracking/CampaignInfluencersModal.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { useToast } from "@/hooks/use-toast";
import { trackingLinkAPI, TrackingLink } from "@/lib/trackingLinkApi";
import { Campaign } from "@/lib/api";
import { InfluencerPostsModal } from "./InfluencerPostsModal";
import {
  Link as LinkIcon,
  Copy,
  ExternalLink,
  Search,
  Users,
  Loader2,
  FileText,
  CheckCircle2,
  Clock,
  Trash2,
} from "lucide-react";

interface CampaignInfluencersModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaign: Campaign | null;
}

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, { variant: any; icon: any; label: string }> = {
    active: { variant: "default", icon: CheckCircle2, label: "Active" },
    paused: { variant: "outline", icon: Clock, label: "Paused" },
    expired: { variant: "destructive", icon: Clock, label: "Expired" },
    completed: { variant: "secondary", icon: CheckCircle2, label: "Completed" },
  };

  const config = statusConfig[status] || statusConfig.active;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
};

export const CampaignInfluencersModal = ({
  isOpen,
  onClose,
  campaign,
}: CampaignInfluencersModalProps) => {
  const [loading, setLoading] = useState(true);
  const [trackingLinks, setTrackingLinks] = useState<TrackingLink[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [generatingLink, setGeneratingLink] = useState<string | null>(null);
  const [selectedTrackingLink, setSelectedTrackingLink] = useState<TrackingLink | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && campaign) {
      fetchTrackingLinks();
    }
  }, [isOpen, campaign]);

  const fetchTrackingLinks = async () => {
    if (!campaign) return;
    
    setLoading(true);
    const result = await trackingLinkAPI.getByCampaign(campaign._id);
    
    if (result.success) {
      setTrackingLinks(result.data || []);
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to load tracking links",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleGenerateLink = async (influencerId: string) => {
    if (!campaign) return;
    
    setGeneratingLink(influencerId);
    const result = await trackingLinkAPI.generate(campaign._id, influencerId);
    
    if (result.success) {
      // Add or update the tracking link in the list
      const newLink = result.data;
      setTrackingLinks(prev => {
        const existingIndex = prev.findIndex(
          tl => tl.influencer._id === influencerId
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = newLink;
          return updated;
        }
        return [newLink, ...prev];
      });
      
      // Copy to clipboard
      navigator.clipboard.writeText(newLink.trackingUrl);
      toast({
        title: "Link Generated!",
        description: "Tracking link copied to clipboard",
      });
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to generate link",
        variant: "destructive",
      });
    }
    setGeneratingLink(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Tracking link copied to clipboard",
    });
  };

  const handleDeleteLink = async (trackingLinkId: string) => {
    if (!confirm("Are you sure you want to delete this tracking link?")) return;

    const result = await trackingLinkAPI.delete(trackingLinkId);
    
    if (result.success) {
      setTrackingLinks(prev => prev.filter(tl => tl._id !== trackingLinkId));
      toast({
        title: "Deleted",
        description: "Tracking link removed",
      });
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to delete",
        variant: "destructive",
      });
    }
  };

  const filteredLinks = trackingLinks.filter(tl =>
    tl.influencer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tl.influencer.platforms?.some(p => 
      p.username?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const getTotalFollowers = (platforms: TrackingLink['influencer']['platforms']) => {
    if (!platforms) return 0;
    return platforms.reduce((sum, p) => sum + (p.followers || 0), 0);
  };

  const getAvgEngagement = (platforms: TrackingLink['influencer']['platforms']) => {
    if (!platforms || platforms.length === 0) return 0;
    const total = platforms.reduce((sum, p) => sum + (p.engagement || 0), 0);
    return (total / platforms.length).toFixed(1);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {campaign?.name}
              <Badge variant="outline" className="ml-3 capitalize">
                {campaign?.status}
              </Badge>
            </DialogTitle>
          </DialogHeader>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search influencers..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-4 gap-3 p-3 bg-muted/30 rounded-lg">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Links</p>
              <p className="text-lg font-bold">{trackingLinks.length}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Posts</p>
              <p className="text-lg font-bold text-primary">
                {trackingLinks.reduce((sum, tl) => sum + (tl.submittedPosts?.length || 0), 0)}
              </p>
            </div>
            {/* <div className="text-center">
              <p className="text-xs text-muted-foreground">Total Clicks</p>
              <p className="text-lg font-bold text-green-600">
                {formatNumber(trackingLinks.reduce((sum, tl) => sum + (tl.clickStats?.totalClicks || 0), 0))}
              </p>
            </div> */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">Pending Review</p>
              <p className="text-lg font-bold text-yellow-600">
                {trackingLinks.reduce((sum, tl) => 
                  sum + (tl.submittedPosts?.filter(p => p.status === 'pending').length || 0), 0
                )}
              </p>
            </div>
          </div>

          {/* Tracking Links List */}
          <div className="space-y-3 mt-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredLinks.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
                <p>No tracking links found</p>
                {searchQuery && (
                  <Button variant="link" onClick={() => setSearchQuery("")}>
                    Clear search
                  </Button>
                )}
              </div>
            ) : (
              filteredLinks.map((trackingLink) => (
                <div
                  key={trackingLink._id}
                  className="border rounded-lg p-4 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    {/* Left: Influencer Info */}
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground font-bold text-sm shrink-0">
                        {trackingLink.influencer.profileImage ? (
                          <img
                            src={trackingLink.influencer.profileImage}
                            alt={trackingLink.influencer.name}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          trackingLink.influencer.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold truncate">
                            {trackingLink.influencer.name}
                          </h4>
                          {getStatusBadge(trackingLink.status)}
                        </div>
                        <div className="flex items-center gap-3 mt-1">
                          <div className="flex items-center gap-1">
                            {trackingLink.influencer.platforms?.slice(0, 3).map((p) => (
                              <PlatformIcon
                                key={p.platform}
                                platform={p.platform}
                                className="h-3.5 w-3.5 opacity-70"
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatNumber(getTotalFollowers(trackingLink.influencer.platforms))} followers
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {getAvgEngagement(trackingLink.influencer.platforms)}% eng.
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Center: Stats */}
                    <div className="hidden md:flex items-center gap-6 shrink-0">
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Posts</p>
                        <p className="font-semibold">
                          {trackingLink.submittedPosts?.length || 0}
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-muted-foreground">Clicks</p>
                        <p className="font-semibold">
                          {formatNumber(trackingLink.clickStats?.totalClicks || 0)}
                        </p>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(trackingLink.trackingUrl)}
                      >
                        <Copy className="h-4 w-4 mr-1.5" />
                        Copy Link
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(trackingLink.trackingUrl, "_blank")}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setSelectedTrackingLink(trackingLink)}
                      >
                        <FileText className="h-4 w-4 mr-1.5" />
                        View Posts
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteLink(trackingLink._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Tracking Link Display */}
                  <div className="mt-3 p-2.5 bg-muted/40 rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Tracking Link:
                        </p>
                        <p className="text-sm font-mono text-primary truncate max-w-md">
                          {trackingLink.trackingUrl}
                        </p>
                      </div>
                      <code className="text-xs bg-muted px-2 py-1 rounded">
                        {trackingLink.trackingCode}
                      </code>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Influencer Posts Modal */}
      {selectedTrackingLink && campaign && (
        <InfluencerPostsModal
          isOpen={!!selectedTrackingLink}
          onClose={() => setSelectedTrackingLink(null)}
          trackingLink={selectedTrackingLink}
          onPostUpdated={fetchTrackingLinks}
        />
      )}
    </>
  );
};

export default CampaignInfluencersModal;
// components/tracking/InfluencerPostsModal.tsx
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PlatformIcon } from "@/components/ui/platform-icon";
import { useToast } from "@/hooks/use-toast";
import { trackingLinkAPI, TrackingLink, SubmittedPost } from "@/lib/trackingLinkApi";
import {
  ExternalLink,
  Check,
  X,
  Trash2,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  MousePointerClick,
  Clock,
  Loader2,
  Copy,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Enums } from "@/integrations/supabase/types";

interface InfluencerPostsModalProps {
  isOpen: boolean;
  onClose: () => void;
  trackingLink: TrackingLink;
  onPostUpdated?: () => void;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-500/10 text-green-600 border-green-200">Approved</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    case "pending":
    default:
      return <Badge variant="outline" className="text-yellow-600 border-yellow-300">Pending</Badge>;
  }
};

const getPlatformColor = (platform: string) => {
  const colors: Record<string, string> = {
    instagram: "bg-gradient-to-br from-purple-500 to-pink-500",
    youtube: "bg-red-500",
    tiktok: "bg-black",
    twitter: "bg-blue-400",
    facebook: "bg-blue-600",
    linkedin: "bg-blue-700",
    pinterest: "bg-red-600",
    other: "bg-gray-500",
  };
  return colors[platform] || colors.other;
};

export const InfluencerPostsModal = ({
  isOpen,
  onClose,
  trackingLink,
  onPostUpdated,
}: InfluencerPostsModalProps) => {
  const [posts, setPosts] = useState<SubmittedPost[]>(trackingLink.submittedPosts || []);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleUpdateStatus = async (postId: string, status: any) => {
    setActionLoading(postId);
    const result = await trackingLinkAPI.updatePostStatus(trackingLink._id, postId, status);
    
    if (result.success) {
      setPosts(prev =>
        prev.map(p => (p._id === postId ? { ...p, status: status } : p))
      );
      toast({
        title: "Success",
        description: `Post ${status}`,
      });
      onPostUpdated?.();
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to update status",
        variant: "destructive",
      });
    }
    setActionLoading(null);
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    
    setActionLoading(postId);
    const result = await trackingLinkAPI.deletePost(trackingLink._id, postId);
    
    if (result.success) {
      setPosts(prev => prev.filter(p => p._id !== postId));
      toast({
        title: "Deleted",
        description: "Post removed successfully",
      });
      onPostUpdated?.();
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to delete post",
        variant: "destructive",
      });
    }
    setActionLoading(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  const formatMetric = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-lg">Posts by {trackingLink.influencer.name}</span>
            <span className="text-muted-foreground font-normal text-sm">
              in {trackingLink.campaign.name}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Tracking Link Info */}
        <div className="p-3 bg-muted/30 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">Tracking Link</p>
              <p className="text-sm font-mono text-primary">{trackingLink.trackingUrl}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => copyToClipboard(trackingLink.trackingUrl)}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy
            </Button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3 p-4 bg-muted/30 rounded-lg">
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Total Posts</p>
            <p className="text-xl font-bold">{posts.length}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Approved</p>
            <p className="text-xl font-bold text-green-600">
              {posts.filter(p => p.status === "approved").length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-xl font-bold text-yellow-600">
              {posts.filter(p => p.status === "pending").length}
            </p>
          </div>
          {/* <div className="text-center">
            <p className="text-xs text-muted-foreground">Total Clicks</p>
            <p className="text-xl font-bold">
              {formatMetric(trackingLink.clickStats?.totalClicks || 0)}
            </p>
          </div> */}
        </div>

        {/* Posts List */}
        <div className="space-y-4 mt-4">
          {posts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Eye className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No posts submitted yet</p>
              <p className="text-sm mt-1">
                Posts will appear here when the influencer submits them via the tracking link
              </p>
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post._id}
                className="border rounded-lg p-4 hover:border-primary/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left: Platform & Post Info */}
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${getPlatformColor(
                        post.platform
                      )}`}
                    >
                      <PlatformIcon platform={post.platform} className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium capitalize">{post.platform}</span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {post.postType}
                        </Badge>
                        {getStatusBadge(post.status)}
                      </div>
                      <a
                        href={post.postUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline truncate block"
                      >
                        {post.postUrl}
                      </a>
                      {post.caption && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {post.caption}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>
                          Submitted {formatDistanceToNow(new Date(post.submittedAt))} ago
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(post.postUrl, "_blank")}
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                    {post.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-600 hover:bg-green-50"
                          onClick={() => handleUpdateStatus(post._id, "approved")}
                          disabled={actionLoading === post._id}
                        >
                          {actionLoading === post._id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleUpdateStatus(post._id, "rejected")}
                          disabled={actionLoading === post._id}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeletePost(post._id)}
                      disabled={actionLoading === post._id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Metrics */}
                {post.status === "approved" && (
                  <div className="flex items-center gap-6 mt-4 pt-4 border-t">
                    <div className="flex items-center gap-1.5 text-sm">
                      <Eye className="h-4 w-4 text-muted-foreground" />
                      <span>{formatMetric(post.metrics.views)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Heart className="h-4 w-4 text-muted-foreground" />
                      <span>{formatMetric(post.metrics.likes)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <MessageCircle className="h-4 w-4 text-muted-foreground" />
                      <span>{formatMetric(post.metrics.comments)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <Share2 className="h-4 w-4 text-muted-foreground" />
                      <span>{formatMetric(post.metrics.shares)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm">
                      <MousePointerClick className="h-4 w-4 text-muted-foreground" />
                      <span>{formatMetric(post.metrics.clicks)}</span>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfluencerPostsModal;
// pages/TrackingSubmission.tsx
// This is the public page where influencers submit their social media post links
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import {
  Link as LinkIcon,
  Plus,
  Check,
  Loader2,
  AlertCircle,
  ExternalLink,
  Instagram,
  Youtube,
  Music2,
  Twitter,
  Facebook,
  Linkedin,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL;

interface TrackingDetails {
  _id: string;
  trackingCode: string;
  campaign: {
    _id: string;
    name: string;
    status: string;
  };
  influencer: {
    _id: string;
    name: string;
    profileImage?: string;
  };
  status: string;
  submittedPosts: Array<{
    _id: string;
    platform: string;
    postType: string;
    postUrl: string;
    caption?: string;
    status: string;
    submittedAt: string;
  }>;
}

const platformOptions = [
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "youtube", label: "YouTube", icon: Youtube },
  { value: "tiktok", label: "TikTok", icon: Music2 },
  { value: "twitter", label: "Twitter/X", icon: Twitter },
  { value: "facebook", label: "Facebook", icon: Facebook },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "pinterest", label: "Pinterest", icon: LinkIcon },
  { value: "other", label: "Other", icon: LinkIcon },
];

const postTypeOptions = [
  { value: "post", label: "Post" },
  { value: "story", label: "Story" },
  { value: "reel", label: "Reel" },
  { value: "video", label: "Video" },
  { value: "short", label: "Short" },
  { value: "live", label: "Live" },
  { value: "blog", label: "Blog" },
  { value: "review", label: "Review" },
  { value: "other", label: "Other" },
];

// Platform icon component
const PlatformIcon = ({ platform, className }: { platform: string; className?: string }) => {
  const iconClass = className || "h-5 w-5";
  switch (platform?.toLowerCase()) {
    case "instagram":
      return <Instagram className={iconClass} />;
    case "youtube":
      return <Youtube className={iconClass} />;
    case "tiktok":
      return <Music2 className={iconClass} />;
    case "twitter":
      return <Twitter className={iconClass} />;
    case "facebook":
      return <Facebook className={iconClass} />;
    case "linkedin":
      return <Linkedin className={iconClass} />;
    default:
      return <LinkIcon className={iconClass} />;
  }
};

export const TrackingSubmission = () => {
  // Support multiple URL patterns:
  // 1. /:campaignSlug/:trackingCode (e.g., /fashion-show/ML0JH6QMWDSL62)
  // 2. /track/:trackingCode (e.g., /track/ML0JH6QMWDSL62)
  // 3. /submit/:code
  const params = useParams();
  
  // Try to get the tracking code from various possible param names
  const code = params.trackingCode || params.code || 
    // If only one param and it looks like a tracking code (uppercase alphanumeric)
    (Object.values(params).find(v => v && /^[A-Z0-9]{10,}$/.test(v))) ||
    // Last resort: check campaignSlug in case routes are misconfigured
    params.campaignSlug;
  
  console.log('URL params:', params, 'Using code:', code);
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [details, setDetails] = useState<TrackingDetails | null>(null);
  const [trackingLinkId, setTrackingLinkId] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  // Form state
  const [platform, setPlatform] = useState("");
  const [postType, setPostType] = useState("post");
  const [postUrl, setPostUrl] = useState("");
  const [caption, setCaption] = useState("");

  useEffect(() => {
    if (code) {
      fetchDetails();
    }
  }, [code]);

  const fetchDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Use the public endpoint to get tracking link details by code
      const response = await fetch(`${API_BASE_URL}/tracking-links/code/${code}`);
      const result = await response.json();
      
      console.log('Tracking link details:', result);
      
      if (result.success && result.data) {
        // The /code endpoint returns limited data, we need to get full details
        // Store the tracking link ID for submissions
        setDetails({
          _id: result.data._id || '',
          trackingCode: code!,
          campaign: result.data.campaign || { name: 'Campaign', status: 'active' },
          influencer: result.data.influencer || { name: 'Influencer' },
          status: 'active',
          submittedPosts: result.data.submittedPosts || []
        });
        setTrackingLinkId(result.data._id);
      } else {
        setError(result.message || "Invalid or expired tracking link");
      }
    } catch (err) {
      console.error('Error fetching tracking details:', err);
      setError("Failed to load tracking link details");
    }
    
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!platform || !postUrl) {
      toast({
        title: "Missing Fields",
        description: "Please select a platform and enter the post URL",
        variant: "destructive",
      });
      return;
    }

    // Basic URL validation
    try {
      new URL(postUrl);
    } catch {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    
    try {
      // Submit post using the public endpoint
      const response = await fetch(`${API_BASE_URL}/tracking-links/submit/${code}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          postType,
          postUrl,
          caption,
        }),
      });
      
      const result = await response.json();

      if (result.success) {
        setSubmitted(true);
        toast({
          title: "Success!",
          description: "Your post has been submitted for review",
        });
        // Reset form
        setPlatform("");
        setPostType("post");
        setPostUrl("");
        setCaption("");
        // Refresh details to show the new post
        fetchDetails();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to submit post",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error submitting post:', err);
      toast({
        title: "Error",
        description: "Failed to submit post. Please try again.",
        variant: "destructive",
      });
    }
    
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Invalid Link</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.href = '/'}
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-2 shadow-sm mb-4">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <LinkIcon className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-lg">Snappi</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">Submit Your Post</h1>
          <p className="text-muted-foreground">
            Submit your social media posts for the campaign
          </p>
        </div>

        {/* Campaign Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{details?.campaign?.name || 'Campaign'}</CardTitle>
                <CardDescription>
                  Welcome, {details?.influencer?.name || 'Influencer'}
                </CardDescription>
              </div>
              <Badge variant="outline" className="capitalize">
                {details?.campaign?.status || 'active'}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Submission Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Submit New Post
            </CardTitle>
            <CardDescription>
              Enter the details of your published post
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="platform">Platform *</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger id="platform">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platformOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          <div className="flex items-center gap-2">
                            <opt.icon className="h-4 w-4" />
                            {opt.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postType">Post Type</Label>
                  <Select value={postType} onValueChange={setPostType}>
                    <SelectTrigger id="postType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {postTypeOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="postUrl">Post URL *</Label>
                <Input
                  id="postUrl"
                  type="url"
                  placeholder="https://instagram.com/p/..."
                  value={postUrl}
                  onChange={(e) => setPostUrl(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption">Caption (Optional)</Label>
                <Textarea
                  id="caption"
                  placeholder="Enter the post caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={submitting || !platform || !postUrl}
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Submit Post
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Previously Submitted Posts */}
        {details?.submittedPosts && details.submittedPosts.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Previously Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {details.submittedPosts.map((post) => (
                  <div
                    key={post._id}
                    className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <PlatformIcon platform={post.platform} className="h-5 w-5" />
                      <div>
                        <p className="text-sm font-medium capitalize">
                          {post.platform} {post.postType}
                        </p>
                        <a
                          href={post.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          View post <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                    <Badge
                      variant={
                        post.status === "approved"
                          ? "default"
                          : post.status === "rejected"
                          ? "destructive"
                          : "outline"
                      }
                      className="capitalize"
                    >
                      {post.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Success Message */}
        {submitted && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6 text-center">
              <Check className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-green-800">Post Submitted!</h3>
              <p className="text-sm text-green-600 mt-1">
                Your post has been submitted and is pending review
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-muted-foreground">
          Powered by Snappi • Influencer Marketing Platform
        </p>
      </div>
    </div>
  );
};

export default TrackingSubmission;
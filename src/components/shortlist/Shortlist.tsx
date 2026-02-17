import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Plus,
  Users,
  TrendingUp,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Search,
  FileText
} from "lucide-react";
import { SendContractDialog } from "@/components/SendContractDialog";
import { useEffect, useState } from "react";
import { useInfluencers, Influencer } from "@/hooks/useInfluencers";

const SHORTLIST_KEY = 'snappi_shortlist';

export const Shortlist = () => {
  const { influencers, loading: influencersLoading } = useInfluencers();
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [contractDialogOpen, setContractDialogOpen] = useState(false);
  const [selectedInfluencer, setSelectedInfluencer] = useState<Influencer | null>(null);

  // Load shortlist from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(SHORTLIST_KEY);
    if (stored) {
      try {
        setShortlistedIds(JSON.parse(stored));
      } catch (e) {
        console.error('Error loading shortlist:', e);
      }
    }
    setLoading(false);
  }, []);

  // Get shortlisted influencers from the influencers list
  const shortlistedInfluencers = influencers.filter(inf =>
    shortlistedIds.includes(inf.id)
  );

  const handleMessageClick = (influencer: Influencer) => {
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

    // Try Gmail first
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      influencer.email
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(gmailUrl, "_blank");

    // Fallback to default mail app
    setTimeout(() => {
      window.location.href = `mailto:${influencer.email}?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    }, 500);
  };

  const handleRemove = (influencerId: string) => {
    const updatedIds = shortlistedIds.filter(id => id !== influencerId);
    setShortlistedIds(updatedIds);
    localStorage.setItem(SHORTLIST_KEY, JSON.stringify(updatedIds));
  };

  const handleSendContract = (influencer: Influencer) => {
    setSelectedInfluencer(influencer);
    setContractDialogOpen(true);
  };

  const isLoading = loading || influencersLoading;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Your Shortlist</h2>
          <p className="text-muted-foreground">Influencers you've saved for future campaigns</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" asChild>
            <Link to="/search">
              <Plus className="h-4 w-4 mr-2" />
              Add More
            </Link>
          </Button>
          <Button onClick={() => console.log('Creating campaign with shortlisted influencers...')}>
            Create Campaign
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Shortlisted</p>
                <p className="text-2xl font-bold">{isLoading ? "..." : shortlistedInfluencers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-success/10 rounded-lg">
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Match Score</p>
                <p className="text-2xl font-bold">
                  {isLoading ? "..." : shortlistedInfluencers.length > 0
                    ? Math.round(
                      shortlistedInfluencers.reduce(
                        (acc, inf) => acc + (inf.match_score || 0),
                        0
                      ) / shortlistedInfluencers.length
                    ) + "%"
                    : "0%"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Heart className="h-4 w-4 text-accent-foreground" />
              </div>

              <div>
                <p className="text-sm text-muted-foreground">Avg Engagement</p>
                <p className="text-2xl font-bold">
                  {isLoading ? "..." : shortlistedInfluencers.length > 0
                    ? (
                      shortlistedInfluencers.reduce(
                        (acc, inf) => acc + (inf.engagement_rate || 0),
                        0
                      ) / shortlistedInfluencers.length
                    ).toFixed(1) + "%"
                    : "0.0%"
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <Card className="shadow-card">
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">Loading shortlist...</p>
            </CardContent>
          </Card>
        ) : shortlistedInfluencers.length === 0 ? (
          <Card className="shadow-card">
            <CardContent className="p-12 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No influencers shortlisted yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by searching for influencers and adding them to your shortlist
              </p>
              <Button asChild>
                <Link to="/search">
                  <Search className="h-4 w-4 mr-2" />
                  Search Influencers
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          shortlistedInfluencers.map((influencer) => (
            <Card key={influencer.id} className="shadow-card hover:shadow-elegant transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">

                  <div className="flex items-start space-x-4 flex-1">
                    <div className="h-16 w-16 rounded-full bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
                      {influencer.name.split(" ").map(n => n[0]).join("")}
                    </div>

                    <div className="space-y-3 flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold">{influencer.name}</h3>
                        <Badge variant="secondary">{influencer.platform || 'Unknown'}</Badge>
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <span>{influencer.location || 'Location not specified'}</span>
                        <span>•</span>
                        <span>{influencer.categories || 'General'}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Followers</p>
                          <p className="font-medium">
                            {influencer.follower_count
                              ? (influencer.follower_count / 1000).toFixed(1) + 'K'
                              : 'N/A'
                            }
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Engagement</p>
                          <p className="font-medium">{influencer.engagement_rate.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Match Score</p>
                          <p className="font-medium">
                            {influencer.match_score ? influencer.match_score + "%" : "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendContract(influencer)}
                      disabled={!influencer.email}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Send Contract
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMessageClick(influencer)}
                      disabled={!influencer.email}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemove(influencer.id)}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log(`More options for ${influencer.name}`)}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Send Contract Dialog */}
      {selectedInfluencer && (
        <SendContractDialog
          open={contractDialogOpen}
          onOpenChange={setContractDialogOpen}
          influencer={{
            _id: selectedInfluencer.id,
            name: selectedInfluencer.name,
            email: selectedInfluencer.email,
          }}
        />
      )}
    </div>
  );
};
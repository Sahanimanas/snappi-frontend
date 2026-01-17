// components/AddToCampaignDialog.tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Search, 
  Plus, 
  Check, 
  Loader2, 
  Calendar,
  Users,
  DollarSign,
  FolderPlus
} from "lucide-react";
import { campaignsAPI, Campaign, formatNumber } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface AddToCampaignDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  influencerId: string;
  influencerName: string;
  onSuccess?: (campaignId: string, campaignName: string) => void;
}

export const AddToCampaignDialog = ({
  open,
  onOpenChange,
  influencerId,
  influencerName,
  onSuccess,
}: AddToCampaignDialogProps) => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [addingTo, setAddingTo] = useState<string | null>(null);
  const [addedTo, setAddedTo] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      fetchCampaigns();
      setAddedTo([]);
    }
  }, [open]);

  const fetchCampaigns = async () => {
    setLoading(true);
    const result = await campaignsAPI.getAll({ limit: 50 });
    
    if (result.success) {
      const data = Array.isArray(result.data) ? result.data : [];
      // Filter out completed/cancelled campaigns
      const activeCampaigns = data.filter(
        (c: Campaign) => c.status !== "completed" && c.status !== "cancelled"
      );
      setCampaigns(activeCampaigns);
    } else {
      toast({
        title: "Error",
        description: "Failed to load campaigns",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleAddToCampaign = async (campaign: Campaign) => {
    setAddingTo(campaign._id);

    const result = await campaignsAPI.addInfluencer(campaign._id, influencerId);

    if (result.success) {
      setAddedTo((prev) => [...prev, campaign._id]);
      toast({
        title: "Added to Campaign",
        description: `${influencerName} has been added to "${campaign.name}"`,
      });
      onSuccess?.(campaign._id, campaign.name);
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to add influencer to campaign",
        variant: "destructive",
      });
    }

    setAddingTo(null);
  };

  const filteredCampaigns = campaigns.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "active": return "bg-green-500/10 text-green-600 border-green-200";
      case "draft": return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "paused": return "bg-orange-500/10 text-orange-600 border-orange-200";
      default: return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-primary" />
            Add to Campaign
          </DialogTitle>
          <DialogDescription>
            Select a campaign to add <span className="font-medium text-foreground">{influencerName}</span> to
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search campaigns..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Campaign List */}
        <ScrollArea className="flex-1 -mx-6 px-6 max-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredCampaigns.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-10 w-10 mx-auto mb-3 text-muted-foreground opacity-50" />
              <p className="text-sm text-muted-foreground">
                {searchTerm ? "No campaigns match your search" : "No active campaigns found"}
              </p>
              <Button asChild variant="link" className="mt-2">
                <Link to="/create-campaign" onClick={() => onOpenChange(false)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Create New Campaign
                </Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-2 py-2">
              {filteredCampaigns.map((campaign) => {
                const isAdded = addedTo.includes(campaign._id);
                const isAdding = addingTo === campaign._id;
                const influencerCount = campaign.influencers?.length || campaign.influencerCount || 0;

                return (
                  <div
                    key={campaign._id}
                    className={`
                      p-4 rounded-lg border transition-all
                      ${isAdded 
                        ? "bg-green-50 border-green-200 dark:bg-green-950/20" 
                        : "bg-card hover:bg-muted/50 hover:border-primary/30 cursor-pointer"
                      }
                    `}
                    onClick={() => !isAdded && !isAdding && handleAddToCampaign(campaign)}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium truncate">{campaign.name}</h4>
                          <Badge 
                            variant="outline" 
                            className={`text-[10px] capitalize ${getStatusColor(campaign.status)}`}
                          >
                            {campaign.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {influencerCount} influencer{influencerCount !== 1 ? "s" : ""}
                          </span>
                          {campaign.budget?.total && (
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-3 w-3" />
                              {formatNumber(campaign.budget.total)}
                            </span>
                          )}
                          {campaign.startDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(campaign.startDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          )}
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant={isAdded ? "secondary" : "default"}
                        disabled={isAdded || isAdding}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isAdded && !isAdding) {
                            handleAddToCampaign(campaign);
                          }
                        }}
                        className="shrink-0"
                      >
                        {isAdding ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : isAdded ? (
                          <>
                            <Check className="h-4 w-4 mr-1" />
                            Added
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Button asChild variant="outline" size="sm">
            <Link to="/create-campaign" onClick={() => onOpenChange(false)}>
              <Plus className="h-4 w-4 mr-1" />
              New Campaign
            </Link>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
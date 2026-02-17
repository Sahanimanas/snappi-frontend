import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileText, Send, Loader2, Plus, AlertCircle } from "lucide-react";
import { contractsAPI, Contract } from "@/lib/contractApi";
import { campaignsAPI, Campaign } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface SendContractDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  influencer: {
    _id: string;
    name: string;
    email?: string;
  };
  campaignId?: string;
  campaignName?: string;
  onSuccess?: () => void;
}

export const SendContractDialog = ({
  open,
  onOpenChange,
  influencer,
  campaignId,
  campaignName,
  onSuccess,
}: SendContractDialogProps) => {
  const { toast } = useToast();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [selectedContractId, setSelectedContractId] = useState<string>("");
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaignId || "");

  useEffect(() => {
    if (open) {
      fetchData();
    }
  }, [open]);

  const fetchData = async () => {
    setLoading(true);

    // Fetch contracts
    const contractsResult = await contractsAPI.getAll();
    if (contractsResult.success && contractsResult.data) {
      setContracts(contractsResult.data);
    }

    // Fetch campaigns only if no campaignId provided
    if (!campaignId) {
      const campaignsResult = await campaignsAPI.getAll({ status: 'active' });
      if (campaignsResult.success && campaignsResult.data) {
        setCampaigns(campaignsResult.data);
      }
    }

    setLoading(false);
  };

  const handleSend = async () => {
    if (!selectedContractId) {
      toast({
        title: "Required",
        description: "Please select a contract to send",
        variant: "destructive",
      });
      return;
    }

    if (!influencer.email) {
      toast({
        title: "No Email",
        description: "This influencer doesn't have an email address",
        variant: "destructive",
      });
      return;
    }

    setSending(true);

    const result = await contractsAPI.send(selectedContractId, {
      influencerId: influencer._id,
      campaignId: selectedCampaignId || undefined,
    });

    setSending(false);

    if (result.success) {
      toast({
        title: "Contract Sent!",
        description: `Contract sent to ${influencer.name}`,
      });
      onOpenChange(false);
      onSuccess?.();
    } else {
      toast({
        title: "Error",
        description: result.message || "Failed to send contract",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Send Contract
          </DialogTitle>
          <DialogDescription>
            Send a contract to {influencer.name}
            {influencer.email && ` (${influencer.email})`}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !influencer.email ? (
          <div className="py-6 text-center">
            <AlertCircle className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
            <p className="text-muted-foreground">
              This influencer doesn't have an email address.
              <br />
              Cannot send contract via email.
            </p>
          </div>
        ) : contracts.length === 0 ? (
          <div className="py-6 text-center">
            <FileText className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">
              No contracts available. Create one first.
            </p>
            <Button asChild>
              <Link to="/contracts/create">
                <Plus className="h-4 w-4 mr-2" />
                Create Contract
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select Contract *</Label>
              <Select value={selectedContractId} onValueChange={setSelectedContractId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a contract to send" />
                </SelectTrigger>
                <SelectContent>
                  {contracts.map((contract) => (
                    <SelectItem key={contract._id} value={contract._id}>
                      {contract.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {!campaignId && campaigns.length > 0 && (
              <div className="space-y-2">
                <Label>Campaign (Optional)</Label>
                <Select value={selectedCampaignId} onValueChange={setSelectedCampaignId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a campaign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">No campaign</SelectItem>
                    {campaigns.map((campaign) => (
                      <SelectItem key={campaign._id} value={campaign._id}>
                        {campaign.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Associate this contract with a campaign for tracking
                </p>
              </div>
            )}

            {campaignId && campaignName && (
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-sm">
                  <span className="text-muted-foreground">Campaign:</span>{" "}
                  <span className="font-medium">{campaignName}</span>
                </p>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={sending}>
                Cancel
              </Button>
              <Button onClick={handleSend} disabled={sending || !selectedContractId}>
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Contract
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

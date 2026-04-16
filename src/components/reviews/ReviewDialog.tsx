import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { reviewsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface ReviewDialogProps {
  open: boolean;
  onClose: () => void;
  campaignId: string;
  influencerId: string;
  influencerName: string;
  campaignName: string;
}

export const ReviewDialog = ({
  open,
  onClose,
  campaignId,
  influencerId,
  influencerName,
  campaignName,
}: ReviewDialogProps) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      setLoadingExisting(true);
      reviewsAPI.getMy(campaignId, influencerId).then((res) => {
        if (res.success && res.data) {
          setRating(res.data.rating);
          setComment(res.data.comment || "");
        } else {
          setRating(0);
          setComment("");
        }
        setLoadingExisting(false);
      }).catch(() => setLoadingExisting(false));
    }
  }, [open, campaignId, influencerId]);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await reviewsAPI.create({ campaign: campaignId, influencer: influencerId, rating, comment });
      if (res.success) {
        toast({ title: "Review submitted successfully" });
        onClose();
      } else {
        toast({ title: res.message || "Failed to submit review", variant: "destructive" });
      }
    } catch {
      toast({ title: "Failed to submit review", variant: "destructive" });
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Review {influencerName}</DialogTitle>
          <p className="text-sm text-muted-foreground">Campaign: {campaignName}</p>
        </DialogHeader>

        {loadingExisting ? (
          <div className="py-8 text-center text-muted-foreground">Loading...</div>
        ) : (
          <div className="space-y-4 pt-2">
            {/* Star Rating */}
            <div>
              <label className="text-sm font-medium mb-2 block">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="p-0.5 transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        star <= (hoveredRating || rating)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
                {rating > 0 && (
                  <span className="ml-2 text-sm text-muted-foreground self-center">{rating}/5</span>
                )}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="text-sm font-medium mb-2 block">Comment (optional)</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="How was your experience working with this influencer?"
                maxLength={1000}
                rows={3}
              />
              <p className="text-xs text-muted-foreground mt-1">{comment.length}/1000</p>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={loading || rating === 0}>
                {loading ? "Submitting..." : "Submit Review"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Gift, Copy, Share2, Users, TrendingUp, Info, Mail, Linkedin, Facebook, MessageCircle } from "lucide-react";

const REFERRAL_USES_KEY = "snappi_referral_uses";

// Deterministic per-user referral code so the same user always gets the same code
// across devices/sessions, without needing a backend endpoint.
function deriveCodeFromUser(user: any): string {
  const seed = user?._id || user?.id || user?.email || "";
  if (!seed) return "";
  // Simple stable hash → base36, padded
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const positive = Math.abs(hash).toString(36).toUpperCase();
  return ("SNAP" + positive).slice(0, 10).padEnd(10, "X");
}

export const ReferralCard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [code, setCode] = useState<string>("");
  const [uses, setUses] = useState<number>(0);

  const link = useMemo(() => (code ? `${window.location.origin}/signup?ref=${code}` : ""), [code]);

  const shareMessage = useMemo(
    () =>
      `I'm using Snappi to manage my influencer marketing campaigns. Use my referral link to get 20% off your first plan: ${link}`,
    [link]
  );

  useEffect(() => {
    if (!user) return;
    const newCode = deriveCodeFromUser(user);
    setCode(newCode);
    const stored = localStorage.getItem(`${REFERRAL_USES_KEY}_${newCode}`);
    setUses(stored ? parseInt(stored, 10) : 0);
  }, [user]);

  const handleCopy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    toast({ title: "Copied", description: "Invite link copied to clipboard." });
  };

  const openShare = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
  };

  const shareWhatsApp = () =>
    openShare(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`);

  const shareFacebook = () =>
    openShare(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}&quote=${encodeURIComponent(shareMessage)}`
    );

  const shareLinkedIn = () =>
    openShare(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(link)}`);

  const shareEmail = () => {
    window.location.href = `mailto:?subject=${encodeURIComponent(
      "Join me on Snappi"
    )}&body=${encodeURIComponent(shareMessage)}`;
  };

  const useNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: "Join me on Snappi", text: shareMessage, url: link });
      } catch {
        // user cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <Card className="hover-lift border-0 shadow-card bg-gradient-to-br from-primary/5 to-purple-500/5 backdrop-blur-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-transparent rounded-full -translate-y-16 translate-x-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-transparent rounded-full translate-y-12 -translate-x-12" />

      <CardHeader className="relative">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-primary">
            <Gift className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-xl">Invite & Earn</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Share your unique link and you both get 20% off
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 relative">
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Your referral link
          </Label>
          <div className="flex gap-2">
            <Input
              readOnly
              value={user ? link : "Sign in to get your link"}
              className="font-mono text-sm bg-background/50"
            />
            <Button onClick={handleCopy} disabled={!code} variant="default" className="px-6 hover-scale">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>

        {/* Share buttons */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Share via</Label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Button type="button" variant="outline" onClick={shareWhatsApp} disabled={!code} className="justify-start">
              <MessageCircle className="h-4 w-4 mr-2 text-green-600" />
              WhatsApp
            </Button>
            <Button type="button" variant="outline" onClick={shareFacebook} disabled={!code} className="justify-start">
              <Facebook className="h-4 w-4 mr-2 text-blue-600" />
              Facebook
            </Button>
            <Button type="button" variant="outline" onClick={shareEmail} disabled={!code} className="justify-start">
              <Mail className="h-4 w-4 mr-2 text-gray-700" />
              Email
            </Button>
            <Button type="button" variant="outline" onClick={shareLinkedIn} disabled={!code} className="justify-start">
              <Linkedin className="h-4 w-4 mr-2 text-blue-700" />
              LinkedIn
            </Button>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={useNativeShare} disabled={!code} className="w-full">
            <Share2 className="h-4 w-4 mr-2" />
            More share options
          </Button>
        </div>

        <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50 border">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Total referrals</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-primary">{uses}</span>
            {uses > 0 && <TrendingUp className="h-4 w-4 text-green-500" />}
          </div>
        </div>

        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Info className="h-3 w-3 mt-0.5 shrink-0" />
          <span>
            You and your friend both get 20% off when they sign up using your link and complete a paid plan.
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCard;

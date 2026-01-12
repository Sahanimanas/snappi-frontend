import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Gift, Copy, Share2, Users, TrendingUp, Info } from "lucide-react";

const REFERRAL_KEY = 'snappi_referral_code';
const REFERRAL_USES_KEY = 'snappi_referral_uses';

function generateCode(len = 8) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no confusing chars
  const arr = new Uint32Array(len);
  if (window.crypto && window.crypto.getRandomValues) {
    window.crypto.getRandomValues(arr);
  } else {
    for (let i = 0; i < len; i++) arr[i] = Math.floor(Math.random() * 1e9);
  }
  return Array.from(arr, (n) => alphabet[n % alphabet.length]).join("");
}

export const ReferralCard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [code, setCode] = useState<string | null>(null);
  const [uses, setUses] = useState<number>(0);

  const link = useMemo(() => {
    return code ? `${window.location.origin}/signup?ref=${code}` : "";
  }, [code]);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      
      if (!user) {
        setLoading(false);
        return;
      }

      // Try to get existing code from localStorage
      const existingCode = localStorage.getItem(REFERRAL_KEY);
      const existingUses = localStorage.getItem(REFERRAL_USES_KEY);

      if (existingCode) {
        setCode(existingCode);
        setUses(existingUses ? parseInt(existingUses, 10) : 0);
        setLoading(false);
        return;
      }

      // Generate a new code
      const newCode = generateCode();
      localStorage.setItem(REFERRAL_KEY, newCode);
      localStorage.setItem(REFERRAL_USES_KEY, '0');
      setCode(newCode);
      setUses(0);
      setLoading(false);
    };

    init();
  }, [user]);

  const handleCopy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    toast({ title: "Copied", description: "Invite link copied to clipboard." });
  };

  return (
    <Card className="hover-lift border-0 shadow-card bg-gradient-to-br from-primary/5 to-purple-500/5 backdrop-blur-sm overflow-hidden relative">
      {/* Decorative elements */}
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
              Share your unique link and earn rewards together
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
              value={loading ? "Generating..." : link}
              className="font-mono text-sm bg-background/50"
            />
            <Button 
              onClick={handleCopy} 
              disabled={!code || loading} 
              variant="default"
              className="px-6 hover-scale"
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
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

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Info className="h-3 w-3" />
          <span>You and your friend will both receive credits when they sign up</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralCard;

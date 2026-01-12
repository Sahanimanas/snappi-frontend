import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, Check } from "lucide-react";

export const UpgradeCard = () => {
  return (
    <Card className="shadow-card border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Crown className="h-5 w-5 text-primary" />
          <span>Upgrade to Pro</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Check className="h-4 w-4 text-success" />
            <span>Unlimited campaigns</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Check className="h-4 w-4 text-success" />
            <span>Advanced analytics</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Check className="h-4 w-4 text-success" />
            <span>Priority support</span>
          </div>
        </div>
        <Button className="w-full" asChild>
          <Link to="/pricing">Upgrade Now</Link>
        </Button>
      </CardContent>
    </Card>
  );
};
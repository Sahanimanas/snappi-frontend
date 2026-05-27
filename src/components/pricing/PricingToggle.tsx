
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { PricingPlan } from "./pricingPlans";

interface PricingToggleProps {
  plans: PricingPlan[];
}

export const PricingToggle = ({ plans }: PricingToggleProps) => {
  const [isYearly, setIsYearly] = useState(false);
  const { user } = useAuth();

  const getButtonLabel = (plan: PricingPlan) => {
    if (!user) {
      return plan.price === "Free" ? "Start Free" : "Get Started";
    }
    // Logged in
    if (plan.price === "Free") {
      return "Current Plan";
    }
    return "Upgrade";
  };

  const isCurrentPlan = (plan: PricingPlan) => user && plan.price === "Free";

  return (
    <div className="space-y-8">
      {/* Toggle */}
      <div className="flex items-center justify-center space-x-4">
        <span className={`text-sm ${!isYearly ? 'text-primary font-medium' : 'text-muted-foreground'}`}>Monthly</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsYearly(!isYearly)}
          className="relative w-12 h-6 rounded-full p-0 bg-primary"
        >
          <div
            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
              isYearly ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </Button>
        <span className={`text-sm ${isYearly ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
          Yearly
          <Badge variant="outline" className="ml-2 text-xs bg-success/10 text-success border-success/20">Save 2 months</Badge>
        </span>
      </div>

      {/* Plans */}
      <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {plans.map((plan, index) => (
          <Card key={index} className={`shadow-card transition-all duration-300 ${plan.highlighted ? 'ring-2 ring-primary shadow-elegant scale-105' : 'hover:shadow-elegant'}`}>
            <CardHeader className="text-center pb-8">
              {plan.highlighted && (
                <Badge className="mx-auto mb-4">Most Popular</Badge>
              )}
              {isCurrentPlan(plan) && (
                <Badge variant="outline" className="mx-auto mb-4 bg-success/10 text-success border-success/20">Active</Badge>
              )}
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="space-y-2">
                <div className="text-4xl font-bold">
                  {isYearly ? plan.yearlyPrice : plan.price}
                  {plan.price !== "Free" && <span className="text-lg font-normal text-muted-foreground">/month</span>}
                </div>
                {isYearly && plan.price !== "Free" && (
                  <div className="text-sm text-muted-foreground">
                    Billed annually
                  </div>
                )}
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center space-x-3">
                    <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              {isCurrentPlan(plan) ? (
                <Button className="w-full" variant="outline" disabled>
                  Current Plan
                </Button>
              ) : (
                <Button className="w-full" variant={plan.highlighted ? "default" : "outline"} asChild>
                  <Link to={user ? "/dashboard" : "/signup"}>
                    {getButtonLabel(plan)}
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

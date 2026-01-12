import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Gift, Users, TrendingUp, Star, Target } from "lucide-react";
import ReferralCard from "@/components/referrals/ReferralCard";

const benefits = [
  {
    icon: Gift,
    title: "Instant Rewards",
    description: "Both you and your friend receive credits immediately when they sign up"
  },
  {
    icon: Users,
    title: "Build Your Network",
    description: "Grow your professional network while earning rewards"
  },
  {
    icon: TrendingUp,
    title: "Unlimited Earnings",
    description: "No limit to how many friends you can refer and earn from"
  },
  {
    icon: Star,
    title: "Premium Features",
    description: "Use earned credits to unlock premium features and tools"
  }
];

const steps = [
  {
    step: "1",
    title: "Share Your Link",
    description: "Copy and share your unique referral link with friends and colleagues"
  },
  {
    step: "2", 
    title: "Friend Signs Up",
    description: "Your friend creates an account using your referral link"
  },
  {
    step: "3",
    title: "Both Earn Rewards",
    description: "You both receive credits that can be used for premium features"
  }
];

export const ReferEarn = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-8 max-w-5xl">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-primary">
                <Gift className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text tracking-tight">Refer and Earn</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Share the power of our influencer marketing platform with your network and earn rewards together
            </p>
          </div>

          {/* Referral Card */}
          <div className="max-w-2xl mx-auto">
            <ReferralCard />
          </div>

          {/* How It Works */}
          <Card className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl flex items-center justify-center gap-2">
                <Target className="h-6 w-6" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                {steps.map((step, index) => (
                  <div key={index} className="text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-primary text-primary-foreground flex items-center justify-center text-lg font-bold mx-auto">
                      {step.step}
                    </div>
                    <h3 className="font-semibold text-lg">{step.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Benefits */}
          <Card className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Why Refer Friends?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-lg border bg-background/50">
                    <div className="p-2 rounded-lg bg-gradient-primary/10 flex-shrink-0">
                      <benefit.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-2">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Terms */}
          <Card className="border border-muted/50 bg-muted/20">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-3 text-sm">Terms & Conditions</h3>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Credits are awarded when your referred friend completes account verification</li>
                <li>• Self-referrals and duplicate accounts are not eligible for rewards</li>
                <li>• Credits have no cash value and cannot be transferred</li>
                <li>• Referral rewards may be subject to change or termination at any time</li>
              </ul>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};
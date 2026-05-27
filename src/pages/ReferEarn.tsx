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
      <div className="flex min-w-0">
        <Sidebar />
        
        <main className="flex-1 p-4 md:p-6 w-full min-w-0 space-y-8 max-w-5xl">
          {/* Header Section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-4">
              <div className="p-3 rounded-full bg-gradient-primary">
                <Gift className="h-8 w-8 text-primary-foreground" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Refer and Earn</h1>
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

          {/* How the Referral Mechanism Can Work Technically */}
          {/* <Card className="hover-lift border-0 shadow-card bg-card/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl">How the Referral Mechanism Can Work Technically</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal pl-6 space-y-3 text-sm">
                <li>
                  <span className="font-semibold">Referral Code Generation</span>
                  <ul className="list-disc pl-6 mt-1 text-muted-foreground">
                    <li>Assign a unique token to each user.</li>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold">Tracking Clicks &amp; Sign-ups</span>
                  <ul className="list-disc pl-6 mt-1 text-muted-foreground">
                    <li>Link appended with referral code.</li>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold">Verification Logic</span>
                  <ul className="list-disc pl-6 mt-1 text-muted-foreground">
                    <li>Validate successful referral conditions (e.g., after the person referred pays).</li>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold">Reward Distribution</span>
                  <ul className="list-disc pl-6 mt-1 text-muted-foreground">
                    <li>
                      Automated 20% discount based on the plan they purchased for both the referrer and referee.
                      If the referrer is on a yearly plan, they get 20% of the future months, limited to a period of 12 months.
                    </li>
                  </ul>
                </li>
                <li>
                  <span className="font-semibold">Notifications</span>
                  <ul className="list-disc pl-6 mt-1 text-muted-foreground">
                    <li>Emails or in-app messages to inform both parties.</li>
                  </ul>
                </li>
              </ol>

              <h3 className="font-semibold mt-6 mb-2">Easy Link Sharing</h3>
              <ul className="list-disc pl-6 text-sm text-muted-foreground">
                <li>Provide built-in share buttons (WhatsApp, Facebook, Email, LinkedIn).</li>
              </ul>
            </CardContent>
          </Card> */}

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
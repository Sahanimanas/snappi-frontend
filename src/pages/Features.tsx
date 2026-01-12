import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Target, BarChart3, Users, MessageCircle, FileText, CreditCard, Shield } from "lucide-react";

const features = [
  {
    icon: Search,
    title: "AI-Powered Search Engine",
    description: "Discover micro influencers across Instagram, YouTube, TikTok, and Facebook using advanced AI algorithms.",
    features: [
      "Predictive AI search interface",
      "Advanced filters (location, niche, engagement rate)",
      "Match Score algorithm (up to 100/100)",
      "Filter by 4-6%+ engagement rate",
      "Shortlist management"
    ]
  },
  {
    icon: Target,
    title: "Campaign Management Tool",
    description: "Create and manage influencer campaigns with ease using our comprehensive campaign management system.",
    features: [
      "Multiple campaign types (paid, affiliate, gifting, hybrid)",
      "Campaign setup wizard",
      "Pre-loaded brief templates",
      "Bulk email outreach",
      "Gmail & Outlook integration"
    ]
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track campaign effectiveness with clear, actionable insights and comprehensive reporting.",
    features: [
      "Real-time performance tracking",
      "ROI calculations",
      "Visual dashboards",
      "1-page summary reports",
      "Export to PDF, Excel, CSV"
    ]
  },
  {
    icon: Users,
    title: "Influencer Management",
    description: "Organize and manage your influencer relationships with powerful collaboration tools.",
    features: [
      "Influencer profiles & contact info",
      "Communication history",
      "Performance tracking per influencer",
      "Rating and review system"
    ]
  },
  {
    icon: MessageCircle,
    title: "Communication Hub",
    description: "Streamline all influencer communications in one centralized platform.",
    features: [
      "Built-in messaging system",
      "Email template library",
      "Automated follow-ups",
      "Communication logs"
    ]
  },
  {
    icon: FileText,
    title: "Contract & Legal",
    description: "Handle contracts and legal requirements with integrated document management.",
    features: [
      "Template contracts by campaign type",
      "DocuSign integration",
      "Custom contract uploads",
      "Legal compliance tracking",
      "Document storage & retrieval"
    ]
  },
  {
    icon: CreditCard,
    title: "Payment Processing",
    description: "Secure and efficient payment handling for all your influencer campaigns.",
    features: [
      "PayPal & Stripe integration",
      "Bulk payment processing",
      "Invoice tracking",
      "Payment history",
      "Tax documentation"
    ]
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "Enterprise-grade security with full GDPR compliance and data protection.",
    features: [
      "GDPR compliant data handling",
      "Secure data encryption",
      "Two-factor authentication",
      "Regular security audits",
      "Privacy controls"
    ]
  }
];

export const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header isLandingPage={true} />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4">
              Platform Features
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
              Everything You Need for
              <br />
              Influencer Marketing Success
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From AI-powered discovery to comprehensive analytics, Snappi provides all the tools
              you need to run successful influencer marketing campaigns.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="h-full hover:shadow-elegant transition-shadow duration-300">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
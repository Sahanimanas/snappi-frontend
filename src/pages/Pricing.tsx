
import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

const plans = [
  {
    name: "Freemium",
    price: "Free",
    yearlyPrice: "Free",
    description: "Perfect for testing the platform",
    features: [
      "1 search per day",
      "View up to 2 influencer profiles",
      "Basic filters"
    ],
    limitations: [
      "No contact information",
      "No campaign management",
      "No analytics"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    name: "Starter",
    price: "$99/month",
    yearlyPrice: "$79/month",
    description: "Ideal for small businesses starting out",
    features: [
      "Unlimited searches",
      "5 active campaigns",
      "Basic analytics",
      "Email templates",
      "Campaign tracking",
      "Email support"
    ],
    cta: "Start Free Trial",
    popular: true
  },
  {
    name: "Professional",
    price: "$199/month",
    yearlyPrice: "$159/month",
    description: "Best for growing businesses",
    features: [
      "Everything in Starter",
      "Unlimited campaigns",
      "Advanced analytics & reporting",
      "Contract management",
      "Bulk payments",
      "Team collaboration",
      "Team priority support"
    ],
    cta: "Start Free Trial",
    popular: false
  }
];

export const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header isLandingPage={true} />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4">
              Pricing Plans
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text">
              Choose Your Perfect Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start free and scale as you grow. All plans include our core features
              with varying limits and advanced capabilities.
            </p>
          </div>
        </section>

        {/* Pricing Toggle */}
        <section className="py-8">
          <div className="container mx-auto px-4">
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
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {plans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative h-full ${plan.popular ? 'border-primary shadow-elegant' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{plan.name}</CardTitle>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold text-primary">
                        {isYearly ? plan.yearlyPrice : plan.price}
                      </div>
                      {isYearly && plan.price !== "Free" && (
                        <div className="text-sm text-muted-foreground">
                          Billed annually
                        </div>
                      )}
                    </div>
                    <CardDescription>{plan.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="flex-1 flex flex-col">
                    <ul className="space-y-3 flex-1">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                      {plan.limitations && plan.limitations.map((limitation, idx) => (
                        <li key={`limit-${idx}`} className="flex items-start gap-2 text-muted-foreground">
                          <div className="w-4 h-4 mt-0.5 flex-shrink-0">×</div>
                          <span className="text-sm">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <Button 
                      className={`mt-6 w-full ${plan.popular ? 'bg-primary' : ''}`}
                      variant={plan.popular ? 'default' : 'outline'}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* FAQ Section */}
            <div className="mt-20 text-center">
              <h3 className="text-2xl font-bold mb-8">Frequently Asked Questions</h3>
              <div className="grid md:grid-cols-2 gap-8 text-left max-w-4xl mx-auto">
                <div>
                  <h4 className="font-semibold mb-2">Can I change plans anytime?</h4>
                  <p className="text-muted-foreground">Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Is there a free trial?</h4>
                  <p className="text-muted-foreground">Yes, we offer a 7-day free trial for all paid plans. No credit card required.</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What payment methods do you accept?</h4>
                  <p className="text-muted-foreground">We accept all major credit cards and PayPal.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

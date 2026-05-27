
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import { PricingToggle } from "@/components/pricing/PricingToggle";
import { pricingPlans } from "@/components/pricing/pricingPlans";

export const Pricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header isLandingPage={true} />

      <main>
        {/* Hero Section */}
        <section className="py-10 md:py-14 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4">
              Pricing Plans
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gray-900">
              Choose Your Perfect Plan
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Start free and scale as you grow. All plans include our core features
              with varying limits and advanced capabilities.
            </p>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <PricingToggle plans={pricingPlans} />

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

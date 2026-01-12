import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CreditCard, DollarSign, Receipt, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";

const articles = [
  {
    title: "Understanding Snappi Pricing Plans",
    content: `Snappi offers flexible pricing plans designed to scale with your business needs. Learn about each plan's features and choose the right option for your goals.

**Plan Overview:**

**1. Freemium Plan - $0/month**
- 1 search per day
- View up to 2 influencer profiles
- Basic campaign templates
- Email support
- Limited analytics dashboard

**2. Starter Plan - $49/month**
- Unlimited influencer searches
- Access to full influencer profiles
- Up to 5 active campaigns
- Basic performance analytics
- Email and chat support
- Campaign management tools

**3. Professional Plan - $149/month**
- Everything in Starter plan
- Unlimited active campaigns
- Advanced analytics and reporting
- Team collaboration tools (up to 5 members)
- Priority support
- White-label reporting
- API access
- Custom integrations

**4. Enterprise Plan - Custom Pricing**
- Everything in Professional plan
- Unlimited team members
- Dedicated account manager
- Custom feature development
- Advanced security controls
- SLA guarantees
- Training and onboarding

**Plan Comparison Features:**

**Search and Discovery**
- AI-powered influencer matching across all plans
- Advanced filtering options (Professional+)
- Saved search templates (Starter+)
- Bulk export capabilities (Professional+)

**Campaign Management**
- Basic campaign creation (all plans)
- Advanced workflow automation (Professional+)
- Multi-campaign dashboards (Professional+)
- Campaign templates library (Starter+)`,
    category: "Pricing",
    readTime: "7 min read"
  },
  {
    title: "Billing and Payment Management",
    content: `Manage your subscription billing, payment methods, and understand the invoicing process for seamless account management.

**Payment Methods:**

**1. Supported Payment Options**
- Credit cards (Visa, Mastercard, American Express)
- PayPal business accounts
- ACH bank transfers (Enterprise plans)
- Wire transfers for annual subscriptions
- Corporate purchase orders (Enterprise)

**2. Billing Cycles**
- Monthly subscription billing
- Annual subscription discounts (2 months free)
- Pro-rated billing for plan changes
- Automatic renewal settings
- Grace period for failed payments

**3. Currency Options**
- USD (United States Dollar)
- EUR (Euro)
- GBP (British Pound)
- CAD (Canadian Dollar)
- AUD (Australian Dollar)

**Billing Management:**

**Invoice Details**
- Itemized billing statements
- Tax calculations and VAT handling
- Download PDF invoices
- Email receipt confirmations
- Accounting system integration

**Payment Processing**
- Secure PCI-compliant processing
- Automatic payment retry logic
- Failed payment notifications
- Payment method update reminders
- Billing address verification

**Subscription Changes:**
- Immediate plan upgrades
- End-of-cycle downgrades
- Pause subscription options
- Cancellation procedures
- Refund policies and processing`,
    category: "Billing",
    readTime: "8 min read"
  },
  {
    title: "Refunds and Cancellation Policy",
    content: `Understand Snappi's refund policies, cancellation procedures, and how to manage subscription changes effectively.

**Refund Policy:**

**1. Refund Eligibility**
- 30-day money-back guarantee for new subscriptions
- Pro-rated refunds for plan downgrades
- Service disruption compensation
- Billing error corrections
- Unused subscription credits

**2. Refund Process**
- Submit refund request through support
- Account usage verification
- Processing time: 5-10 business days
- Refund method matches original payment
- Email confirmation of refund processing

**3. Non-Refundable Items**
- Setup fees and onboarding charges
- Third-party integration costs
- Custom development work
- Training and consulting services
- Overage charges for usage limits

**Cancellation Procedures:**

**Self-Service Cancellation**
1. Access account settings
2. Navigate to subscription management
3. Select cancellation option
4. Provide cancellation reason
5. Confirm cancellation request
6. Receive confirmation email

**Account Deactivation Timeline**
- Immediate cancellation: End of current billing cycle
- Access maintained until period end
- Data retention for 90 days post-cancellation
- Export options available before deactivation
- Reactivation possible within retention period

**Cancellation Considerations:**
- Outstanding payment obligations
- Active campaign commitments
- Team member access impacts
- Data export requirements
- Alternative plan options`,
    category: "Refunds",
    readTime: "6 min read"
  },
  {
    title: "Usage Limits and Overage Charges",
    content: `Learn about plan limits, usage monitoring, and overage policies to effectively manage your account costs and usage patterns.

**Plan Limitations:**

**1. Search and Discovery Limits**
- Freemium: 1 search per day, 2 profile views
- Starter: Unlimited searches, profile access
- Professional: All Starter features + bulk operations
- Enterprise: Custom limits based on agreement

**2. Campaign and Team Limits**
- Active campaign restrictions by plan
- Team member limits and roles
- Storage limits for assets and files
- API call limitations and rate limits
- Export and reporting frequency limits

**3. Support and Service Limits**
- Response time guarantees by plan
- Support channel access levels
- Training and onboarding inclusions
- Custom development availability
- Account management services

**Usage Monitoring:**

**Dashboard Tracking**
- Real-time usage indicators
- Monthly usage summaries
- Limit threshold notifications
- Historical usage trends
- Projected monthly usage

**Automated Alerts**
- 75% usage threshold warnings
- 90% usage threshold alerts
- Limit exceeded notifications
- Upgrade recommendation prompts
- Cost impact assessments

**Overage Management:**
- Automatic overage billing
- Per-unit overage pricing
- Monthly overage summaries
- Overage prevention controls
- Usage optimization recommendations

**Cost Optimization Strategies:**
- Plan comparison analysis
- Usage pattern optimization
- Bulk operation scheduling
- Team efficiency improvements
- Feature utilization reviews`,
    category: "Usage",
    readTime: "9 min read"
  }
];

export const BillingPricing = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Link to="/help">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Help Center
                </Button>
              </Link>
            </div>
            
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text font-bold">Billing & Pricing</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Everything you need to know about Snappi's pricing plans, billing processes, and account management.
              </p>
            </div>
          </div>

          {/* Billing Features */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="shadow-card text-center p-4">
              <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Pricing Plans</h3>
            </Card>
            <Card className="shadow-card text-center p-4">
              <CreditCard className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Payment Methods</h3>
            </Card>
            <Card className="shadow-card text-center p-4">
              <Receipt className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Invoicing</h3>
            </Card>
            <Card className="shadow-card text-center p-4">
              <RefreshCw className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Refunds</h3>
            </Card>
          </div>

          {/* Articles */}
          <div className="space-y-6">
            {articles.map((article, index) => (
              <Card key={index} className="shadow-card">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <Badge variant="secondary">{article.category}</Badge>
                      <CardTitle className="text-xl">{article.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{article.readTime}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {article.content.split('\n').map((paragraph, pIndex) => {
                      if (paragraph.startsWith('**') && paragraph.endsWith('**') && paragraph.length > 4) {
                        return (
                          <h3 key={pIndex} className="text-lg font-semibold mt-4 mb-2">
                            {paragraph.replace(/\*\*/g, '')}
                          </h3>
                        );
                      }
                      if (paragraph.match(/^\d+\./)) {
                        return <p key={pIndex} className="font-medium mb-2">{paragraph}</p>;
                      }
                      if (paragraph.startsWith('-')) {
                        return (
                          <div key={pIndex} className="flex items-start space-x-2 mb-1 ml-4">
                            <div className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />
                            <p className="text-sm text-muted-foreground">{paragraph.substring(1).trim()}</p>
                          </div>
                        );
                      }
                      if (paragraph.trim()) {
                        return <p key={pIndex} className="mb-3 text-sm leading-relaxed">{paragraph}</p>;
                      }
                      return null;
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card className="shadow-card bg-primary/5">
            <CardHeader>
              <CardTitle>Manage Your Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Link to="/pricing">
                  <Button className="w-full justify-start">
                    View Pricing Plans
                  </Button>
                </Link>
                <Link to="/settings">
                  <Button variant="outline" className="w-full justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Billing Settings
                  </Button>
                </Link>
                <Link to="/help">
                  <Button variant="outline" className="w-full justify-start">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};
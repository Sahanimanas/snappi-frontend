import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Target, Calendar, Users, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const articles = [
  {
    title: "Campaign Types and Strategies",
    content: `Understanding different campaign types helps you choose the right approach for your marketing objectives. Snappi supports four main campaign types, each designed for specific goals.

**1. Paid Promotion Campaigns**
Direct payment campaigns where influencers create content in exchange for monetary compensation. Best for:
- Product launches and announcements
- Brand awareness campaigns
- Time-sensitive promotions
- High-impact content creation

**2. Affiliate Campaigns**
Commission-based partnerships where influencers earn from successful conversions. Features:
- Shopify and WooCommerce integration
- Automatic tracking and attribution
- Performance-based compensation
- Long-term partnership potential

**3. Product Gifting Campaigns**
Product exchange campaigns where influencers receive free products for authentic reviews. Ideal for:
- Product discovery and trials
- Building long-term relationships
- Cost-effective brand exposure
- Authentic user-generated content

**4. Hybrid Campaigns**
Combination of paid promotion and product gifting for maximum impact:
- Guaranteed content creation through payment
- Additional value through product sampling
- Enhanced influencer motivation
- Comprehensive campaign coverage`,
    category: "Strategy",
    readTime: "7 min read"
  },
  {
    title: "Campaign Planning and Setup",
    content: `Proper campaign planning is the foundation of successful influencer marketing. This comprehensive guide covers every aspect of campaign setup.

**Pre-Campaign Planning:**

**1. Define Clear Objectives**
- Awareness: Brand recognition and reach
- Engagement: Likes, comments, shares, saves
- Traffic: Website visits and click-through rates
- Conversions: Sales, sign-ups, downloads
- Community: Follower growth and audience building

**2. Budget Allocation Strategy**
- Influencer compensation (60-70% of budget)
- Content production costs (10-15%)
- Platform fees and tools (10-15%)
- Promotional boosts (5-10%)
- Contingency fund (5-10%)

**3. Timeline Development**
- Research and influencer outreach: 2-3 weeks
- Negotiation and contracts: 1-2 weeks
- Content creation period: 1-3 weeks
- Publishing and promotion: 1-4 weeks
- Analysis and reporting: 1 week

**Campaign Setup Process:**

**Step 1: Campaign Configuration**
- Campaign name and internal reference
- Detailed description and objectives
- Start and end dates with buffer time
- Budget limits and spending controls

**Step 2: Content Guidelines**
- Brand voice and messaging requirements
- Visual style and aesthetic preferences
- Hashtag strategy and mandatory mentions
- Content format specifications (image/video/story)
- Posting schedule and timing preferences`,
    category: "Planning",
    readTime: "10 min read"
  },
  {
    title: "Managing Campaign Workflows",
    content: `Effective workflow management ensures smooth campaign execution from start to finish. Learn how to streamline your processes and maintain quality control.

**Campaign Workflow Stages:**

**1. Pre-Launch Phase**
- Influencer research and vetting
- Outreach and initial communications
- Contract negotiations and agreements
- Brief distribution and clarification
- Content calendar coordination

**2. Production Phase**
- Content creation monitoring
- Draft review and feedback cycles
- Brand compliance verification
- Revision requests and approvals
- Publishing schedule coordination

**3. Live Campaign Management**
- Real-time performance monitoring
- Engagement optimization
- Issue resolution and support
- Additional promotional activities
- Stakeholder communication updates

**4. Post-Campaign Activities**
- Final deliverable collection
- Performance analysis compilation
- Payment processing and reconciliation
- Relationship maintenance
- Success story documentation

**Quality Control Measures:**

**Content Review Process**
1. Initial draft submission
2. Brand guideline compliance check
3. Legal and regulatory review
4. Feedback and revision requests
5. Final approval and publishing clearance

**Performance Monitoring**
- Real-time engagement tracking
- Reach and impression analysis
- Sentiment monitoring and management
- Competitor activity awareness
- Crisis management protocols`,
    category: "Workflow",
    readTime: "8 min read"
  },
  {
    title: "Campaign Optimization Techniques",
    content: `Maximize your campaign performance through strategic optimization techniques and data-driven adjustments throughout the campaign lifecycle.

**Real-Time Optimization Strategies:**

**1. Performance-Based Adjustments**
- Identify top-performing content types
- Amplify successful messaging themes
- Reallocate budget to high-performing influencers
- Adjust posting schedules based on engagement patterns
- Modify targeting parameters for better reach

**2. Content Enhancement Tactics**
- A/B testing different creative approaches
- Optimizing hashtag strategies for discoverability
- Refining call-to-action messaging
- Improving visual consistency across creators
- Incorporating trending topics and formats

**3. Engagement Optimization**
- Responding quickly to comments and mentions
- Encouraging user-generated content
- Creating interactive content elements
- Building community around campaign themes
- Cross-promoting content across platforms

**Long-Term Campaign Success Factors:**

**Relationship Building**
- Maintaining consistent communication
- Providing constructive feedback
- Recognizing exceptional performance
- Building long-term partnerships
- Creating influencer advocacy programs

**Data-Driven Decision Making**
- Weekly performance reviews
- Comparative analysis against benchmarks
- ROI calculations and profitability assessment
- Audience insights and demographic analysis
- Competitive performance monitoring`,
    category: "Optimization",
    readTime: "9 min read"
  }
];

export const CampaignManagement = () => {
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
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text font-bold">Campaign Management</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Master the art of creating, managing, and optimizing influencer campaigns for maximum impact and ROI.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="shadow-card text-center p-4">
              <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Campaign Planning</h3>
            </Card>
            <Card className="shadow-card text-center p-4">
              <Users className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Influencer Outreach</h3>
            </Card>
            <Card className="shadow-card text-center p-4">
              <Target className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Performance Tracking</h3>
            </Card>
            <Card className="shadow-card text-center p-4">
              <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Budget Management</h3>
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

          {/* Related Topics */}
          <Card className="shadow-card bg-primary/5">
            <CardHeader>
              <CardTitle>Explore Related Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Link to="/help/analytics-reporting">
                  <Button variant="outline" className="w-full justify-start">
                    Analytics & Reporting
                  </Button>
                </Link>
                <Link to="/help/influencer-search">
                  <Button variant="outline" className="w-full justify-start">
                    Influencer Search
                  </Button>
                </Link>
                <Link to="/help/billing-pricing">
                  <Button variant="outline" className="w-full justify-start">
                    Billing & Pricing
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
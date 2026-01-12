import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, BarChart3, TrendingUp, Eye, Target } from "lucide-react";
import { Link } from "react-router-dom";

const articles = [
  {
    title: "Understanding Campaign Analytics",
    content: `Campaign analytics provide crucial insights into your influencer marketing performance. Learn how to interpret key metrics and make data-driven decisions.

**Essential Metrics Overview:**

**1. Reach and Impressions**
- Reach: Unique users who saw your content
- Impressions: Total number of times content was displayed
- Frequency: Average impressions per unique user
- Share of voice: Your brand's presence vs competitors

**2. Engagement Metrics**
- Engagement Rate: (Likes + Comments + Shares) / Impressions × 100
- Save Rate: Content saves / Impressions × 100
- Comment Quality: Sentiment analysis of user comments
- Share Rate: Content shares / Impressions × 100

**3. Traffic and Conversion Metrics**
- Click-Through Rate (CTR): Clicks / Impressions × 100
- Website Traffic: Users directed from influencer content
- Conversion Rate: Conversions / Clicks × 100
- Cost Per Click (CPC): Campaign spend / Total clicks

**4. Return on Investment (ROI)**
- Revenue Generated: Direct sales attributed to campaign
- Cost Per Acquisition (CPA): Campaign spend / Conversions
- Lifetime Value (LTV): Long-term customer value
- ROI Calculation: (Revenue - Cost) / Cost × 100

**Interpreting Performance Data:**

**Benchmark Comparisons**
- Industry averages for engagement rates
- Historical campaign performance
- Competitor analysis and positioning
- Platform-specific performance standards`,
    category: "Metrics",
    readTime: "8 min read"
  },
  {
    title: "Real-Time Performance Monitoring",
    content: `Stay on top of your campaign performance with real-time monitoring tools and alerts. Learn how to identify trends and respond quickly to opportunities.

**Dashboard Overview:**

**1. Live Performance Tracker**
- Real-time engagement updates
- Hourly reach and impression growth
- Content performance rankings
- Influencer activity timeline

**2. Alert System Configuration**
- Performance threshold notifications
- Unusual activity alerts
- Milestone achievement updates
- Issue detection and warnings

**3. Mobile Monitoring**
- Mobile app notifications
- Quick performance snapshots
- On-the-go approval workflows
- Emergency response capabilities

**Key Monitoring Areas:**

**Content Performance Tracking**
- Post-by-post analysis
- Optimal posting time identification
- Content type effectiveness
- Hashtag performance monitoring

**Audience Engagement Patterns**
- Peak activity time identification
- Geographic engagement mapping
- Demographic engagement analysis
- Seasonal trend recognition

**Influencer Performance Management**
- Individual creator performance scores
- Delivery timeline tracking
- Quality consistency monitoring
- Partnership effectiveness assessment

**Automated Reporting Features**
- Scheduled performance summaries
- Weekly trend analysis reports
- Monthly comprehensive reviews
- Custom metric tracking dashboards`,
    category: "Monitoring",
    readTime: "6 min read"
  },
  {
    title: "Advanced Analytics Features",
    content: `Unlock deeper insights with Snappi's advanced analytics capabilities. Learn how to leverage sophisticated tools for competitive advantage.

**Advanced Analysis Tools:**

**1. Audience Intelligence**
- Detailed demographic breakdowns
- Interest and behavior analysis
- Lookalike audience identification
- Cross-platform audience overlap

**2. Sentiment Analysis**
- Comment sentiment scoring
- Brand mention analysis
- Crisis detection and alerts
- Reputation monitoring tools

**3. Competitive Intelligence**
- Competitor campaign tracking
- Market share analysis
- Benchmark performance comparisons
- Industry trend identification

**4. Predictive Analytics**
- Performance forecasting models
- Optimal budget allocation suggestions
- Best influencer match predictions
- Campaign outcome projections

**Custom Analytics Setup:**

**1. Goal Tracking Configuration**
- Custom conversion events
- Multi-touch attribution models
- Customer journey mapping
- Lifetime value calculations

**2. Reporting Automation**
- White-label report generation
- Stakeholder-specific dashboards
- Automated insight summaries
- Executive briefing formats

**3. Data Integration**
- Google Analytics connectivity
- CRM system synchronization
- E-commerce platform linking
- Social media API connections

**Advanced Segmentation:**
- Audience cohort analysis
- Geographic performance mapping
- Device and platform breakdowns
- Time-based trend analysis`,
    category: "Advanced",
    readTime: "10 min read"
  },
  {
    title: "Report Generation and Sharing",
    content: `Create professional reports and share insights effectively with stakeholders. Master the art of data storytelling and presentation.

**Report Types and Formats:**

**1. Executive Summary Reports**
- High-level performance overview
- Key achievement highlights
- ROI and budget performance
- Strategic recommendations

**2. Detailed Performance Reports**
- Comprehensive metric analysis
- Individual influencer breakdowns
- Content performance deep-dives
- Comparative trend analysis

**3. Real-Time Dashboard Reports**
- Live performance monitoring
- Interactive data visualization
- Customizable metric displays
- Mobile-optimized viewing

**Report Customization Options:**

**Brand Customization**
- Company logo and colors
- Custom report templates
- Branded cover pages
- White-label presentation options

**Content Customization**
- Selective metric inclusion
- Custom time period analysis
- Audience-specific insights
- Goal-oriented reporting

**Sharing and Distribution:**

**1. Automated Distribution**
- Scheduled report delivery
- Stakeholder-specific versions
- Email automation setup
- Cloud storage integration

**2. Interactive Sharing**
- Live dashboard links
- Collaborative commenting
- Real-time updates
- Permission-based access

**3. Export Options**
- PDF report generation
- Excel data exports
- PowerPoint presentations
- CSV data downloads

**Best Practices for Data Presentation:**
- Clear visual hierarchy
- Actionable insight highlighting
- Trend contextualization
- Recommendation prioritization`,
    category: "Reporting",
    readTime: "7 min read"
  }
];

export const AnalyticsReporting = () => {
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
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text font-bold">Analytics & Reporting</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Understand your campaign performance with comprehensive analytics and create compelling reports for stakeholders.
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="shadow-card text-center p-4">
              <Eye className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Reach & Impressions</h3>
            </Card>
            <Card className="shadow-card text-center p-4">
              <TrendingUp className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Engagement Rates</h3>
            </Card>
            <Card className="shadow-card text-center p-4">
              <Target className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Conversions</h3>
            </Card>
            <Card className="shadow-card text-center p-4">
              <BarChart3 className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">ROI Analysis</h3>
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
              <CardTitle>Related Help Topics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Link to="/help/campaign-management">
                  <Button variant="outline" className="w-full justify-start">
                    Campaign Management
                  </Button>
                </Link>
                <Link to="/help/getting-started">
                  <Button variant="outline" className="w-full justify-start">
                    Getting Started
                  </Button>
                </Link>
                <Link to="/help/influencer-search">
                  <Button variant="outline" className="w-full justify-start">
                    Influencer Search
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
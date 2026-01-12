import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ArrowLeft, Book, Play, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const articles = [
  {
    title: "Welcome to Snappi: Complete Platform Overview",
    content: `Welcome to Snappi, the all-in-one influencer marketing platform designed specifically for small to medium-sized businesses. This comprehensive guide will walk you through everything you need to know to get started.

**What is Snappi?**
Snappi is a powerful platform that helps you discover micro-influencers, manage campaigns, track performance, and grow your brand through authentic influencer partnerships. Our AI-powered matching system connects you with influencers who truly align with your brand values and target audience.

**Key Features:**
- AI-powered influencer discovery across 7 social platforms
- Campaign management and automation tools
- Real-time analytics and performance tracking
- Direct messaging and collaboration tools
- Payment processing and contract management

**Getting Started Checklist:**
1. Complete your profile setup
2. Define your brand guidelines
3. Set your campaign objectives
4. Explore our influencer database
5. Create your first campaign`,
    category: "Platform Overview",
    readTime: "5 min read"
  },
  {
    title: "Setting Up Your Snappi Account",
    content: `Setting up your Snappi account properly is crucial for getting the best results from our platform. Follow this step-by-step guide to optimize your account configuration.

**Step 1: Complete Your Business Profile**
- Add your company name and description
- Upload your brand logo and cover image
- Define your brand voice and values
- Set your primary industry and target markets

**Step 2: Configure Account Settings**
- Set your timezone and currency preferences
- Configure notification preferences
- Set up team member access (Pro plans)
- Connect your social media accounts

**Step 3: Define Your Brand Guidelines**
- Upload brand assets and style guides
- Set content guidelines and requirements
- Define prohibited content types
- Create template briefs for campaigns

**Step 4: Payment Setup**
- Add payment methods for influencer payments
- Set up billing information for your subscription
- Configure payout preferences
- Review payment terms and conditions`,
    category: "Account Setup",
    readTime: "8 min read"
  },
  {
    title: "Creating Your First Campaign",
    content: `Ready to launch your first influencer campaign? This detailed guide will walk you through the entire process, from concept to execution.

**Phase 1: Campaign Planning**
1. **Define Your Objectives**
   - Brand awareness goals
   - Engagement targets
   - Conversion expectations
   - Timeline and budget

2. **Identify Your Target Audience**
   - Demographics (age, location, interests)
   - Behavioral patterns
   - Platform preferences
   - Content consumption habits

**Phase 2: Campaign Setup**
1. **Campaign Details**
   - Campaign name and description
   - Start and end dates
   - Budget allocation
   - Success metrics

2. **Content Requirements**
   - Content types (posts, stories, videos)
   - Posting schedule
   - Hashtags and mentions
   - Brand guidelines compliance

**Phase 3: Influencer Selection**
1. Use our AI-powered search to find relevant influencers
2. Review match scores and audience insights
3. Analyze past performance and engagement rates
4. Create your shortlist of potential partners

**Phase 4: Outreach and Collaboration**
1. Send personalized campaign invitations
2. Negotiate terms and compensation
3. Finalize contracts and agreements
4. Provide creative briefs and assets`,
    category: "Campaign Creation",
    readTime: "12 min read"
  },
  {
    title: "Understanding the Dashboard",
    content: `Your Snappi dashboard is your command center for all influencer marketing activities. Learn how to navigate and utilize every feature effectively.

**Dashboard Overview**
The main dashboard provides a comprehensive view of your account activity, including:
- Active campaigns summary
- Recent performance metrics
- Pending tasks and notifications
- Quick access to key features

**Key Sections Explained:**

**1. Campaign Summary**
- Active, draft, and completed campaigns
- Budget utilization across campaigns
- Performance overview with key metrics
- Upcoming deadlines and milestones

**2. Influencer Management**
- Recently contacted influencers
- Collaboration status updates
- Payment pending notifications
- Performance rankings

**3. Analytics Overview**
- Real-time campaign performance
- Engagement and reach metrics
- ROI calculations and trends
- Comparative analysis tools

**4. Quick Actions**
- Start new campaign
- Search influencers
- Review pending contracts
- Process payments

**Navigation Tips:**
- Use the search bar for quick access to any feature
- Bookmark frequently used pages
- Customize your dashboard view
- Set up automated reports for regular updates`,
    category: "Platform Navigation",
    readTime: "6 min read"
  }
];

export const GettingStarted = () => {
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
                  <Book className="h-8 w-8 text-primary" />
                </div>
              </div>
              <h1 className="text-4xl bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text font-bold">Getting Started</h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Everything you need to know to get started with Snappi and launch your first successful influencer campaign.
              </p>
            </div>
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
                    <Button size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Watch Video
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {article.content.split('\n').map((paragraph, pIndex) => {
                      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                        return (
                          <h3 key={pIndex} className="text-lg font-semibold mt-4 mb-2">
                            {paragraph.replace(/\*\*/g, '')}
                          </h3>
                        );
                      }
                      if (paragraph.match(/^\d+\./)) {
                        return (
                          <div key={pIndex} className="flex items-start space-x-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <p className="text-sm">{paragraph}</p>
                          </div>
                        );
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

          {/* Next Steps */}
          <Card className="shadow-card bg-primary/5">
            <CardHeader>
              <CardTitle>Ready for the Next Step?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <Link to="/help/campaign-management">
                  <Button className="w-full justify-start">
                    Learn Campaign Management
                  </Button>
                </Link>
                <Link to="/help/influencer-search">
                  <Button variant="outline" className="w-full justify-start">
                    Explore Influencer Search
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
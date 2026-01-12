import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Search,
  MessageSquare,
  Book,
  Video,
  Mail,
  Phone,
  Clock,
  Star,
  Users,
  Target,
  BarChart3,
  Settings,
  ExternalLink
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const helpCategories = [
  {
    title: "Getting Started",
    icon: Book,
    description: "Learn the basics of Snappi",
    articles: 12,
    path: "/help/getting-started"
  },
  {
    title: "Campaign Management",
    icon: Target,
    description: "Create and manage influencer campaigns",
    articles: 18,
    path: "/help/campaign-management"
  },
  {
    title: "Analytics & Reporting",
    icon: BarChart3,
    description: "Understanding your campaign performance",
    articles: 8,
    path: "/help/analytics-reporting"
  },
  {
    title: "Influencer Search",
    icon: Users,
    description: "Find and connect with influencers",
    articles: 15,
    path: "/help/influencer-search"
  },
  {
    title: "Account Settings",
    icon: Settings,
    description: "Manage your account and preferences",
    articles: 6,
    path: "/help/account-settings"
  },
  {
    title: "Billing & Pricing",
    icon: Star,
    description: "Subscription and payment information",
    articles: 10,
    path: "/help/billing-pricing"
  }
];

const popularArticles = [
  {
    title: "How to create your first campaign",
    category: "Getting Started",
    views: "2.1K",
    rating: 4.9
  },
  {
    title: "Finding the right influencers for your brand",
    category: "Influencer Search", 
    views: "1.8K",
    rating: 4.8
  },
  {
    title: "Understanding campaign analytics",
    category: "Analytics",
    views: "1.5K",
    rating: 4.7
  },
  {
    title: "Setting up payment methods",
    category: "Billing",
    views: "1.2K",
    rating: 4.6
  }
];

const faqItems = [
  {
    question: "How do I start my first campaign?",
    answer: "To start your first campaign, navigate to the Dashboard and click 'New Campaign'. Follow the step-by-step wizard to set up your campaign objectives, target audience, budget, and timeline."
  },
  {
    question: "How are influencers matched to my campaigns?",
    answer: "Our AI-powered matching system analyzes multiple factors including audience demographics, engagement rates, content style, brand alignment, and historical performance to find the best influencers for your specific campaign goals."
  },
  {
    question: "What metrics can I track for my campaigns?",
    answer: "You can track reach, impressions, engagement rate, click-through rate, conversions, ROI, and audience demographics. Our analytics dashboard provides real-time insights and detailed reports."
  },
  {
    question: "How do I communicate with influencers?",
    answer: "You can message influencers directly through our platform's messaging system. You can also send campaign invitations, share briefs, and manage all communications in one place."
  },
  {
    question: "What's included in the Pro plan?",
    answer: "The Pro plan includes unlimited influencer searches, advanced analytics, campaign automation tools, priority support, and access to our premium influencer network."
  },
  {
    question: "How do I cancel my subscription?",
    answer: "You can cancel your subscription anytime from your account settings under the Billing section. Your access will continue until the end of your current billing period."
  }
];

export const HelpCenter = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text font-bold">Help Center</h1>
            <p className="text-muted-foreground text-lg">
              Find answers, get support, and learn how to make the most of Snappi
            </p>
            
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search for help articles, guides, and FAQs..." 
                className="pl-12 h-12 text-lg"
              />
            </div>
          </div>

          {/* Quick Support */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="shadow-card text-center">
              <CardContent className="p-6">
                <MessageSquare className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Live Chat</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get instant help from our support team
                </p>
                <Button className="w-full" onClick={() => console.log('Starting chat...')}>Start Chat</Button>
              </CardContent>
            </Card>
            
            <Card className="shadow-card text-center">
              <CardContent className="p-6">
                <Mail className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Send us a detailed message
                </p>
                <Button variant="outline" className="w-full" onClick={() => console.log('Opening email...')}>Send Email</Button>
              </CardContent>
            </Card>
            
            <Card className="shadow-card text-center">
              <CardContent className="p-6">
                <Video className="h-8 w-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Video Tutorials</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Learn with step-by-step guides
                </p>
                <Button variant="outline" className="w-full" onClick={() => console.log('Opening video tutorials...')}>Watch Videos</Button>
              </CardContent>
            </Card>
          </div>

          {/* Browse Categories */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Browse by Category</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {helpCategories.map((category, index) => {
                const IconComponent = category.icon;
                return (
                  <Card 
                    key={index} 
                    className="shadow-card hover:shadow-elegant transition-shadow cursor-pointer"
                    onClick={() => navigate(category.path)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <IconComponent className="h-6 w-6 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{category.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {category.description}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            {category.articles} articles
                          </Badge>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Popular Articles */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Popular Articles</h2>
            <div className="grid gap-4">
              {popularArticles.map((article, index) => (
                <Card key={index} className="shadow-card hover:shadow-elegant transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{article.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{article.category}</span>
                          <span>•</span>
                          <span>{article.views} views</span>
                          <span>•</span>
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{article.rating}</span>
                          </div>
                        </div>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* FAQ Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            <Card className="shadow-card">
              <CardContent className="p-6">
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Still Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Phone Support</p>
                      <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Email Support</p>
                      <p className="text-sm text-muted-foreground">support@snappi.com</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Support Hours</p>
                      <p className="text-sm text-muted-foreground">Mon-Fri, 9AM-6PM PST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium">Live Chat</p>
                      <p className="text-sm text-muted-foreground">Available 24/7</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};
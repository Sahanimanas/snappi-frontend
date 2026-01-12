import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { Header } from "@/components/layout/Header";
import { PricingToggle } from "@/components/pricing/PricingToggle";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Search, 
  Target, 
  BarChart3, 
  Users, 
  Zap, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Star,
  TrendingUp,
  PlayCircle,
  Sparkles,
  Rocket,
  Globe,
  Heart,
  Award
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: Search,
    title: "AI-Powered Search",
    description: "Find perfect micro influencers with our intelligent search engine across Instagram, YouTube, TikTok, and Facebook."
  },
  {
    icon: Target,
    title: "Campaign Management",
    description: "Launch and manage campaigns with templates, bulk outreach, contract management, and timeline tracking."
  },
  {
    icon: BarChart3,
    title: "Performance Analytics",
    description: "Track ROI, engagement, and reach with visual dashboards and exportable reports."
  }
];

const pricingPlans = [
  {
    name: "Freemium",
    price: "Free",
    yearlyPrice: "Free",
    description: "Perfect for testing the platform",
    features: [
      "1 search per day",
      "View 2 influencer profiles",
      "Basic campaign templates"
    ],
    highlighted: false
  },
  {
    name: "Starter",
    price: "$99",
    yearlyPrice: "$79",
    description: "Ideal for small businesses (1 user)",
    features: [
      "Unlimited searches",
      "Full influencer profiles",
      "Advanced campaign tools",
      "Basic analytics",
      "Email support"
    ],
    highlighted: true
  },
  {
    name: "Professional",
    price: "$199",
    yearlyPrice: "$159",
    description: "For growing businesses (3+ users)",
    features: [
      "Everything in Starter",
      "Advanced analytics",
      "Priority support",
      "Bulk operations",
      "Team collaboration"
    ],
    highlighted: false
  }
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Marketing Director",
    company: "StyleCo",
    content: "Snappi helped us find perfect micro influencers that increased our engagement by 300%. The ROI tracking is incredible!",
    rating: 5
  },
  {
    name: "Michael Chen",
    role: "Founder",
    company: "TechStart",
    content: "The AI search saved us weeks of manual research. We launched our first campaign in just 2 days.",
    rating: 5
  }
];

export const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-page-bg">
      <Header isLandingPage />
      
      {/* Slogan Section */}
      <section className="relative py-8 bg-gradient-to-r from-background/40 via-primary/5 to-background/40 backdrop-blur-sm border-b border-border/20">
        <div className="container">
          <div className="text-center animate-fade-in">
            <p className="text-lg md:text-xl font-medium text-muted-foreground/80 tracking-wider uppercase">
              Make Every Campaign 
              <span className="bg-gradient-hero bg-clip-text text-transparent font-bold ml-2">
                Snappi
              </span>
            </p>
          </div>
        </div>
      </section>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container relative py-32 md:py-40">
          <div className="text-center space-y-8 animate-fade-in">
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text tracking-tight leading-tight">
              The All-in-One
              <br />
              <span className="bg-gradient-hero bg-clip-text text-transparent relative">
                Influencer Marketing
                <div className="absolute -top-2 -right-2 text-2xl">✨</div>
              </span>
              <br />
              Platform
            </h1>
            
            <p className="text-2xl font-bold bg-gradient-text-subtle bg-clip-text text-transparent max-w-2xl mx-auto leading-relaxed mb-4">
              All the Influence. None of the Chaos.
            </p>
            
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              Discover, manage, and track your influencer campaigns with our AI-powered platform. Perfect for small to medium-sized businesses. 
              Everything you need for influencer marketing in one place, saving you an average of <span className="font-semibold text-primary">15 hours per week</span> and <span className="font-semibold text-primary">$1000 per month</span> compared to competitors.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
              <Button size="xl" variant="hero" className="group shadow-2xl shadow-primary/25" asChild>
                <Link to="/signup">
                  <Rocket className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="xl" variant="glass" className="group" asChild>
                <Link to="/demo">
                  <PlayCircle className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground pt-6">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Free trial included</span>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-32">
        <div className="container">
          <div className="text-center space-y-6 mb-20">
            <Badge variant="secondary" className="px-4 py-2">
              <Zap className="h-3 w-3 mr-1" />
              Core Features
            </Badge>
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Everything you need to scale your
              <br />
              <span className="bg-gradient-hero bg-clip-text text-transparent">influencer marketing</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Three powerful modules designed to streamline your entire influencer marketing workflow from discovery to ROI tracking.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl shadow-elegant hover:shadow-glow transition-all duration-500 hover:scale-[1.02] hover:-translate-y-2">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <CardHeader className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="h-8 w-8 text-primary group-hover:rotate-6 transition-transform duration-300" />
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="relative">
                  <p className="text-muted-foreground leading-relaxed text-base">
                    {feature.description}
                  </p>
                  <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
                      Learn more
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-24">
        <div className="container">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="group space-y-4 p-6 rounded-2xl hover:bg-background/50 transition-all duration-300 hover:scale-105">
              <div className="relative">
                <div className="text-5xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">1M+</div>
                <Users className="absolute -top-2 -right-2 h-6 w-6 text-primary/60 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-muted-foreground font-medium">Micro Influencers</p>
              <p className="text-xs text-muted-foreground/80">Verified profiles</p>
            </div>
            <div className="group space-y-4 p-6 rounded-2xl hover:bg-background/50 transition-all duration-300 hover:scale-105">
              <div className="relative">
                <div className="text-5xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">3x</div>
                <TrendingUp className="absolute -top-1 -right-1 h-6 w-6 text-primary/60 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-muted-foreground font-medium">Average ROI Increase</p>
              <p className="text-xs text-muted-foreground/80">Vs manual methods</p>
            </div>
            <div className="group space-y-4 p-6 rounded-2xl hover:bg-background/50 transition-all duration-300 hover:scale-105">
              <div className="relative">
                <div className="text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent whitespace-nowrap">&lt;48h</div>
                <Rocket className="absolute -top-2 -right-2 h-6 w-6 text-primary/60 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-muted-foreground font-medium">Campaign Launch Time</p>
              <p className="text-xs text-muted-foreground/80">From setup to live</p>
            </div>
            <div className="group space-y-4 p-6 rounded-2xl hover:bg-background/50 transition-all duration-300 hover:scale-105">
              <div className="relative">
                <div className="text-5xl md:text-6xl font-bold bg-gradient-hero bg-clip-text text-transparent">98%</div>
                <Heart className="absolute -top-2 -right-2 h-6 w-6 text-primary/60 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-muted-foreground font-medium">Client Satisfaction</p>
              <p className="text-xs text-muted-foreground/80">5-star rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="container py-32">
        <div className="text-center space-y-6 mb-16">
          <Badge variant="secondary" className="px-4 py-2">
            <BarChart3 className="h-3 w-3 mr-1" />
            Comparison
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Snappi vs. Other
            <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent">Marketing Approaches</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            See how Snappi compares to traditional agencies, other tools, and in-house solutions across key metrics.
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          <Card className="overflow-hidden border-0 bg-gradient-to-br from-background/90 to-background/60 backdrop-blur-xl shadow-elegant">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-border/50 hover:bg-transparent">
                      <TableHead className="font-bold text-foreground text-base w-48 bg-gradient-to-r from-primary/10 to-transparent">
                        Metric
                      </TableHead>
                      <TableHead className="font-bold text-primary text-base text-center bg-gradient-to-r from-primary/5 to-primary/10">
                        <div className="flex items-center justify-center gap-1.5">
                          <Logo className="h-4 w-4" />
                          <span>Snappi</span>
                        </div>
                      </TableHead>
                      <TableHead className="font-bold text-foreground text-base text-center">
                        Other Tools (Averaged)
                      </TableHead>
                      <TableHead className="font-bold text-foreground text-base text-center">
                        Agencies
                      </TableHead>
                      <TableHead className="font-bold text-foreground text-base text-center">
                        Do It Yourself
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground bg-gradient-to-r from-primary/5 to-transparent">
                        Monthly Platform Cost
                      </TableCell>
                      <TableCell className="text-center font-bold text-primary bg-primary/5">
                        $99
                      </TableCell>
                      <TableCell className="text-center">$300–$700</TableCell>
                      <TableCell className="text-center">$2,000–$10,000+</TableCell>
                      <TableCell className="text-center">$0–$200</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground bg-gradient-to-r from-primary/5 to-transparent">
                        Time Spent/Week
                      </TableCell>
                      <TableCell className="text-center font-bold text-primary bg-primary/5">
                        3–5 hours
                      </TableCell>
                      <TableCell className="text-center">5–12 hours</TableCell>
                      <TableCell className="text-center">&gt;45 hours</TableCell>
                      <TableCell className="text-center">&gt;45 hours</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground bg-gradient-to-r from-primary/5 to-transparent">
                        Talent Discovery
                      </TableCell>
                      <TableCell className="text-center font-bold text-primary bg-primary/5">
                        AI-powered, multi-network
                      </TableCell>
                      <TableCell className="text-center">Manual search; smaller DB; limited</TableCell>
                      <TableCell className="text-center">Boutique list; agency curated</TableCell>
                      <TableCell className="text-center">Manual research; inconsistent</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground bg-gradient-to-r from-primary/5 to-transparent">
                        Campaign Management
                      </TableCell>
                      <TableCell className="text-center font-bold text-primary bg-primary/5">
                        Built-in, automated
                      </TableCell>
                      <TableCell className="text-center">Basic to moderate</TableCell>
                      <TableCell className="text-center">Fully managed</TableCell>
                      <TableCell className="text-center">Manual</TableCell>
                    </TableRow>
                    <TableRow className="hover:bg-muted/30">
                      <TableCell className="font-medium text-foreground bg-gradient-to-r from-primary/5 to-transparent">
                        Analytics/ROI Reporting
                      </TableCell>
                      <TableCell className="text-center font-bold text-primary bg-primary/5">
                        Automated, live dashboard
                      </TableCell>
                      <TableCell className="text-center">Basic to moderate</TableCell>
                      <TableCell className="text-center">Supplied in reports</TableCell>
                      <TableCell className="text-center">Manual, usually spreadsheet</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Key Insights */}
          <div className="mt-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Key Insights on <span className="bg-gradient-hero bg-clip-text text-transparent">Time & Cost Savings</span>
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="group border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="h-12 w-12 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg">Time Efficiency</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Save up to <span className="font-bold text-primary">7–15 hours per month</span> compared to typical in-house workflows by streamlining discovery, setup, outreach, and analytics.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="group border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="h-12 w-12 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg">Agency Alternative</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Save <span className="font-bold text-primary">$2,000–$10,000/month</span> compared to agencies—especially relevant for startups and SMBs who can't afford ongoing retainers.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="group border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="h-12 w-12 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Zap className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg">Tool Comparison</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    <span className="font-bold text-primary">1/3–1/7 of the cost</span> vs other all-in-one tools, with much less onboarding or tech knowledge required for full ROI tracking.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="group border-0 bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl shadow-elegant hover:shadow-glow transition-all duration-300 hover:scale-[1.02]">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="h-12 w-12 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <Shield className="h-6 w-6 text-primary" />
                  </div>
                  <h4 className="font-bold text-lg">Hidden Costs</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    In-house efforts require <span className="font-bold text-primary">multiple paid SaaS tools</span> for email, analytics, research, and reporting—hidden costs that often exceed platform subscriptions.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container py-24 bg-background">
        <div className="text-center space-y-6 mb-16">
          <Badge variant="secondary">Pricing</Badge>
          <h2 className="text-3xl md:text-5xl font-bold">
            Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free and scale as you grow. No hidden fees, no long-term contracts.
          </p>
        </div>

        <PricingToggle plans={pricingPlans} />
      </section>

      {/* Testimonials */}
      <section className="container py-32 bg-background">
        <div className="text-center space-y-6 mb-20">
          <Badge variant="secondary" className="px-4 py-2">
            <Award className="h-3 w-3 mr-1" />
            Testimonials
          </Badge>
          <h2 className="text-4xl md:text-6xl font-bold leading-tight">
            Loved by marketing teams
            <br />
            <span className="bg-gradient-hero bg-clip-text text-transparent">worldwide</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            See how Snappi is transforming influencer marketing for businesses like yours.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="group relative overflow-hidden border-0 bg-gradient-to-br from-background/90 to-background/60 backdrop-blur-xl shadow-elegant hover:shadow-glow transition-all duration-500 hover:scale-[1.02]">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardContent className="relative pt-8 pb-6 space-y-6">
                <div className="flex justify-between items-start">
                  <div className="flex space-x-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                    ))}
                  </div>
                  <div className="text-6xl text-primary/10 font-serif">"</div>
                </div>
                
                <p className="text-lg text-foreground leading-relaxed font-medium">
                  {testimonial.content}
                </p>
                
                <div className="flex items-center gap-4 pt-4 border-t border-border/50">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
                    <span className="text-primary font-bold text-lg">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-bold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {testimonial.role} at <span className="text-primary font-medium">{testimonial.company}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-white/5 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <div className="container relative py-32 text-center text-primary-foreground">
          <div className="space-y-8 max-w-4xl mx-auto">
            
            <h2 className="text-4xl md:text-6xl font-bold leading-tight">
              Ready to transform your
              <br />
              <span className="text-primary-foreground">influencer marketing?</span>
            </h2>
            
            <p className="text-xl opacity-90 max-w-2xl mx-auto leading-relaxed">
              Join hundreds of SMBs already using Snappi to scale their marketing efforts and achieve measurable results.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-6">
              <Button size="xl" variant="secondary" className="group shadow-2xl shadow-black/25" asChild>
                <Link to="/signup">
                  <Rocket className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                  Start Your Free Trial
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-primary-foreground/80 pt-8">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                <span>Setup in 5 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="container py-12 border-t">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Logo textSize="lg" iconSize={24} />
            <p className="text-sm text-muted-foreground">
              The all-in-one influencer marketing platform designed for small to medium-sized businesses. 
              Discover, manage, and track your influencer campaigns with ease.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/features" className="hover:text-primary transition-colors">Features</Link></li>
              <li><Link to="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link to="/demo" className="hover:text-primary transition-colors">Demo</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-primary transition-colors">About</Link></li>
              <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
              <li><Link to="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>&copy; 2024 Snappi. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
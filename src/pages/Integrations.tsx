import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap,
  Mail,
  Palette,
  Database,
  Globe,
  CreditCard,
  ShoppingCart,
  CheckCircle,
  AlertCircle,
  Settings as SettingsIcon,
  Gift,
  Users
} from "lucide-react";

const integrations = [
  {
    category: "Email & Communication",
    description: "Streamline your influencer outreach",
    items: [
      {
        name: "Gmail Integration",
        description: "Send campaigns directly from Gmail",
        status: "connected",
        icon: "📧"
      },
      {
        name: "Outlook Integration", 
        description: "Sync with Microsoft Outlook for outreach",
        status: "available",
        icon: "💼"
      },
      {
        name: "Mailchimp",
        description: "Add influencers to email marketing lists",
        status: "available",
        icon: "🐵"
      }
    ]
  },
  {
    category: "eCommerce & Tracking",
    description: "Track affiliate links and sales performance",
    items: [
      {
        name: "Shopify",
        description: "Track affiliate sales and manage discount codes",
        status: "connected",
        icon: "🛍️"
      },
      {
        name: "WooCommerce",
        description: "WordPress eCommerce integration",
        status: "available",
        icon: "🛒"
      },
      {
        name: "Stripe",
        description: "Process influencer payments automatically",
        status: "connected",
        icon: "💳"
      }
    ]
  },
  {
    category: "Content & File Sharing", 
    description: "Share briefs and assets with influencers",
    items: [
      {
        name: "Google Drive",
        description: "Share campaign briefs and brand assets",
        status: "connected",
        icon: "📁"
      },
      {
        name: "Dropbox",
        description: "Collaborative file sharing and storage",
        status: "available",
        icon: "📦"
      },
      {
        name: "Canva",
        description: "Create and share design templates",
        status: "available",
        icon: "🎨"
      }
    ]
  },
  {
    category: "Referral & Growth",
    description: "Grow your network and earn rewards",
    items: [
      {
        name: "Referral Program",
        description: "Invite friends and earn rewards together",
        status: "connected",
        icon: "🎁"
      },
      {
        name: "Affiliate Tracking",
        description: "Track referral performance and commissions",
        status: "available", 
        icon: "📈"
      },
      {
        name: "Social Sharing",
        description: "Share campaigns across social platforms",
        status: "available",
        icon: "📱"
      }
    ]
  }
];

export const Integrations = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text font-bold">Integrations</h1>
              <p className="text-muted-foreground">Connect your favorite tools to streamline your workflow</p>
            </div>
            <Button variant="premium" className="animate-pulse-glow">
              <SettingsIcon className="h-4 w-4 mr-2" />
              Manage API Keys
            </Button>
          </div>

          <div className="space-y-8">
            {integrations.map((category, categoryIndex) => (
              <div key={categoryIndex} className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold">{category.category}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {category.items.map((integration, index) => (
                    <Card key={index} className="group shadow-card hover:shadow-glow transition-all duration-500 hover:scale-[1.02] animate-fade-in border-0 bg-gradient-card backdrop-blur-glass"
                          style={{ animationDelay: `${index * 100}ms` }}>
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="text-3xl p-2 rounded-lg bg-gradient-primary/10 group-hover:scale-110 transition-transform duration-300">{integration.icon}</div>
                            <div>
                              <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors duration-300">{integration.name}</CardTitle>
                              <div className="flex items-center space-x-2 mt-2">
                                {integration.status === "connected" ? (
                                  <>
                                    <CheckCircle className="h-4 w-4 text-success animate-pulse-glow" />
                                    <Badge variant="secondary" className="text-xs bg-success/10 text-success border-success/20 font-medium">Connected</Badge>
                                  </>
                                ) : (
                                  <>
                                    <AlertCircle className="h-4 w-4 text-primary animate-pulse" />
                                    <Badge variant="outline" className="text-xs border-primary/30 text-primary font-medium">Available</Badge>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                          {integration.description}
                        </p>
                        <Button 
                          variant={integration.status === "connected" ? "outline" : "premium"}
                          size="sm"
                          className="w-full font-semibold group-hover:scale-105 transition-transform duration-300"
                          onClick={() => console.log(`${integration.status === "connected" ? "Configuring" : "Connecting"} ${integration.name}`)}
                        >
                          {integration.status === "connected" ? "Configure" : "Connect"}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Integration Benefits */}
          <Card className="shadow-glow bg-gradient-hero border-0 text-white overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-variant/20 animate-float"></div>
            <CardHeader className="relative z-10">
              <CardTitle className="text-white text-2xl font-bold">Why Use Integrations?</CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center group">
                  <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-lg">Save Time</h3>
                  <p className="text-sm text-white/80 leading-relaxed">Automate repetitive tasks and sync data across platforms</p>
                </div>
                <div className="text-center group">
                  <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Database className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-lg">Better Data</h3>
                  <p className="text-sm text-white/80 leading-relaxed">Get real-time insights from all your connected platforms</p>
                </div>
                <div className="text-center group">
                  <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm w-16 h-16 mx-auto mb-4 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 text-lg">Streamlined Workflow</h3>
                  <p className="text-sm text-white/80 leading-relaxed">Manage everything from one central dashboard</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};
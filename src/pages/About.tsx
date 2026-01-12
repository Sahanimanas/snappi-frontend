import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Users, Zap, Globe } from "lucide-react";

export const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header isLandingPage={true} />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4">
              About Snappi
            </Badge>
            <h1 className="text-4xl md:text-6xl  font-bold mb-6 bg-gradient-to-b from-gray-900 to-blue-600 text-transparent bg-clip-text">
              Revolutionizing Influencer
              <br />
              Marketing for SMBs
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We're on a mission to make influencer marketing accessible, affordable, and effective
              for small to medium-sized businesses worldwide.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                <p className="text-lg text-muted-foreground mb-6">
                  To democratize influencer marketing by providing small and medium-sized businesses 
                  with the same powerful tools and insights that were previously only available to 
                  large corporations.
                </p>
                <p className="text-lg text-muted-foreground">
                  We believe every business, regardless of size, should have access to authentic 
                  influencer partnerships that drive real growth and meaningful connections with 
                  their target audience.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6 text-center">
                  <Target className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Precision</h3>
                  <p className="text-sm text-muted-foreground">AI-powered matching for perfect influencer-brand fit</p>
                </Card>
                <Card className="p-6 text-center">
                  <Users className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Community</h3>
                  <p className="text-sm text-muted-foreground">Building authentic relationships that matter</p>
                </Card>
                <Card className="p-6 text-center">
                  <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Efficiency</h3>
                  <p className="text-sm text-muted-foreground">Streamlined workflows that save time and money</p>
                </Card>
                <Card className="p-6 text-center">
                  <Globe className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-2">Global Reach</h3>
                  <p className="text-sm text-muted-foreground">Connect with influencers worldwide</p>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Story Section */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">Our Story</h2>
              <div className="prose prose-lg mx-auto text-muted-foreground">
                <p className="mb-6">
                  Snappi was born from a simple observation: small businesses were being left behind 
                  in the influencer marketing revolution. While enterprise companies had access to 
                  sophisticated platforms and dedicated teams, SMBs were stuck with manual processes, 
                  unreliable tools, and limited budgets.
                </p>
                <p className="mb-6">
                  Our founders, having experienced these challenges firsthand while running their own 
                  small businesses, decided to build the solution they wished existed. They envisioned 
                  a platform that would be powerful enough for professional use, yet simple enough for 
                  any business owner to navigate.
                </p>
                <p>
                  Today, Snappi serves thousands of businesses worldwide, helping them discover 
                  the perfect micro-influencers, manage campaigns efficiently, and measure success 
                  with confidence. We're just getting started.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="p-8 text-center hover:shadow-elegant transition-shadow duration-300">
                <h3 className="text-xl font-bold mb-4 text-primary">Transparency</h3>
                <p className="text-muted-foreground">
                  We believe in open, honest communication with clear pricing, 
                  straightforward features, and no hidden surprises.
                </p>
              </Card>
              <Card className="p-8 text-center hover:shadow-elegant transition-shadow duration-300">
                <h3 className="text-xl font-bold mb-4 text-primary">Innovation</h3>
                <p className="text-muted-foreground">
                  We continuously push the boundaries of what's possible in influencer 
                  marketing through cutting-edge AI and user-centric design.
                </p>
              </Card>
              <Card className="p-8 text-center hover:shadow-elegant transition-shadow duration-300">
                <h3 className="text-xl font-bold mb-4 text-primary">Empowerment</h3>
                <p className="text-muted-foreground">
                  We empower businesses to take control of their marketing destiny 
                  and build authentic connections with their audience.
                </p>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    category: "Getting Started",
    questions: [
      {
        question: "What is Snappi?",
        answer: "Snappi is an all-in-one influencer marketing platform designed specifically for small to medium-sized businesses. We help you discover micro-influencers, manage campaigns, and track performance all in one place."
      },
      {
        question: "How do I get started?",
        answer: "Simply sign up for a free account to start exploring our platform. You can begin with our freemium tier which allows 1 search per day and viewing up to 2 influencer profiles. When you're ready to scale, you can upgrade to one of our paid plans."
      },
      {
        question: "Do I need technical knowledge to use Snappi?",
        answer: "Not at all! Snappi is designed with non-technical users in mind. Our intuitive interface and guided workflows make it easy for anyone to run successful influencer campaigns."
      }
    ]
  },
  {
    category: "Features & Functionality",
    questions: [
      {
        question: "Which social media platforms does Snappi support?",
        answer: "We support influencer discovery across Instagram, YouTube, TikTok, Facebook, X (Twitter), Twitch, and Pinterest. Our AI-powered search engine scans these platforms to find the perfect micro-influencers for your brand."
      },
      {
        question: "What is a micro-influencer?",
        answer: "Micro-influencers typically have between 5,000 and 50,000 followers. They often have higher engagement rates and more authentic connections with their audience compared to macro-influencers, making them perfect for SMB marketing campaigns."
      },
      {
        question: "How does the AI matching work?",
        answer: "Our AI analyzes multiple factors including audience demographics, engagement rates, content style, brand affinity, and niche relevance to provide you with a Match Score (up to 100/100) for each influencer."
      },
      {
        question: "Can I manage multiple campaigns simultaneously?",
        answer: "Yes! Depending on your plan, you can run multiple campaigns at once. Our Professional plan includes unlimited campaigns, while the Starter plan allows up to 5 active campaigns."
      }
    ]
  },
  {
    category: "Pricing & Plans",
    questions: [
      {
        question: "Is there a free version?",
        answer: "Yes! Our freemium tier is completely free and allows you to test the platform with 1 search per day and viewing up to 2 influencer profiles (without contact information)."
      },
      {
        question: "What's included in the free trial?",
        answer: "All paid plans come with a 7-day free trial that gives you full access to all features in that plan. No credit card required to start."
      },
      {
        question: "Can I change my plan later?",
        answer: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate any billing adjustments."
      },
    ]
  },
  {
    category: "Campaign Management",
    questions: [
      {
        question: "What types of campaigns can I create?",
        answer: "You can create four types of campaigns: Paid promotion (direct payment), Affiliate campaigns (commission-based with Shopify/WooCommerce integration), Product gifting campaigns, and Hybrid campaigns (Paid + gifting)."
      },
      {
        question: "How do I communicate with influencers?",
        answer: "Snappi integrates with Gmail and Outlook for seamless communication. We also provide email templates and bulk outreach capabilities to streamline your influencer outreach."
      },
      {
        question: "Can I track campaign performance?",
        answer: "Yes! Our Performance Analytics tool provides real-time tracking of reach, engagement, and ROI. You can view visual dashboards and export detailed reports in PDF, Excel, or CSV format."
      },
      {
        question: "How do contracts work?",
        answer: "We provide template contracts for each campaign type, or you can upload your own. Our DocuSign integration makes it easy to send, sign, and store contracts securely."
      }
    ]
  },
  {
    category: "Payments & Security",
    questions: [
      {
        question: "How do I pay influencers?",
        answer: "Snappi integrates with PayPal and Stripe for secure payment processing. You can make individual payments or use our bulk payout feature for multiple influencers at once."
      },
      {
        question: "Is my data secure?",
        answer: "Absolutely. We use enterprise-grade security with data encryption, two-factor authentication, and regular security audits. We're also fully GDPR compliant."
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept all major credit cards and PayPal. All payments are processed securely through industry-standard payment processors."
      }
    ]
  },
  {
    category: "Support",
    questions: [
      {
        question: "What kind of support do you offer?",
        answer: "Support varies by plan: Starter plans include email support, and Professional plans get priority support."
      },
      {
        question: "Do you offer training or onboarding?",
        answer: "We provide embedded video tutorials for onboarding and written guides. The great part is that our platform is very intuitive/user-friendly and doesn't require training!"
      },
      {
        question: "How can I contact support?",
        answer: "You can reach our support team through the help center in your dashboard or email us directly."
      }
    ]
  }
];

export const FAQ = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header isLandingPage={true} />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/5 to-secondary/5">
          <div className="container mx-auto px-4 text-center">
            <Badge variant="secondary" className="mb-4">
              Help Center
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-b from-gray-900 to-blue-600 bg-clip-text text-transparent">
              Frequently Asked
              <br />
              Questions
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Find answers to common questions about Snappi, our features,
              pricing, and how to get the most out of your influencer campaigns.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 max-w-4xl">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                <h2 className="text-2xl font-bold mb-6 text-primary">
                  {category.category}
                </h2>
                <Accordion type="single" collapsible className="space-y-4">
                  {category.questions.map((faq, questionIndex) => (
                    <AccordionItem 
                      key={questionIndex} 
                      value={`${categoryIndex}-${questionIndex}`}
                      className="border rounded-lg px-6"
                    >
                      <AccordionTrigger className="text-left hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="py-20 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Can't find the answer you're looking for? Our friendly support team is here to help.
              Reach out to us and we'll get back to you as soon as possible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:support@snappi.com" 
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Email Support
              </a>
              <a 
                href="/contact" 
                className="px-6 py-3 border border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors"
              >
                Contact Form
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
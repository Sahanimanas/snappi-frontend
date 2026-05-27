export interface PricingPlan {
  name: string;
  price: string;
  yearlyPrice: string;
  description: string;
  features: string[];
  highlighted: boolean;
}

export const pricingPlans: PricingPlan[] = [
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

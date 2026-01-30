import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AdminProtectedRoute } from "@/components/AdminProtectedRoute";

// 🏠 Public pages
import { Landing } from "./pages/Landing";
import { Signin } from "./pages/Signin";
import { Signup } from "./pages/Signup";
import { Features } from "./pages/Features";
import { Pricing } from "./pages/Pricing";
import { About } from "./pages/About";
import { FAQ } from "./pages/FAQ";
import NotFound from "./pages/NotFound";

// 🔒 Protected pages (User)
import { Dashboard } from "./pages/Dashboard.js";
import { SearchInfluencers } from "./pages/SearchInfluencers";
import { CreateCampaign } from "./pages/CreateCampaign";
import { Campaigns } from "./pages/Campaigns";
import { Analytics } from "./pages/Analytics";
import { Influencers } from "./pages/Influencers";
import { Settings } from "./pages/Settings";
import { Integrations } from "./pages/Integrations";
import { InfluencerTracking } from "./pages/InfluencerTracking";
import { ShortlistPage } from "./pages/ShortlistPage";
import { HelpCenter } from "./pages/HelpCenter";
import { ReferEarn } from "./pages/ReferEarn";
import { CampaignDetail } from "@/pages/CampaignDetail.js";
// 🔐 Admin pages
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminInfluencers from "./pages/admin/AdminInfluencers";
import AdminKeywords from "@/pages/admin/AdminKeywords";
// import { AdminUsers } from "./pages/admin/AdminUsers";
// import { AdminCampaigns } from "./pages/admin/AdminCampaigns";

// 📘 Help section pages
import { GettingStarted } from "./pages/help/GettingStarted";
import { CampaignManagement } from "./pages/help/CampaignManagement";
import { AnalyticsReporting } from "./pages/help/AnalyticsReporting";
import { InfluencerSearch } from "./pages/help/InfluencerSearch";
import { AccountSettings } from "./pages/help/AccountSettings";
import { BillingPricing } from "./pages/help/BillingPricing";
import TrackingSubmission from "./pages/TrackingSubmission.js";
import TrackingRedirect from "./pages/TrackingRedirect.js";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const ref = url.searchParams.get("ref");
      if (ref) localStorage.setItem("refCode", ref);
    } catch (_) {}
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* ---------------- PUBLIC ROUTES ---------------- */}
              <Route path="/" element={<Landing />} />
              <Route path="/signin" element={<Signin />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Signin />} />
              <Route path="/features" element={<Features />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/about" element={<About />} />
              <Route path="/faq" element={<FAQ />} />

              {/* ---------------- ADMIN ROUTES ---------------- */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              <Route path="/admin/dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              <Route path="/admin/influencers" element={<AdminProtectedRoute><AdminInfluencers /></AdminProtectedRoute>} />
              <Route path="/admin/keywords" element={<AdminProtectedRoute><AdminKeywords /></AdminProtectedRoute>} />
              {/* <Route path="/admin/users" element={<AdminProtectedRoute><AdminUsers /></AdminProtectedRoute>} />
              <Route path="/admin/campaigns" element={<AdminProtectedRoute><AdminCampaigns /></AdminProtectedRoute>} /> */}

              {/* ---------------- USER PROTECTED ROUTES ---------------- */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/search" element={<ProtectedRoute><SearchInfluencers /></ProtectedRoute>} />
              <Route path="/campaigns" element={<ProtectedRoute><Campaigns /></ProtectedRoute>} />
              <Route path="/campaigns/create" element={<ProtectedRoute><CreateCampaign /></ProtectedRoute>} />
              <Route path="/create-campaign" element={<ProtectedRoute><CreateCampaign /></ProtectedRoute>} />
              <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
              <Route path="/influencers" element={<ProtectedRoute><Influencers /></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/edit-campaign/:id" element={<ProtectedRoute><CreateCampaign /></ProtectedRoute>} />
              {/* <Route path="/integrations" element={<ProtectedRoute><Integrations /></ProtectedRoute>} /> */}
               <Route path="/:campaignSlug/:trackingCode" element={<TrackingSubmission />} />
              <Route path="/refer" element={<ProtectedRoute><ReferEarn /></ProtectedRoute>} />
              <Route path="/tracking" element={<ProtectedRoute><InfluencerTracking /></ProtectedRoute>} />
              <Route path="/shortlist" element={<ProtectedRoute><ShortlistPage /></ProtectedRoute>} />
              <Route path="/help" element={<ProtectedRoute><HelpCenter /></ProtectedRoute>} />
              <Route path="/help/getting-started" element={<ProtectedRoute><GettingStarted /></ProtectedRoute>} />
              <Route path="/help/campaign-management" element={<ProtectedRoute><CampaignManagement /></ProtectedRoute>} />
              <Route path="/help/analytics-reporting" element={<ProtectedRoute><AnalyticsReporting /></ProtectedRoute>} />
              <Route path="/help/influencer-search" element={<ProtectedRoute><InfluencerSearch /></ProtectedRoute>} />
              <Route path="/help/account-settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
              <Route path="/help/billing-pricing" element={<ProtectedRoute><BillingPricing /></ProtectedRoute>} />
              <Route path="/campaigns/:id" element={<ProtectedRoute><CampaignDetail /></ProtectedRoute>} />
              {/* ---------------- FALLBACK ---------------- */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
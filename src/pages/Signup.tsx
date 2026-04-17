import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { OnboardingFlow, OnboardingData } from "@/components/onboarding/OnboardingFlow";
import { authAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";

export const Signup = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { refreshUser } = useAuth();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'signup' | 'onboarding'>('signup');
  const [referralCode, setReferralCode] = useState<string>("");

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) {
      setReferralCode(ref);
      localStorage.setItem("snappi_pending_ref", ref);
    } else {
      const stored = localStorage.getItem("snappi_pending_ref");
      if (stored) setReferralCode(stored);
    }
  }, [searchParams]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    password: "",
    confirmPassword: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { email, password, firstName, lastName, company, confirmPassword } = formData;

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const result = await authAPI.register({
      name: `${firstName} ${lastName}`,
      email,
      password,
      company,
      role: 'brand',
      referralCode: referralCode || undefined,
    } as any);

    if (!result.success) {
      toast({
        title: "Signup failed",
        description: result.message || "Failed to create account",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Account created!",
        description: referralCode
          ? "Welcome aboard! Your 20% referral discount has been applied."
          : "Welcome aboard!",
      });
      // Increment the referrer's local counter (best-effort, client-side)
      if (referralCode) {
        const key = `snappi_referral_uses_${referralCode}`;
        const current = parseInt(localStorage.getItem(key) || "0", 10);
        localStorage.setItem(key, String(current + 1));
        localStorage.removeItem("snappi_pending_ref");
      }
      // Auto-login: refresh auth context and navigate to dashboard
      await refreshUser();
      navigate("/dashboard");
    }

    setLoading(false);
  };

  const handleOnboardingComplete = async (onboardingData: OnboardingData) => {
    console.log("Onboarding complete:", { ...formData, ...onboardingData });
    // TODO: Save complete user data
    navigate('/dashboard');
  };

  if (step === 'onboarding') {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-gray-900">
            Create Account
          </CardTitle>
          <CardDescription>
            Join Snappi and start your influencer marketing journey
          </CardDescription>
          {referralCode && (
            <div className="mt-3 p-2 rounded-md bg-green-50 border border-green-200 text-xs text-green-800">
              🎉 You were invited via referral code <span className="font-mono font-semibold">{referralCode}</span> — you'll get 20% off your first plan.
            </div>
          )}
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Your work email (this will be your login)</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>
          </form>
          
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
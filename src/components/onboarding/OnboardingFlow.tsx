import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft } from "lucide-react";

interface OnboardingFlowProps {
  onComplete: (data: OnboardingData) => void;
}

export interface OnboardingData {
  businessType: string;
  companySize: string;
  campaignsPerYear: string;
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingData>({
    businessType: "",
    companySize: "",
    campaignsPerYear: ""
  });

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const updateFormData = (field: keyof OnboardingData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.businessType !== "";
      case 2:
        return formData.companySize !== "";
      case 3:
        return formData.campaignsPerYear !== "";
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-background/80 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center space-x-2 mb-4">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`h-2 w-8 rounded-full ${
                  step <= currentStep ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <CardTitle className="text-xl font-bold">
            {currentStep === 1 && "Tell us about your company"}
            {currentStep === 2 && "Company size"}
            {currentStep === 3 && "Campaign frequency"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Tell us a little bit about your company so we can get to know you better:
              </p>
              <RadioGroup
                value={formData.businessType}
                onValueChange={(value) => updateFormData("businessType", value)}
              >
                {[
                  "E-commerce",
                  "Brand",
                  "Small business",
                  "Digital Agency",
                  "Influencer marketing agency",
                  "Other"
                ].map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <RadioGroupItem value={type} id={type} />
                    <Label htmlFor={type}>{type}</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                How many people work at your company?
              </p>
              <RadioGroup
                value={formData.companySize}
                onValueChange={(value) => updateFormData("companySize", value)}
              >
                {["1-4", "5-10", "11-25", "26+"].map((size) => (
                  <div key={size} className="flex items-center space-x-2">
                    <RadioGroupItem value={size} id={size} />
                    <Label htmlFor={size}>{size} employees</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                How many campaigns do you run per year?
              </p>
              <RadioGroup
                value={formData.campaignsPerYear}
                onValueChange={(value) => updateFormData("campaignsPerYear", value)}
              >
                {["None", "1-3", "4-8", "9-12", "12+"].map((count) => (
                  <div key={count} className="flex items-center space-x-2">
                    <RadioGroupItem value={count} id={count} />
                    <Label htmlFor={count}>{count} campaigns</Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          <div className="flex justify-between">
            {currentStep > 1 && (
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={currentStep === 1 ? "ml-auto" : ""}
            >
              {currentStep === 3 ? "Complete Setup" : "Continue"}
              {currentStep < 3 && <ArrowRight className="h-4 w-4 ml-2" />}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
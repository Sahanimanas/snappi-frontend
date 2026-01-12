import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showIcon?: boolean;
  iconSize?: number;
  textSize?: "sm" | "md" | "lg" | "xl";
}

export const Logo = ({ 
  className, 
  showIcon = true, 
  iconSize = 24,
  textSize = "lg" 
}: LogoProps) => {
  const textSizeClasses = {
    sm: "text-lg",
    md: "text-xl", 
    lg: "text-2xl",
    xl: "text-3xl"
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      {showIcon && (
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-primary rounded-lg blur-sm opacity-20"></div>
          <div className="relative bg-gradient-primary p-2 rounded-lg">
            <Zap 
              size={iconSize} 
              className="text-white fill-white" 
            />
          </div>
        </div>
      )}
      <span className={cn(
        "font-bold bg-gradient-primary bg-clip-text text-transparent tracking-tight",
        textSizeClasses[textSize]
      )}>
        Snappi
      </span>
    </div>
  );
};
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    type: "increase" | "decrease";
  };
  icon?: React.ReactNode;
  className?: string;
}

export const StatsCard = ({ title, value, change, icon, className }: StatsCardProps) => {
  return (
    <Card className={cn("shadow-card hover:shadow-elegant transition-shadow duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="h-4 w-4 text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <div className="flex items-center space-x-1 mt-1">
            {change.type === "increase" ? (
              <TrendingUp className="h-3 w-3 text-success" />
            ) : (
              <TrendingDown className="h-3 w-3 text-destructive" />
            )}
            <Badge 
              variant="secondary" 
              className={cn(
                "text-xs",
                change.type === "increase" ? "text-success" : "text-destructive"
              )}
            >
              {change.value}
            </Badge>
            <span className="text-xs text-muted-foreground">from last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
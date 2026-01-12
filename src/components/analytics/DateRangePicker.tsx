import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

interface DateRangePickerProps {
  onDateRangeChange?: (startDate: Date | undefined, endDate: Date | undefined) => void;
}

export const DateRangePicker = ({ onDateRangeChange }: DateRangePickerProps) => {
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [isOpen, setIsOpen] = useState(false);

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    onDateRangeChange?.(date, endDate);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    onDateRangeChange?.(startDate, date);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-60">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {startDate && endDate 
            ? `${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`
            : "Select custom range"
          }
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-6" align="start">
        <div className="space-y-6">
          <div className="space-y-3">
            <Label>Start Date</Label>
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={handleStartDateChange}
              className="rounded-md border p-3 pointer-events-auto"
            />
          </div>
          <div className="space-y-3">
            <Label>End Date</Label>
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={handleEndDateChange}
              className="rounded-md border p-3 pointer-events-auto"
            />
          </div>
          <Button 
            className="w-full" 
            onClick={() => setIsOpen(false)}
            disabled={!startDate || !endDate}
          >
            Apply Range
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
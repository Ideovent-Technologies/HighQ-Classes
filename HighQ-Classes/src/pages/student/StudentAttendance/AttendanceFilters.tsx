import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { cn } from "@/lib/utils";

export default function AttendanceFilters({
  dateRange,
  setQuickDateRange,
  handleDateRangeChange,
}: {
  dateRange: { startDate: Date; endDate: Date };
  setQuickDateRange: (days: number) => void;
  handleDateRangeChange: (type: "startDate" | "endDate", date: Date | undefined) => void;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <CalendarIcon className="h-5 w-5 mr-2" />
          Date Range
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Quick Ranges */}
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setQuickDateRange(7)}>
              Last 7 Days
            </Button>
            <Button variant="outline" size="sm" onClick={() => setQuickDateRange(30)}>
              Last 30 Days
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const now = new Date();
                handleDateRangeChange("startDate", startOfMonth(now));
                handleDateRangeChange("endDate", endOfMonth(now));
              }}
            >
              This Month
            </Button>
          </div>

          {/* Custom Range */}
          <div className="flex flex-wrap items-center gap-2">
            {["startDate", "endDate"].map((type) => (
              <Popover key={type}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full sm:w-[150px] justify-start text-left font-normal",
                      !dateRange[type as "startDate" | "endDate"] && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange[type as "startDate" | "endDate"]
                      ? format(dateRange[type as "startDate" | "endDate"], "MMM dd, yyyy")
                      : type === "startDate"
                      ? "Start date"
                      : "End date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dateRange[type as "startDate" | "endDate"]}
                    onSelect={(date) => handleDateRangeChange(type as "startDate" | "endDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
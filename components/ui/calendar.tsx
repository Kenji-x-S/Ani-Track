"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { format, isValid, parse } from "date-fns";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

export function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          Button.defaultProps?.className,
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          Button.defaultProps?.className,
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside: "text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={
        {
          // IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
          // IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
        }
      }
      {...props}
    />
  );
}

interface DatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            setDate(newDate || new Date());
            setIsCalendarOpen(false);
          }}
          //  initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

interface DateTimePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<Date>(date);

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      const updatedDateTime = new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate(),
        selectedDateTime.getHours(),
        selectedDateTime.getMinutes()
      );
      setSelectedDateTime(updatedDateTime);
      setDate(updatedDateTime);
    }
  };

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeString = e.target.value;
    const [hours, minutes] = timeString.split(":").map(Number);

    if (!isNaN(hours) && !isNaN(minutes)) {
      const updatedDateTime = new Date(selectedDateTime);
      updatedDateTime.setHours(hours);
      updatedDateTime.setMinutes(minutes);
      setSelectedDateTime(updatedDateTime);
      setDate(updatedDateTime);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <DatePicker date={selectedDateTime} setDate={handleDateChange} />
      <div className="flex flex-col space-y-2">
        <Label htmlFor="time">Time</Label>
        <Input
          type="time"
          id="time"
          value={format(selectedDateTime, "HH:mm")}
          onChange={handleTimeChange}
        />
      </div>
    </div>
  );
}

interface DateRangePickerProps {
  dateRange: [Date | undefined, Date | undefined];
  setDateRange: (dateRange: [Date | undefined, Date | undefined]) => void;
}

export function DateRangePicker({
  dateRange,
  setDateRange,
}: DateRangePickerProps) {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

  return (
    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !dateRange && "text-muted-foreground"
          )}
        >
          {dateRange[0] && dateRange[1] ? (
            `${format(dateRange[0], "PPP")} - ${format(dateRange[1], "PPP")}`
          ) : (
            <span>Pick a date range</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          defaultMonth={dateRange[0]}
          selected={{ from: dateRange[0], to: dateRange[1] }}
          onSelect={(range) => {
            setDateRange([range?.from, range?.to]);
            if (range?.from && range?.to) {
              setIsCalendarOpen(false);
            }
          }}
          numberOfMonths={2}
          //   initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

// "use client";

// import * as React from "react";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { DayPicker } from "react-day-picker";
// import { format } from "date-fns";
// import { cn } from "@/lib/utils";
// import { Button } from "@/components/ui/button";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";

// export type CalendarProps = React.ComponentProps<typeof DayPicker>;

// const CustomIconLeft = () => <ChevronLeft className="h-4 w-4" />;
// const CustomIconRight = () => <ChevronRight className="h-4 w-4" />;

// export function Calendar({
//   className,
//   showOutsideDays = true,
//   ...props
// }: CalendarProps) {
//   return (
//     <DayPicker
//       showOutsideDays={showOutsideDays}
//       className={cn("p-3", className)}
//       components={
//         {
//           //   IconLeft: CustomIconLeft,
//           //   IconRight: CustomIconRight,
//         }
//       }
//       {...props}
//     />
//   );
// }

// interface DatePickerProps {
//   date: Date;
//   setDate: (date: Date) => void;
// }

// export function DatePicker({ date, setDate }: DatePickerProps) {
//   const [isCalendarOpen, setIsCalendarOpen] = React.useState(false);

//   return (
//     <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
//       <PopoverTrigger asChild>
//         <Button
//           variant={"outline"}
//           className={cn(
//             "w-full justify-start text-left font-normal",
//             !date && "text-muted-foreground"
//           )}
//         >
//           {date ? format(date, "PPP") : <span>Pick a date</span>}
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-auto p-0" align="start">
//         <Calendar
//           mode="single"
//           selected={date}
//           onSelect={(newDate) => {
//             setDate(newDate || new Date());
//             setIsCalendarOpen(false);
//           }}
//         />
//       </PopoverContent>
//     </Popover>
//   );
// }

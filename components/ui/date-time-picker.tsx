"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DateTimePicker({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
}) {
  const [hours, setHours] = useState<string>(
    date ? String(new Date(date).getHours() % 12 || 12).padStart(2, "0") : "12"
  );
  const [minutes, setMinutes] = useState<string>(
    date ? String(new Date(date).getMinutes()).padStart(2, "0") : "00"
  );
  const [ampm, setAmPm] = useState<string>(
    date ? (new Date(date).getHours() >= 12 ? "PM" : "AM") : "AM"
  );

  useEffect(() => {
    if (date) {
      const newDate = new Date(date);
      let hour = parseInt(hours);
      if (ampm === "PM" && hour !== 12) {
        hour += 12;
      } else if (ampm === "AM" && hour === 12) {
        hour = 0;
      }
      newDate.setHours(hour, parseInt(minutes));
      setDate(newDate);
    }
  }, [hours, minutes, ampm]);

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate);
      let hour = parseInt(hours);
      if (ampm === "PM" && hour !== 12) {
        hour += 12;
      } else if (ampm === "AM" && hour === 12) {
        hour = 0;
      }
      newDate.setHours(hour, parseInt(minutes));
      setDate(newDate);
    } else {
      setDate(undefined);
    }
  };

  const handleHoursChange = (value: string) => {
    setHours(value);
  };

  const handleMinutesChange = (value: string) => {
    setMinutes(value);
  };

  const handleAmPmChange = (value: string) => {
    setAmPm(value);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP") + ` ${hours}:${minutes} ${ampm}`
          ) : (
            <span>Pick a date and time</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
        <div className="flex items-center justify-between p-3 border-t">
          <Select value={hours} onValueChange={handleHoursChange}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="Hour" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((hour) => (
                <SelectItem
                  key={hour}
                  value={hour.toLocaleString().padStart(2, "0")}
                >
                  {hour.toLocaleString().padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="mx-2">:</span>
          <Select value={minutes} onValueChange={handleMinutesChange}>
            <SelectTrigger className="w-[70px]">
              <SelectValue placeholder="Minute" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
                <SelectItem
                  key={minute}
                  value={minute.toLocaleString().padStart(2, "0")}
                >
                  {minute.toLocaleString().padStart(2, "0")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={ampm} onValueChange={handleAmPmChange}>
            <SelectTrigger className="w-[70px] ml-2">
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PopoverContent>
    </Popover>
  );
}

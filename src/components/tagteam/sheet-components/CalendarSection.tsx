
import React from "react";
import { CalendarSectionProps } from "@/types/tagteam";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  daysOfWeek,
  today,
  onClose
}) => {
  return (
    <div className="bg-[#F8F7FC] rounded-xl p-4 mb-6 relative">
      <Button 
        size="icon"
        variant="ghost" 
        className="absolute right-2 top-2 h-8 w-8" 
        onClick={onClose}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="flex justify-between items-center mb-4">
        <span className="text-[16px] font-bold">Upcoming:</span>
        <span className="text-[14px] text-gray-600">Tomorrow, {daysOfWeek[today === 6 ? 0 : today + 1]}</span>
      </div>
      
      <div className="flex justify-between items-center">
        {daysOfWeek.map((day, index) => (
          <div 
            key={day} 
            className={`w-[36px] h-[36px] flex items-center justify-center rounded-full ${
              index === today ? "bg-[#E5DEFF] font-bold" : "bg-[#F0F0F0] text-gray-500"
            }`}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

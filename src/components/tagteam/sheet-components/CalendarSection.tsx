
import React from "react";
import { X } from "lucide-react";

interface CalendarSectionProps {
  daysOfWeek: string[];
  today: number;
  onClose: () => void;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  daysOfWeek,
  today,
  onClose
}) => {
  return (
    <div className="bg-[#F8F7FC] rounded-xl p-4 mb-6 relative">
      <div className="absolute top-2 right-2">
        <button 
          onClick={onClose} 
          className="p-1 rounded-full hover:bg-gray-200"
          aria-label="Close calendar"
        >
          <X className="w-4 h-4 text-gray-500" />
        </button>
      </div>
      
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

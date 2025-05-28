import React from "react";

interface CalendarSectionProps {
  frequency: string;
}

export const CalendarSection: React.FC<CalendarSectionProps> = ({
  frequency
}) => {
  // Helper function to get day abbreviations starting from today
  const getWeekStartingFromToday = () => {
    const dayAbbreviations = ["Su", "Mo", "Tu", "W", "Th", "F", "Sa"];
    const today = new Date().getDay();
    
    const reorderedDays = [];
    for (let i = 0; i < 7; i++) {
      const dayIndex = (today + i) % 7;
      reorderedDays.push({
        abbr: dayAbbreviations[dayIndex],
        dayIndex: dayIndex,
        isToday: i === 0,
        dayOffset: i
      });
    }
    
    return reorderedDays;
  };

  // Helper function to determine if a day is a scheduled activity day
  const isScheduledActivityDay = (dayIndex: number, dayOffset: number) => {
    if (frequency.toLowerCase().includes('daily')) {
      // For daily teams, all days are scheduled activity days
      return true;
    } else if (frequency.toLowerCase().includes('weekly')) {
      // Extract the reset day from frequency string (e.g., "Weekly (Monday)")
      const resetDayMatch = frequency.match(/\((.+)\)/);
      if (resetDayMatch) {
        const resetDayName = resetDayMatch[1].toLowerCase();
        const resetDayMap: { [key: string]: number } = {
          'sunday': 0,
          'monday': 1,
          'tuesday': 2,
          'wednesday': 3,
          'thursday': 4,
          'friday': 5,
          'saturday': 6
        };
        
        const resetDayIndex = resetDayMap[resetDayName];
        return dayIndex === resetDayIndex;
      }
    }
    return false;
  };

  // Helper function to determine if a day is the immediate next activity day
  const isImmediateNextActivityDay = (dayIndex: number, dayOffset: number) => {
    if (frequency.toLowerCase().includes('daily')) {
      // For daily teams, tomorrow (dayOffset = 1) is the next activity day
      return dayOffset === 1;
    } else if (frequency.toLowerCase().includes('weekly')) {
      // Extract the reset day from frequency string (e.g., "Weekly (Monday)")
      const resetDayMatch = frequency.match(/\((.+)\)/);
      if (resetDayMatch) {
        const resetDayName = resetDayMatch[1].toLowerCase();
        const resetDayMap: { [key: string]: number } = {
          'sunday': 0,
          'monday': 1,
          'tuesday': 2,
          'wednesday': 3,
          'thursday': 4,
          'friday': 5,
          'saturday': 6
        };
        
        const resetDayIndex = resetDayMap[resetDayName];
        return dayIndex === resetDayIndex;
      }
    }
    return false;
  };

  // Helper function to get styling classes for each day
  const getDayClasses = (day: any) => {
    const baseClasses = "w-[32px] h-[32px] flex items-center justify-center rounded-full text-xs font-medium";
    
    if (day.isToday) {
      // Current day styling (purple background)
      return `${baseClasses} bg-[#E5DEFF] font-bold text-black`;
    } else if (isImmediateNextActivityDay(day.dayIndex, day.dayOffset)) {
      // Immediate next activity day (filled green)
      return `${baseClasses} bg-[#8CFF6E] font-medium text-black`;
    } else if (isScheduledActivityDay(day.dayIndex, day.dayOffset)) {
      // Other scheduled activity days (green border)
      return `${baseClasses} border-2 border-[#8CFF6E] bg-white text-black font-medium`;
    } else {
      // Regular days
      return `${baseClasses} bg-[#F0F0F0] text-gray-500`;
    }
  };

  // Helper function to get upcoming activity text
  const getUpcomingText = () => {
    if (frequency.toLowerCase().includes('daily')) {
      return "Tomorrow";
    } else if (frequency.toLowerCase().includes('weekly')) {
      const resetDayMatch = frequency.match(/\((.+)\)/);
      if (resetDayMatch) {
        const resetDayName = resetDayMatch[1];
        return `Next ${resetDayName}`;
      }
      return "Next Activity";
    }
    return "Next Activity";
  };

  const weekDays = getWeekStartingFromToday();

  return (
    <div className="bg-[#F8F7FC] rounded-xl p-4 mb-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[16px] font-bold">Upcoming:</span>
        <span className="text-[14px] text-gray-600">{getUpcomingText()}</span>
      </div>
      
      <div className="flex justify-between items-center gap-1 px-1">
        {weekDays.map((day, index) => (
          <div 
            key={`${day.abbr}-${index}`}
            className={getDayClasses(day)}
          >
            {day.abbr}
          </div>
        ))}
      </div>
    </div>
  );
};

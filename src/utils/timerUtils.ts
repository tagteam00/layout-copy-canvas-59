
import { format, differenceInSeconds, addDays } from "date-fns";

export type TimerUrgency = "normal" | "warning" | "urgent";

export interface TimerDisplay {
  timeString: string;
  urgency: TimerUrgency;
}

export const getWeekdayName = (dayIndex: number): string => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayIndex];
};

export const getShortWeekdayName = (dayIndex: number): string => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayIndex];
};

export const calculateAdaptiveTimer = (frequency: string, resetDay?: string): TimerDisplay => {
  const now = new Date();
  let timeString = "";
  let urgency: TimerUrgency = "normal";
  
  // For daily frequency - show HH:MM:SS format
  if (frequency.toLowerCase().includes("daily")) {
    // Calculate time until midnight
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    const secondsRemaining = differenceInSeconds(tomorrow, now);
    
    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    const seconds = secondsRemaining % 60;
    
    timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Set urgency based on time remaining
    if (hours < 1) {
      urgency = "urgent";
    } else if (hours < 6) {
      urgency = "warning";
    }
  } 
  // For weekly frequency - show days remaining
  else if (frequency.toLowerCase().includes("weekly")) {
    // Find the day index for the reset day
    const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const resetDayLower = resetDay ? resetDay.toLowerCase() : "monday"; // Default to Monday
    const resetDayIndex = weekdays.indexOf(resetDayLower);
    
    if (resetDayIndex !== -1) {
      const currentDayIndex = now.getDay();
      let daysRemaining = resetDayIndex - currentDayIndex;
      
      // If the day has already passed this week, calculate for next week
      if (daysRemaining <= 0) {
        daysRemaining += 7;
      }
      
      // Format the display based on days remaining
      if (daysRemaining === 1) {
        timeString = `Tomorrow (${getShortWeekdayName(resetDayIndex)})`;
      } else if (daysRemaining < 7) {
        timeString = `${daysRemaining} Days (${getShortWeekdayName(resetDayIndex)})`;
      } else {
        timeString = `7 Days (${getShortWeekdayName(resetDayIndex)})`;
      }
      
      // Set urgency based on days remaining
      if (daysRemaining === 1) {
        urgency = "warning";
      } else if (daysRemaining <= 2) {
        urgency = "warning";
      }
    } else {
      // Fallback if the day isn't valid
      timeString = "7 Days";
    }
  } else {
    // Default fallback
    timeString = "24:00:00";
  }
  
  return { timeString, urgency };
};

export const getUrgencyColor = (urgency: TimerUrgency): string => {
  switch (urgency) {
    case "urgent":
      return "text-red-600";
    case "warning":
      return "text-amber-500";
    case "normal":
    default:
      return "text-blue-500";
  }
};


import { differenceInSeconds } from "date-fns";
import { TimerDisplay } from "@/types/tagteam";

// Export the TimerUrgency type so it can be imported in other files
export type TimerUrgency = "normal" | "warning" | "urgent";

export const getWeekdayName = (dayIndex: number): string => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[dayIndex];
};

export const getShortWeekdayName = (dayIndex: number): string => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[dayIndex];
};

/**
 * Calculates the remaining time based on frequency type
 * For daily frequency - shows simplified format (4h, 25m, etc.)
 * For weekly frequency - shows simplified days remaining (2d, 1d, etc.)
 */
export const calculateAdaptiveTimer = (frequency: string, resetDay?: string): TimerDisplay => {
  const now = new Date();
  let timeString = "";
  let urgency: TimerUrgency = "normal";
  
  // For daily frequency - show simplified format
  if (frequency.toLowerCase().includes("daily")) {
    // Calculate time until midnight
    const tomorrow = new Date();
    tomorrow.setHours(24, 0, 0, 0);
    const secondsRemaining = differenceInSeconds(tomorrow, now);
    
    const hours = Math.floor(secondsRemaining / 3600);
    const minutes = Math.floor((secondsRemaining % 3600) / 60);
    
    // Simplified format based on time remaining
    if (hours > 0) {
      timeString = `${hours}h`;
      if (minutes > 0 && hours < 10) {
        // Only show minutes if hours are less than 10
        timeString += ` ${minutes}m`;
      }
    } else if (minutes > 0) {
      timeString = `${minutes}m`;
    } else {
      timeString = `<1m`;
    }
    
    // Set urgency based on time remaining
    if (hours < 1) {
      urgency = "urgent";
    } else if (hours < 6) {
      urgency = "warning";
    }
  } 
  // For weekly frequency - show simplified days format
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
        timeString = `Tomorrow`;
      } else {
        timeString = `${daysRemaining}d`;
      }
      
      // Set urgency based on days remaining
      if (daysRemaining === 1) {
        urgency = "urgent";
      } else if (daysRemaining <= 2) {
        urgency = "warning";
      }
    } else {
      // Fallback if the day isn't valid
      timeString = `7d`;
    }
  } else {
    // Default fallback
    timeString = `24h`;
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

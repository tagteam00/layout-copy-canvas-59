
import { format, addDays, addWeeks, isToday, isTomorrow, differenceInDays, differenceInHours } from 'date-fns';

/**
 * Calculate and format the time remaining until a reset based on frequency
 * @param frequency The frequency of the activity ('daily', 'weekly', etc.)
 * @param resetDay For weekly frequencies, the day of week (0-6, where 0 is Sunday)
 * @returns Formatted string showing time remaining
 */
export const calculateTimeRemaining = (frequency: string, resetDay?: number): {
  timeString: string;
  urgency: 'normal' | 'warning' | 'urgent';
} => {
  const now = new Date();
  let resetDate = new Date();
  let timeString = '';
  let urgency: 'normal' | 'warning' | 'urgent' = 'normal';

  // Default to midnight tonight
  resetDate.setHours(24, 0, 0, 0);
  
  switch (frequency.toLowerCase()) {
    case 'daily':
      // For daily, reset at midnight
      const hoursRemaining = differenceInHours(resetDate, now);
      
      if (hoursRemaining < 6) {
        urgency = 'urgent';
      } else if (hoursRemaining < 12) {
        urgency = 'warning';
      }
      
      // Format as HH:MM:SS
      timeString = formatTimeUntilMidnight();
      break;
      
    case 'weekly':
      // Get the next occurrence of the selected day
      if (resetDay !== undefined) {
        resetDate = getNextDayOccurrence(now, resetDay);
      } else {
        // Default to next week if no day specified
        resetDate = addDays(resetDate, 7);
      }
      
      const daysUntilReset = differenceInDays(resetDate, now);
      
      if (daysUntilReset < 1) {
        // Less than a day - show hours
        urgency = 'urgent';
        timeString = `Today, ${format(resetDate, 'h:mm a')}`;
      } else if (daysUntilReset < 2) {
        // 1 day - show tomorrow and time
        urgency = 'warning';
        timeString = `Tomorrow, ${format(resetDate, 'h:mm a')}`;
      } else {
        // More than a day - show days and weekday
        const dayName = format(resetDate, 'E');
        timeString = `${daysUntilReset} Days (${dayName})`;
      }
      break;
      
    case 'bi-weekly':
      // Similar to weekly but two weeks out
      if (resetDay !== undefined) {
        resetDate = getNextDayOccurrence(now, resetDay);
        // If the next occurrence is less than 7 days away, add another week
        if (differenceInDays(resetDate, now) < 7) {
          resetDate = addWeeks(resetDate, 1);
        }
      } else {
        // Default to two weeks if no day specified
        resetDate = addDays(resetDate, 14);
      }
      
      const biWeeklyDays = differenceInDays(resetDate, now);
      
      if (biWeeklyDays < 1) {
        urgency = 'urgent';
        timeString = `Today, ${format(resetDate, 'h:mm a')}`;
      } else if (biWeeklyDays < 3) {
        urgency = 'warning';
        const dayName = format(resetDate, 'E');
        timeString = `${biWeeklyDays} Day${biWeeklyDays > 1 ? 's' : ''} (${dayName})`;
      } else {
        timeString = `${biWeeklyDays} Days`;
      }
      break;
      
    case 'monthly':
      // Set to same day next month
      resetDate.setMonth(resetDate.getMonth() + 1);
      
      const monthlyDays = differenceInDays(resetDate, now);
      
      if (monthlyDays < 2) {
        urgency = 'urgent';
        if (isToday(resetDate)) {
          timeString = `Today, ${format(resetDate, 'h:mm a')}`;
        } else {
          timeString = `Tomorrow, ${format(resetDate, 'h:mm a')}`;
        }
      } else if (monthlyDays < 7) {
        urgency = 'warning';
        const dayName = format(resetDate, 'E');
        timeString = `${monthlyDays} Days (${dayName})`;
      } else {
        timeString = `${monthlyDays} Days`;
      }
      break;
      
    default:
      // Fall back to daily format
      timeString = formatTimeUntilMidnight();
  }
  
  return { timeString, urgency };
};

/**
 * Helper function to get the next occurrence of a specific day of the week
 * @param date The starting date
 * @param dayOfWeek Day of week (0-6, where 0 is Sunday)
 * @returns Date object for the next occurrence
 */
export const getNextDayOccurrence = (date: Date, dayOfWeek: number): Date => {
  const resultDate = new Date(date);
  resultDate.setDate(date.getDate() + (dayOfWeek + 7 - date.getDay()) % 7);
  
  // If it's the same day but earlier time, move to next week
  if (resultDate.getDay() === date.getDay() && resultDate.getTime() <= date.getTime()) {
    resultDate.setDate(resultDate.getDate() + 7);
  }
  
  // Set to midnight of that day
  resultDate.setHours(0, 0, 0, 0);
  return resultDate;
};

/**
 * Format time until midnight in HH:MM:SS format
 * @returns String representation of time until midnight
 */
export const formatTimeUntilMidnight = (): string => {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  
  const diff = midnight.getTime() - now.getTime();
  
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Get color class based on urgency level
 * @param urgency The urgency level
 * @returns Tailwind color class
 */
export const getUrgencyColorClass = (urgency: 'normal' | 'warning' | 'urgent'): string => {
  switch (urgency) {
    case 'urgent':
      return 'text-red-500';
    case 'warning':
      return 'text-amber-500';
    default:
      return 'text-blue-500';
  }
};

import { format, addDays, differenceInDays } from 'date-fns';

export const getWeeklyResetDay = (frequency: string, resetDay?: string): string => {
  // Try to get reset day from dedicated column first
  if (resetDay) {
    return resetDay.toLowerCase();
  }
  
  // Fall back to parsing from frequency string
  const match = frequency.match(/\(([^)]+)\)/);
  if (match) {
    return match[1].toLowerCase();
  }
  
  // Default to Monday if not specified
  return 'monday';
};

export const isCorrectDayForWeeklyLogging = (frequency: string, resetDay?: string): boolean => {
  // Only apply this check for weekly frequencies
  if (!frequency.toLowerCase().includes('weekly')) {
    return true; // Daily or other frequencies can log anytime
  }
  
  const today = new Date();
  const currentDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  const targetResetDay = getWeeklyResetDay(frequency, resetDay);
  
  // Map day names to numbers
  const dayMapping: { [key: string]: number } = {
    'sunday': 0,
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5,
    'saturday': 6
  };
  
  const targetDayNumber = dayMapping[targetResetDay];
  
  return currentDayOfWeek === targetDayNumber;
};

export const getDaysUntilNextLogging = (frequency: string, resetDay?: string): number => {
  // Only calculate for weekly frequencies
  if (!frequency.toLowerCase().includes('weekly')) {
    return 0;
  }
  
  const today = new Date();
  const currentDayOfWeek = today.getDay();
  
  const targetResetDay = getWeeklyResetDay(frequency, resetDay);
  
  const dayMapping: { [key: string]: number } = {
    'sunday': 0,
    'monday': 1,
    'tuesday': 2,
    'wednesday': 3,
    'thursday': 4,
    'friday': 5,
    'saturday': 6
  };
  
  const targetDayNumber = dayMapping[targetResetDay];
  
  // Calculate days until target day
  let daysUntil = targetDayNumber - currentDayOfWeek;
  
  // If target day is today or has passed this week, calculate for next week
  if (daysUntil <= 0) {
    daysUntil += 7;
  }
  
  return daysUntil;
};

export const getNextLoggingDateString = (frequency: string, resetDay?: string): string => {
  if (!frequency.toLowerCase().includes('weekly')) {
    return 'tomorrow';
  }
  
  const daysUntil = getDaysUntilNextLogging(frequency, resetDay);
  const nextDate = addDays(new Date(), daysUntil);
  const dayName = format(nextDate, 'EEEE');
  
  return dayName;
};

export const formatCountdownMessage = (frequency: string, resetDay?: string): string => {
  if (!frequency.toLowerCase().includes('weekly')) {
    return '';
  }
  
  const daysUntil = getDaysUntilNextLogging(frequency, resetDay);
  const nextDay = getNextLoggingDateString(frequency, resetDay);
  
  if (daysUntil === 1) {
    return `The tagteam is due tomorrow (${nextDay}). Come back then to log activity.`;
  } else {
    return `The tagteam is due in ${daysUntil} days on ${nextDay}. Come back then to log activity.`;
  }
};
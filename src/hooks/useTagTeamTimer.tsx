import { useState, useEffect, useRef } from "react";
import { calculateAdaptiveTimer, getUrgencyColor } from "@/utils/timerUtils";
import { TimerDisplay } from "@/types/tagteam";

export const useTagTeamTimer = (frequency: string, resetDay?: string) => {
  const [timer, setTimer] = useState<TimerDisplay>({
    timeString: "00:00:00",
    urgency: "normal"
  });
  
  const [timerColorClass, setTimerColorClass] = useState<string>("text-blue-500");
  const [hasResetOccurred, setHasResetOccurred] = useState<boolean>(false);
  
  // Keep track of last check time
  const lastCheckRef = useRef<Date>(new Date());
  
  // Update timer based on frequency
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const timerDisplay = calculateAdaptiveTimer(frequency, resetDay);
      setTimer(timerDisplay);
      setTimerColorClass(getUrgencyColor(timerDisplay.urgency));
      
      // Check for a reset based on frequency
      const isDaily = frequency.toLowerCase().includes("daily");
      
      // For daily frequency, check if we've passed midnight since last check
      if (isDaily) {
        const lastCheck = lastCheckRef.current;
        const lastDate = lastCheck.getDate();
        const currentDate = now.getDate();
        
        // If the date has changed since our last check, a reset occurred
        if (lastDate !== currentDate) {
          console.log("Daily reset detected!");
          setHasResetOccurred(true);
        }
      } 
      // For weekly frequency, check if we've reached the reset day
      else if (resetDay) {
        const lastCheck = lastCheckRef.current;
        const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
        const resetDayIndex = weekdays.indexOf(resetDay.toLowerCase());
        
        if (resetDayIndex !== -1) {
          const lastDayOfWeek = lastCheck.getDay();
          const currentDayOfWeek = now.getDay();
          
          // If we've moved from a day before reset to the reset day or have passed a week
          if ((lastDayOfWeek !== resetDayIndex && currentDayOfWeek === resetDayIndex) ||
              (lastDayOfWeek === currentDayOfWeek && now.getTime() - lastCheck.getTime() >= 7 * 24 * 60 * 60 * 1000)) {
            console.log("Weekly reset detected!");
            setHasResetOccurred(true);
          }
        }
      }
      
      // Update last check time
      lastCheckRef.current = now;
    };
    
    // Initial update
    updateTimer();
    
    // Set interval based on frequency type - more efficient interval management
    const intervalMs = frequency.toLowerCase().includes("daily") ? 1000 : 60000; // Update every second for daily, every minute for weekly
    const interval = setInterval(updateTimer, intervalMs);
    
    return () => clearInterval(interval);
  }, [frequency, resetDay]);

  // Function to acknowledge the reset
  const acknowledgeReset = () => {
    setHasResetOccurred(false);
  };

  return { timer, timerColorClass, hasResetOccurred, acknowledgeReset };
};


import { useState, useEffect } from "react";
import { calculateAdaptiveTimer, getUrgencyColor, createShortTimeDisplay } from "@/utils/timerUtils";
import { TimerDisplay } from "@/types/tagteam";

export const useTagTeamTimer = (frequency: string, resetDay?: string) => {
  const [timer, setTimer] = useState<TimerDisplay>({
    timeString: "00:00:00",
    urgency: "normal"
  });
  
  const [timerColorClass, setTimerColorClass] = useState<string>("text-blue-500");
  const [shortTimeDisplay, setShortTimeDisplay] = useState<string>("--");

  // Update timer based on frequency
  useEffect(() => {
    const updateTimer = () => {
      const timerDisplay = calculateAdaptiveTimer(frequency, resetDay);
      setTimer(timerDisplay);
      setTimerColorClass(getUrgencyColor(timerDisplay.urgency));
      setShortTimeDisplay(createShortTimeDisplay(timerDisplay.timeString, frequency));
    };
    
    // Initial update
    updateTimer();
    
    // Set interval based on frequency type - more efficient interval management
    const intervalMs = frequency.toLowerCase().includes("daily") ? 1000 : 60000; // Update every second for daily, every minute for weekly
    const interval = setInterval(updateTimer, intervalMs);
    
    return () => clearInterval(interval);
  }, [frequency, resetDay]);

  return { timer, timerColorClass, shortTimeDisplay };
};

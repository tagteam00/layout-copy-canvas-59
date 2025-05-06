
import { useState, useEffect } from "react";
import { calculateAdaptiveTimer, TimerUrgency, getUrgencyColor } from "@/utils/timerUtils";

export const useTagTeamTimer = (frequency: string, resetDay?: string) => {
  const [timer, setTimer] = useState<{timeString: string; urgency: TimerUrgency}>({
    timeString: "00:00:00",
    urgency: "normal"
  });
  
  const [timerColorClass, setTimerColorClass] = useState<string>("text-blue-500");

  // Update timer based on frequency
  useEffect(() => {
    const updateTimer = () => {
      const timerDisplay = calculateAdaptiveTimer(frequency, resetDay);
      setTimer(timerDisplay);
      setTimerColorClass(getUrgencyColor(timerDisplay.urgency));
    };
    
    // Initial update
    updateTimer();
    
    // Set interval based on frequency type
    const intervalMs = frequency.toLowerCase().includes("daily") ? 1000 : 60000;
    const interval = setInterval(updateTimer, intervalMs);
    
    return () => clearInterval(interval);
  }, [frequency, resetDay]);

  return { timer, timerColorClass };
};

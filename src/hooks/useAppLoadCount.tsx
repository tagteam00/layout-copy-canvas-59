
import { useState, useEffect } from 'react';

export const useAppLoadCount = () => {
  const [loadCount, setLoadCount] = useState<number>(0);
  const [shouldShowConfetti, setShouldShowConfetti] = useState<boolean>(false);

  useEffect(() => {
    // Get current load count from localStorage
    const currentCount = parseInt(localStorage.getItem('app_load_count') || '0', 10);
    const newCount = currentCount + 1;
    
    // Update localStorage with new count
    localStorage.setItem('app_load_count', newCount.toString());
    
    // Set states
    setLoadCount(newCount);
    setShouldShowConfetti(newCount <= 2);
  }, []);

  return {
    loadCount,
    shouldShowConfetti
  };
};

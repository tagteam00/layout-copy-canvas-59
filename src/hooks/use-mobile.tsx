
import * as React from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // iOS-safe mobile detection
    const checkIsMobile = () => {
      try {
        // Use CSS media query match without event listeners
        const mediaQuery = window.matchMedia('(max-width: 767px)');
        setIsMobile(mediaQuery.matches);
      } catch (error) {
        // Fallback for iOS compatibility
        const userAgent = navigator.userAgent || '';
        const mobileRegex = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        setIsMobile(mobileRegex.test(userAgent) || window.innerWidth <= 767);
      }
    };

    // Initial check
    checkIsMobile();

    // Simple timeout-based check for iOS compatibility
    const interval = setInterval(checkIsMobile, 1000);
    
    return () => {
      clearInterval(interval);
    };
  }, []);

  return isMobile;
}


import * as React from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Use a safer approach without addEventListener for iOS compatibility
    const checkIsMobile = () => {
      // Use CSS media query check without event listeners
      const mediaQuery = window.matchMedia('(max-width: 767px)');
      setIsMobile(mediaQuery.matches);
    };

    // Initial check
    checkIsMobile();

    // Use ResizeObserver instead of addEventListener for better iOS compatibility
    let resizeObserver: ResizeObserver | null = null;
    
    try {
      if (typeof ResizeObserver !== 'undefined') {
        resizeObserver = new ResizeObserver(() => {
          checkIsMobile();
        });
        
        // Observe the document body for size changes
        if (document.body) {
          resizeObserver.observe(document.body);
        }
      } else {
        // Fallback: simple periodic check without event listeners
        const interval = setInterval(checkIsMobile, 1000);
        return () => clearInterval(interval);
      }
    } catch (error) {
      console.warn('ResizeObserver not available, using fallback');
      // Simple fallback without event listeners
      const interval = setInterval(checkIsMobile, 1000);
      return () => clearInterval(interval);
    }

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, []);

  return isMobile;
}

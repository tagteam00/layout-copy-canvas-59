
import * as React from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Use CSS media query approach without document APIs
    const mediaQuery = matchMedia('(max-width: 767px)');
    
    const checkIsMobile = () => {
      setIsMobile(mediaQuery.matches);
    };

    // Initial check
    checkIsMobile();

    // Listen for changes using MediaQueryList
    const handleChange = (e: MediaQueryListEvent) => {
      setIsMobile(e.matches);
    };

    try {
      mediaQuery.addEventListener('change', handleChange);
    } catch (error) {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    return () => {
      try {
        mediaQuery.removeEventListener('change', handleChange);
      } catch (error) {
        // Fallback for older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  return isMobile;
}

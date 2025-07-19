
import * as React from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    // Use CSS media query approach that's safer for iOS
    const checkIsMobile = () => {
      // Simple viewport width check without window APIs
      const viewportWidth = document.documentElement.clientWidth;
      setIsMobile(viewportWidth < 768);
    };

    // Initial check
    checkIsMobile();

    // Create ResizeObserver for safer resize detection
    const resizeObserver = new ResizeObserver(() => {
      checkIsMobile();
    });

    // Observe the document element
    resizeObserver.observe(document.documentElement);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return isMobile;
}

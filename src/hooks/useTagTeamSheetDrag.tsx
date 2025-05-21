import { useRef } from "react";

export const useTagTeamSheetDrag = (
  setSheetHeight: (height: string) => void,
  onClose: () => void
) => {
  const startY = useRef<number | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  
  // Touch event handlers for custom drag behavior
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startY.current || !drawerRef.current) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;
    
    const windowHeight = window.innerHeight;
    const threshold = windowHeight * 0.25; // 25% threshold
    
    // Dragging down
    if (deltaY > 0) {
      // If dragged more than threshold, prepare to close
      if (deltaY > threshold) {
        setSheetHeight("50%");
      } else {
        // Otherwise keep at 75%
        setSheetHeight("75%");
      }
    } 
    // Dragging up - expand to full screen
    else if (deltaY < -50) {
      setSheetHeight("90%");
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startY.current) return;
    
    const currentY = e.changedTouches[0].clientY;
    const deltaY = currentY - startY.current;
    const windowHeight = window.innerHeight;
    const threshold = windowHeight * 0.25; // 25% threshold
    
    // If dragged more than threshold down, close the drawer
    if (deltaY > threshold) {
      onClose();
    } else if (deltaY < -50) {
      // If dragged significantly upward, expand to full
      setSheetHeight("90%");
    } else {
      // Reset to default height
      setSheetHeight("75%");
    }
    
    startY.current = null;
  };
  
  return {
    drawerRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};

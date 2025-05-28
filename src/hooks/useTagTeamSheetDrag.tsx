
import { useRef } from "react";

export const useTagTeamSheetDrag = (
  setSheetHeight: (height: string) => void,
  onClose: () => void
) => {
  const startY = useRef<number | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  
  // Touch event handlers for custom drag behavior
  const handleTouchStart = (e: React.TouchEvent) => {
    // Only start drag if touch is on header area
    const target = e.target as HTMLElement;
    const isHeaderArea = target.closest('[data-drag-handle]') || target.closest('h1, h2, h3');
    
    if (isHeaderArea || !target.closest('button, [role="button"], input, textarea')) {
      startY.current = e.touches[0].clientY;
      isDragging.current = false;
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!startY.current || !drawerRef.current) return;
    
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;
    
    // Only consider it dragging if moved more than 10px
    if (Math.abs(deltaY) > 10) {
      isDragging.current = true;
    }
    
    if (!isDragging.current) return;
    
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
    
    // Only close or adjust if we were actually dragging
    if (isDragging.current) {
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
    }
    
    startY.current = null;
    isDragging.current = false;
  };
  
  return {
    drawerRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};

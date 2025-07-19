
import { useRef } from "react";

export const useTagTeamSheetDrag = (
  setSheetHeight: (height: string) => void,
  onClose: () => void
) => {
  const startY = useRef<number | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef<boolean>(false);
  
  // iOS-safe touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    try {
      const target = e.target as HTMLElement;
      const isHeaderArea = target.closest('[data-drag-handle]') || target.closest('h1, h2, h3');
      
      if (isHeaderArea || !target.closest('button, [role="button"], input, textarea')) {
        startY.current = e.touches[0].clientY;
        isDragging.current = false;
      }
    } catch (error) {
      console.warn('Touch start error:', error);
    }
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    try {
      if (!startY.current || !drawerRef.current) return;
      
      const currentY = e.touches[0].clientY;
      const deltaY = currentY - startY.current;
      
      if (Math.abs(deltaY) > 10) {
        isDragging.current = true;
      }
      
      if (!isDragging.current) return;
      
      const containerHeight = drawerRef.current.offsetHeight || 600;
      const threshold = containerHeight * 0.25;
      
      if (deltaY > 0) {
        if (deltaY > threshold) {
          setSheetHeight("50%");
        } else {
          setSheetHeight("75%");
        }
      } else if (deltaY < -50) {
        setSheetHeight("90%");
      }
    } catch (error) {
      console.warn('Touch move error:', error);
    }
  };
  
  const handleTouchEnd = (e: React.TouchEvent) => {
    try {
      if (!startY.current || !drawerRef.current) return;
      
      const currentY = e.changedTouches[0].clientY;
      const deltaY = currentY - startY.current;
      const containerHeight = drawerRef.current.offsetHeight || 600;
      const threshold = containerHeight * 0.25;
      
      if (isDragging.current) {
        if (deltaY > threshold) {
          onClose();
        } else if (deltaY < -50) {
          setSheetHeight("90%");
        } else {
          setSheetHeight("75%");
        }
      }
      
      startY.current = null;
      isDragging.current = false;
    } catch (error) {
      console.warn('Touch end error:', error);
    }
  };
  
  return {
    drawerRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};

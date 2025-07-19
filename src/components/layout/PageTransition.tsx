
import { motion } from 'framer-motion';
import React, { useState, useEffect, useRef } from 'react';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isTransitionComplete, setIsTransitionComplete] = useState(false);
  const location = useLocation();
  const mountTimeRef = useRef(Date.now());
  const loadingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const maxLoadingTimeRef = useRef(10000); // 10 seconds max loading time
  
  useEffect(() => {
    // Reset state when location changes
    setIsLoading(true);
    setIsTransitionComplete(false);
    mountTimeRef.current = Date.now();
    
    // Clear any existing timeout
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current);
    }
    
    // Check if this is an initial load or auth route that requires full loading screen
    const requiresFullLoadingScreen = () => {
      // Initial load tracking using React state instead of sessionStorage
      const authRoutes = ['/signin', '/signup', '/onboarding'];
      
      // Check if it's an auth route or initial app load
      if (authRoutes.some(route => location.pathname.includes(route))) {
        return true;
      }
      
      return false;
    };
    
    // Determine if we should show full loading screen or use skeleton loading
    const showFullLoadingScreen = requiresFullLoadingScreen();
    
    // Create loading timeout based on whether it's full loading or regular
    const loadingDuration = showFullLoadingScreen ? 1800 : 600;
    
    // Set loading timeout - this will ensure loading doesn't get stuck forever
    loadingTimeoutRef.current = setTimeout(() => {
      setIsLoading(false);
    }, loadingDuration);
    
    // Safety timeout - ensures loading screen never gets stuck
    const safetyTimeout = setTimeout(() => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
        loadingTimeoutRef.current = null;
      }
      console.log("Safety timeout triggered - forcing loading to complete");
      setIsLoading(false);
    }, maxLoadingTimeRef.current);
    
    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
      clearTimeout(safetyTimeout);
    };
  }, [location.pathname]);

  // Handle transition complete
  const handleAnimationComplete = () => {
    setIsTransitionComplete(true);
  };
  
  return (
    <>
      {isLoading && <LoadingScreen />}
      <motion.div 
        key={location.pathname}
        initial={{
          opacity: 0
        }} 
        animate={{
          opacity: 1
        }} 
        exit={{
          opacity: 0
        }} 
        transition={{
          ease: "easeInOut",
          duration: 0.4
        }}
        onAnimationComplete={handleAnimationComplete}
        className="bg-white"
        style={{ display: isLoading ? 'none' : 'block' }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default PageTransition;

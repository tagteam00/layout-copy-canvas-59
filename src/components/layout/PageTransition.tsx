
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  
  useEffect(() => {
    // Check if this is an initial load, auth route, or requires full loading screen
    const requiresFullLoadingScreen = () => {
      // Initial load or auth-related routes that typically take longer
      const authRoutes = ['/signin', '/signup', '/onboarding'];
      const isInitialLoad = sessionStorage.getItem('initialLoadComplete') !== 'true';
      
      // Check if it's an auth route or initial app load
      if (isInitialLoad || authRoutes.some(route => location.pathname.includes(route))) {
        // Mark initial load as complete
        if (isInitialLoad) {
          sessionStorage.setItem('initialLoadComplete', 'true');
        }
        return true;
      }
      
      return false;
    };
    
    // Determine if we should show full loading screen or use skeleton loading
    const showFullLoadingScreen = requiresFullLoadingScreen();
    
    // Set loading initially
    setIsLoading(true);
    
    let timer;
    if (showFullLoadingScreen) {
      // For initial/auth routes, use the full loading screen with animation cycle
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 1800); // Full loading screen time
    } else {
      // For regular navigation, shorter loading or no loading
      timer = setTimeout(() => {
        setIsLoading(false);
      }, 300); // Much shorter time for regular navigation
    }
    
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <motion.div 
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
          duration: 0.6 // Slower fade in for smoother transition
        }}
        className="bg-white"
        style={{ display: isLoading ? 'none' : 'block' }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default PageTransition;

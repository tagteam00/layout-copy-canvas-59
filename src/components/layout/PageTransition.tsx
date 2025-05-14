
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { useLocation } from 'react-router-dom';
import { toast } from 'sonner';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const location = useLocation();
  
  useEffect(() => {
    console.log(`PageTransition: Starting transition for path ${location.pathname}`);
    
    // Check if this is an initial load, auth route, or requires full loading screen
    const requiresFullLoadingScreen = () => {
      // Initial load or auth-related routes that typically take longer
      const authRoutes = ['/signin', '/signup', '/onboarding'];
      // Mark initial load complete in sessionStorage
      const isInitialLoad = sessionStorage.getItem('initialLoadComplete') !== 'true';
      
      // Check if it's an auth route or initial app load
      if (isInitialLoad || authRoutes.some(route => location.pathname.includes(route))) {
        // Mark initial load as complete
        if (isInitialLoad) {
          sessionStorage.setItem('initialLoadComplete', 'true');
          console.log('PageTransition: Initial app load complete');
        }
        return true;
      }
      
      return false;
    };
    
    // Set error handler for the transition
    const handleError = (error: any) => {
      console.error('PageTransition: Error during page transition:', error);
      setHasError(true);
      setIsLoading(false);
      toast.error('Error loading page. Please try refreshing.');
    };
    
    // Determine if we should show full loading screen or use skeleton loading
    const showFullLoadingScreen = requiresFullLoadingScreen();
    
    // Set loading initially
    setIsLoading(true);
    setHasError(false);
    
    let timer: NodeJS.Timeout;
    
    try {
      // For welcome screen, use a much shorter loading time
      if (location.pathname === '/') {
        console.log('PageTransition: Using shorter loading time for welcome page');
        timer = setTimeout(() => {
          setIsLoading(false);
        }, 500); // Very short time for welcome screen
      }
      else if (showFullLoadingScreen) {
        console.log('PageTransition: Using full loading screen');
        // For initial/auth routes, use the full loading screen with animation cycle
        timer = setTimeout(() => {
          setIsLoading(false);
          console.log('PageTransition: Full loading screen complete');
        }, 1500); // Full loading screen time - reduced from 1800ms
      } else {
        console.log('PageTransition: Using quick transition');
        // For regular navigation, shorter loading or no loading
        timer = setTimeout(() => {
          setIsLoading(false);
          console.log('PageTransition: Quick transition complete');
        }, 300); // Much shorter time for regular navigation
      }
      
      // Failsafe - ensure loading screen eventually disappears even if something goes wrong
      const failsafe = setTimeout(() => {
        if (isLoading) {
          console.warn('PageTransition: Failsafe timer triggered to prevent infinite loading');
          setIsLoading(false);
        }
      }, 3000); // Reduced maximum loading time from 6000ms to 3000ms
      
      return () => {
        clearTimeout(timer);
        clearTimeout(failsafe);
      };
    } catch (error) {
      handleError(error);
      return () => {
        if (timer) clearTimeout(timer);
      };
    }
  }, [location.pathname, isLoading]);

  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-2">Something went wrong</p>
          <button 
            className="px-4 py-2 bg-[#827AFF] text-white rounded-md"
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isLoading && <LoadingScreen maxDisplayTime={3000} />}
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
          duration: 0.3 // Reduced fade in duration for faster transitions
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

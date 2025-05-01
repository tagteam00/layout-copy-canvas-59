
import { motion } from 'framer-motion';
import React, { useState, useEffect } from 'react';
import { LoadingScreen } from '@/components/ui/loading-screen';

interface PageTransitionProps {
  children: React.ReactNode;
}

const PageTransition: React.FC<PageTransitionProps> = ({
  children
}) => {
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Set loading to true on component mount
    setIsLoading(true);
    
    // Use a timer to ensure the loading animation completes at least one cycle
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200); // Slightly longer than the minimum display time in LoadingScreen
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isLoading && <LoadingScreen />}
      <motion.div 
        initial={{
          opacity: 0,
          x: 20
        }} 
        animate={{
          opacity: 1,
          x: 0
        }} 
        exit={{
          opacity: 0,
          x: -20
        }} 
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          duration: 0.3
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


import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Confetti } from "@/components/ui/confetti";

interface CelebrationStripProps {
  className?: string;
  showConfetti?: boolean;
}

export const CelebrationStrip: React.FC<CelebrationStripProps> = ({ 
  className = "",
  showConfetti = false
}) => {
  const messages = ["Congratulations", "You have Crushed your goal"];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [confettiActive, setConfettiActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2500); // Change message every 2.5 seconds

    return () => clearInterval(interval);
  }, [messages.length]);

  // Trigger confetti when celebration strip appears and should show confetti
  useEffect(() => {
    if (showConfetti) {
      setConfettiActive(true);
      // Turn off confetti after 6 seconds to match duration
      const timeout = setTimeout(() => {
        setConfettiActive(false);
      }, 6000);
      
      return () => clearTimeout(timeout);
    }
  }, [showConfetti]);

  const stripVariants = {
    initial: { opacity: 0, height: 0 },
    animate: { 
      opacity: 1, 
      height: 40,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  const textVariants = {
    initial: { 
      opacity: 0, 
      y: 20,
      scale: 0.9
    },
    animate: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      scale: 0.9,
      transition: {
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <>
      {/* Confetti behind the celebration strip */}
      {showConfetti && (
        <Confetti 
          active={confettiActive} 
          duration={6}
        />
      )}
      
      <motion.div
        className={`w-full h-10 bg-gradient-to-r from-[#8CFF6E] to-[#827AFF] flex items-center justify-center overflow-hidden relative z-10 ${className}`}
        variants={stripVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={currentMessageIndex}
            className="text-white font-bold text-sm text-center px-4"
            variants={textVariants}
            initial="initial"
            animate="animate"
            exit="exit"
          >
            {messages[currentMessageIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.div>
    </>
  );
};

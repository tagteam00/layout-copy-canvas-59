
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CelebrationStripProps {
  className?: string;
}

export const CelebrationStrip: React.FC<CelebrationStripProps> = ({ className = "" }) => {
  const messages = ["Congratulations", "You have Crushed your goal"];
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2500); // Change message every 2.5 seconds

    return () => clearInterval(interval);
  }, [messages.length]);

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
    <motion.div
      className={`w-full h-10 bg-gradient-to-r from-[#8CFF6E] to-[#827AFF] rounded-t-2xl flex items-center justify-center overflow-hidden ${className}`}
      variants={stripVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={currentMessageIndex}
          className="text-white font-bold text-sm text-center"
          variants={textVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          {messages[currentMessageIndex]}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
};

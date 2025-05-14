import React, { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  className?: string;
  minDisplayTime?: number; // Minimum time to display in ms
  maxDisplayTime?: number; // Maximum time to display before force complete
}

export const LoadingScreen = ({
  className,
  minDisplayTime = 1000, // Default minimum display time
  maxDisplayTime = 10000, // Default maximum display time (10 seconds)
}: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const startTimeRef = useRef<number>(Date.now());
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const forceCompleteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    startTimeRef.current = Date.now();
    
    // Simulate loading progress with increasing speed as time passes
    progressIntervalRef.current = setInterval(() => {
      setProgress((prevProgress) => {
        // Speed up progress as we approach 100%
        const elapsedTime = Date.now() - startTimeRef.current;
        const speedFactor = Math.min(1.5, 1 + (elapsedTime / 5000)); // Speed up over time
        const increment = 3 * speedFactor;
        
        const next = prevProgress + increment;
        return next > 100 ? 100 : next;
      });
    }, 60);

    // Safety mechanism: force complete after maxDisplayTime
    forceCompleteTimeoutRef.current = setTimeout(() => {
      console.log("Force completing loading due to timeout");
      setProgress(100);
      
      // Add small delay before hiding to ensure smooth transition
      setTimeout(() => setVisible(false), 200);
    }, maxDisplayTime);

    // Ensure the animation completes when progress hits 100
    const minTimeCheck = setTimeout(() => {
      const elapsedTime = Date.now() - startTimeRef.current;
      
      if (elapsedTime >= minDisplayTime && progress >= 100) {
        clearInterval(progressIntervalRef.current!);
        setVisible(false);
      }
    }, minDisplayTime);

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (forceCompleteTimeoutRef.current) clearTimeout(forceCompleteTimeoutRef.current);
      clearTimeout(minTimeCheck);
    };
  }, [progress, minDisplayTime, maxDisplayTime]);

  // Check progress and complete when reaching 100%
  useEffect(() => {
    if (progress >= 100) {
      const elapsedTime = Date.now() - startTimeRef.current;
      
      // If min display time has passed, complete immediately
      if (elapsedTime >= minDisplayTime) {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setVisible(false);
      } 
      // Otherwise wait for min display time to complete
      else {
        const remainingTime = minDisplayTime - elapsedTime;
        setTimeout(() => {
          setVisible(false);
        }, remainingTime);
      }
    }
  }, [progress, minDisplayTime]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Progress circle */}
        <div 
          className="w-20 h-20 rounded-full bg-[#827AFF]/20 animate-pulse"
          style={{
            animation: "pulse 2.5s ease-in-out infinite",
          }}
        >
          <div 
            className="absolute inset-0 w-20 h-20 rounded-full border-4 border-[#827AFF]/40"
            style={{
              animation: "breathe 2.5s ease-in-out infinite"
            }}
          />
        </div>
      </div>

      {/* Progress indicator */}
      <div className="w-32 h-1.5 bg-gray-200 rounded-full mt-8 overflow-hidden">
        <div 
          className="h-full bg-[#827AFF] rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      <p className="text-gray-600 text-sm font-medium mt-4">Loading tagteam</p>

      {/* Custom CSS for the breathing animation using standard style tag */}
      <style>
        {`
          @keyframes breathe {
            0%, 100% { transform: scale(0.9); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
          }
          
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.15); }
          }
        `}
      </style>
    </div>
  );
};

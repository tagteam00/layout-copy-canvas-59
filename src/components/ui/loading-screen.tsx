
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  className?: string;
  minDisplayTime?: number; // Minimum time to display in ms
  maxDisplayTime?: number; // Maximum time to display before force complete
}

export const LoadingScreen = ({
  className,
  minDisplayTime = 800, // Reduced minimum display time from 1500ms
  maxDisplayTime = 3000, // Reduced maximum display time from 5000ms
}: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Track if component is mounted to prevent state updates after unmount
    let isMounted = true;
    console.log("LoadingScreen mounted, starting progress");
    
    // Record start time for minimum display calculation
    const startTime = Date.now();
    
    // Simulate loading progress - faster progression
    const interval = setInterval(() => {
      if (isMounted) {
        setProgress((prevProgress) => {
          const next = prevProgress + 8; // Doubled speed from 4 to 8
          return next > 100 ? 100 : next;
        });
      }
    }, 40); // More frequent updates (from 50ms to 40ms)

    // Force completion after maxDisplayTime
    const maxTimer = setTimeout(() => {
      if (isMounted) {
        console.log("LoadingScreen force completing due to max time reached");
        setProgress(100);
        setVisible(false);
      }
    }, maxDisplayTime);

    // Ensure the animation completes at least after minimum time
    const minTimer = setTimeout(() => {
      if (isMounted && progress >= 100) {
        console.log("LoadingScreen completing after minimum display time");
        setVisible(false);
      }
    }, minDisplayTime);

    // Check progress and hide loading screen once complete and min time passed
    const progressCheckTimer = setInterval(() => {
      if (isMounted && progress >= 95) { // Reduced threshold from 100 to 95
        console.log("LoadingScreen progress complete, checking minimum time");
        const timeElapsed = Date.now() - startTime;
        if (timeElapsed >= minDisplayTime) {
          clearInterval(progressCheckTimer);
          setVisible(false);
        }
      }
    }, 50);

    // Super failsafe - make sure to complete after 2x maxDisplayTime
    const superFailsafe = setTimeout(() => {
      if (isMounted && visible) {
        console.warn("LoadingScreen super failsafe triggered");
        setVisible(false);
      }
    }, maxDisplayTime * 2);

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearInterval(progressCheckTimer);
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      clearTimeout(superFailsafe);
      console.log("LoadingScreen unmounted, cleanup complete");
    };
  }, [minDisplayTime, maxDisplayTime, progress]);

  // Listen for progress reaching 100% and handle completion after min time
  useEffect(() => {
    if (progress >= 95) { // Reduced threshold from 100 to 95
      console.log("LoadingScreen progress reached threshold, preparing to complete");
    }
  }, [progress]);

  if (!visible) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Circle that grows and shrinks with easing */}
        <div 
          className="w-16 h-16 rounded-full bg-[#827AFF]/20 animate-pulse" // Reduced size from 20 to 16
          style={{
            animation: "pulse 1.5s ease-in-out infinite", // Faster animation
          }}
        >
          <div 
            className="absolute inset-0 w-16 h-16 rounded-full border-4 border-[#827AFF]/40" // Reduced size from 20 to 16
            style={{
              animation: "breathe 1.5s ease-in-out infinite" // Faster animation
            }}
          />
        </div>
      </div>
      <p className="text-gray-600 text-sm font-medium mt-6">Almost there</p> {/* Changed text and reduced margin */}
      <div className="w-40 bg-gray-200 rounded-full h-1.5 mt-3"> {/* Reduced width and margin */}
        <div 
          className="bg-[#827AFF] h-1.5 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

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

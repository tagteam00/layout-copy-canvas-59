
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  className?: string;
  minDisplayTime?: number; // Minimum time to display in ms
  maxDisplayTime?: number; // Maximum time to display before force complete
}

export const LoadingScreen = ({
  className,
  minDisplayTime = 1500, // Default minimum display time
  maxDisplayTime = 5000, // Default maximum display time - force complete after 5s
}: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Track if component is mounted to prevent state updates after unmount
    let isMounted = true;
    console.log("LoadingScreen mounted, starting progress");
    
    // Simulate loading progress
    const interval = setInterval(() => {
      if (isMounted) {
        setProgress((prevProgress) => {
          const next = prevProgress + 4; // Slightly faster progress increase
          return next > 100 ? 100 : next;
        });
      }
    }, 50); // More frequent updates for smoother progress

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
      if (isMounted && progress >= 100) {
        console.log("LoadingScreen progress complete, checking minimum time");
        const timeElapsed = Date.now() - startTime;
        if (timeElapsed >= minDisplayTime) {
          clearInterval(progressCheckTimer);
          setVisible(false);
        }
      }
    }, 100);

    // Record start time for minimum display calculation
    const startTime = Date.now();

    return () => {
      isMounted = false;
      clearInterval(interval);
      clearInterval(progressCheckTimer);
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
      console.log("LoadingScreen unmounted, cleanup complete");
    };
  }, [minDisplayTime, maxDisplayTime]);

  // Listen for progress reaching 100% and handle completion after min time
  useEffect(() => {
    if (progress >= 100) {
      console.log("LoadingScreen progress reached 100%, preparing to complete");
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
        {/* Circle that grows and shrinks with easing */}
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
      <p className="text-gray-600 text-sm font-medium mt-8">Hang on a little</p>
      <div className="w-48 bg-gray-200 rounded-full h-1.5 mt-4">
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


import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  className?: string;
  minDisplayTime?: number; // Minimum time to display in ms
}

export const LoadingScreen = ({
  className,
  minDisplayTime = 1500, // Increased default minimum display time
}: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const next = prevProgress + 3; // Slower progress increase
        return next > 100 ? 100 : next;
      });
    }, 60); // Slower interval

    // Ensure the animation completes at least one cycle
    const timer = setTimeout(() => {
      if (progress >= 100) {
        clearInterval(interval);
        setVisible(false);
      }
    }, minDisplayTime);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
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

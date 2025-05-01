
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface LoadingScreenProps {
  className?: string;
  minDisplayTime?: number; // Minimum time to display in ms
}

export const LoadingScreen = ({
  className,
  minDisplayTime = 1000, // Default minimum display time: 1 second
}: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        const next = prevProgress + 5;
        return next > 100 ? 100 : next;
      });
    }, 50);

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
      <div className="w-24 h-24 mb-8 relative">
        <div className="absolute inset-0 rounded-full border-4 border-[#827AFF]/20"></div>
        <div
          className="absolute inset-0 rounded-full border-4 border-t-[#827AFF] animate-spin"
          style={{ animationDuration: "1.5s" }}
        ></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 bg-[#8CFF6E] rounded-full opacity-60 animate-pulse"></div>
        </div>
      </div>
      <div className="w-64 mb-4">
        <Progress value={progress} className="h-1 bg-gray-100" />
      </div>
      <p className="text-gray-600 text-sm font-medium">Loading your experience...</p>
    </div>
  );
};

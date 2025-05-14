
import React from "react";

export const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center p-8">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 rounded-full bg-[#827AFF]/20 mb-2"></div>
        <p className="text-gray-500">Loading your tagteams...</p>
      </div>
    </div>
  );
};

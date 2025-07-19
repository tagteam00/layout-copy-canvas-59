
import React from "react";
import { TimerUrgency } from "@/types/tagteam";

interface UserStatusSectionProps {
  firstUser: {
    name: string;
    status: "completed" | "pending";
    instagramHandle?: string;
  };
  secondUser: {
    name: string;
    status: "completed" | "pending";
    instagramHandle?: string;
  };
  timer: {
    timeString: string;
    urgency: TimerUrgency;
  };
  timerColorClass: string;
}

export const UserStatusSection: React.FC<UserStatusSectionProps> = ({
  firstUser,
  secondUser,
  timer,
  timerColorClass
}) => {
  // Get the first name only for display
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  return (
    <div className="flex justify-between items-start mb-4">
      {/* First User - Left aligned */}
      <div className="flex flex-col items-start space-y-2 max-w-[30%]">
        <span className="text-[16px] font-medium text-gray-800 text-left truncate w-full">
          {getFirstName(firstUser.name)}
        </span>
        <span className={`py-1 px-3 rounded-full text-sm font-medium ${
          firstUser.status === "completed" 
            ? "bg-[#DCFFDC] text-green-700" 
            : "bg-[#FFE8CC] text-amber-700"
        }`}>
          {firstUser.status === "completed" ? "Completed" : "Pending"}
        </span>
      </div>

      {/* Reset Timer - simplified */}
      <div className="flex flex-col items-center space-y-1">
        <span className="text-[14px] text-gray-600">
          Resets in:
        </span>
        <span className={`text-[16px] font-medium ${timerColorClass}`}>
          {timer.timeString}
        </span>
      </div>

      {/* Second User - Right aligned */}
      <div className="flex flex-col items-end space-y-2 max-w-[30%]">
        <span className="text-[16px] font-medium text-gray-800 text-right truncate w-full">
          {getFirstName(secondUser.name)}
        </span>
        <span className={`py-1 px-3 rounded-full text-sm font-medium ${
          secondUser.status === "completed" 
            ? "bg-[#DCFFDC] text-green-700" 
            : "bg-[#FFE8CC] text-amber-700"
        }`}>
          {secondUser.status === "completed" ? "Completed" : "Pending"}
        </span>
      </div>
    </div>
  );
};

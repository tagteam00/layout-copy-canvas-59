
import React from "react";
import { Clock } from "lucide-react";
import { TimerUrgency } from "@/types/tagteam";

interface UserStatusSectionProps {
  firstUser: {
    name: string;
    status: "completed" | "pending";
  };
  secondUser: {
    name: string;
    status: "completed" | "pending";
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
    if (!fullName) return "User";
    return fullName.split(' ')[0];
  };

  return (
    <div className="flex justify-between items-start mb-4">
      {/* First User */}
      <div className="flex flex-col items-center space-y-2">
        <span className="text-[16px] font-medium text-gray-800 text-center truncate max-w-[100px]">
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

      {/* Timer - Simplified */}
      <div className="flex flex-col items-center space-y-2">
        <span className={`text-[16px] font-medium ${timerColorClass} flex items-center gap-1`}>
          <Clock className="h-4 w-4" /> {timer.timeString}
        </span>
      </div>

      {/* Second User */}
      <div className="flex flex-col items-center space-y-2">
        <span className="text-[16px] font-medium text-gray-800 text-center truncate max-w-[100px]">
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


import React from "react";
import { useTagTeamTimer } from "@/hooks/useTagTeamTimer";

interface TagTeamCardProps {
  name: string;
  firstUser: {
    name: string;
    status: "completed" | "pending";
  };
  secondUser: {
    name: string;
    status: "completed" | "pending";
  };
  resetTime?: string;
  interest: string;
  frequency: string;
  resetDay?: string;
  onClick?: () => void;
}

export const TagTeamCard: React.FC<TagTeamCardProps> = ({
  name,
  firstUser,
  secondUser,
  interest,
  frequency,
  resetDay,
  onClick
}) => {
  // Function to get first name
  const getFirstName = (fullName: string): string => {
    return fullName.split(' ')[0];
  };

  // Use the timer hook instead of internal state
  const { timer, timerColorClass } = useTagTeamTimer(frequency, resetDay);

  return <div onClick={onClick} className="w-full rounded-2xl border border-[#E5DEFF] p-4 cursor-pointer hover:shadow-md transition-shadow bg-slate-50">
      {/* Header Section */}
      <h3 className="text-center text-[20px] text-[#827AFF] mb-3 truncate font-extrabold">
        {name}
      </h3>

      {/* User Status Section */}
      <div className="flex justify-between items-start mb-4">
        {/* First User - Left aligned */}
        <div className="flex flex-col items-start space-y-2 max-w-[30%]">
          <span className="text-[16px] font-medium text-gray-800 text-left truncate w-full">
            {getFirstName(firstUser.name)}
          </span>
          <span className={`py-1 px-2 rounded-full text-xs font-medium ${firstUser.status === "completed" ? "bg-[#DCFFDC] text-green-700" : "bg-[#FFE8CC] text-amber-700"}`}>
            {firstUser.status === "completed" ? "Completed" : "Pending"}
          </span>
        </div>

        {/* Reset Timer - simplified */}
        <div className="flex flex-col items-center">
          <span className="text-[13px] text-gray-600">
            Resets:
          </span>
          <span className={`text-[15px] font-medium ${timerColorClass}`}>
            {timer.timeString}
          </span>
        </div>

        {/* Second User - Right aligned */}
        <div className="flex flex-col items-end space-y-2 max-w-[30%]">
          <span className="text-[16px] font-medium text-gray-800 text-right truncate w-full">
            {getFirstName(secondUser.name)}
          </span>
          <span className={`py-1 px-2 rounded-full text-xs font-medium ${secondUser.status === "completed" ? "bg-[#DCFFDC] text-green-700" : "bg-[#FFE8CC] text-amber-700"}`}>
            {secondUser.status === "completed" ? "Completed" : "Pending"}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[#E0E0E0] my-3"></div>

      {/* Information Section - Simplify for mobile */}
      <div className="flex flex-wrap justify-between items-center text-sm">
        <div>
          <span className="text-gray-600">Interest: </span>
          <span className="font-medium text-gray-800 truncate">{interest}</span>
        </div>
        <div>
          <span className="text-gray-600">Freq: </span>
          <span className="font-medium text-gray-800">{frequency}</span>
        </div>
      </div>
    </div>;
};

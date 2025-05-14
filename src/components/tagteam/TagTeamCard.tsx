
import React from "react";
import { Clock } from "lucide-react";
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
      <h3 className="text-center text-[20px] text-[#827AFF] mb-4 truncate font-extrabold">
        {name}
      </h3>

      {/* User Status Section */}
      <div className="flex justify-between items-start mb-4">
        {/* First User */}
        <div className="flex flex-col items-center space-y-2">
          <span className="text-[16px] font-medium text-gray-800 text-center truncate max-w-[100px]">
            {getFirstName(firstUser.name)}
          </span>
          <span className={`py-1 px-3 rounded-full text-sm font-medium ${firstUser.status === "completed" ? "bg-[#DCFFDC] text-green-700" : "bg-[#FFE8CC] text-amber-700"}`}>
            {firstUser.status === "completed" ? "Completed" : "Pending"}
          </span>
        </div>

        {/* Reset Timer */}
        <div className="flex flex-col items-center space-y-2">
          <span className="text-[14px] text-gray-600 flex items-center gap-1">
            <Clock className="w-4 h-4" /> Resets in:
          </span>
          <span className={`text-[16px] font-medium ${timerColorClass}`}>
            {timer.timeString}
          </span>
        </div>

        {/* Second User */}
        <div className="flex flex-col items-center space-y-2">
          <span className="text-[16px] font-medium text-gray-800 text-center truncate max-w-[100px]">
            {getFirstName(secondUser.name)}
          </span>
          <span className={`py-1 px-3 rounded-full text-sm font-medium ${secondUser.status === "completed" ? "bg-[#DCFFDC] text-green-700" : "bg-[#FFE8CC] text-amber-700"}`}>
            {secondUser.status === "completed" ? "Completed" : "Pending"}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[#E0E0E0] my-4"></div>

      {/* Information Section */}
      <div className="flex flex-wrap justify-between items-center">
        <div className="mb-2 sm:mb-0">
          <span className="text-[14px] text-gray-600">Tagteam's Interest: </span>
          <span className="text-[14px] font-medium text-gray-800">{interest}</span>
        </div>
        <div>
          <span className="text-[14px] text-gray-600">Frequency: </span>
          <span className="text-[14px] font-medium text-gray-800">{frequency}</span>
        </div>
      </div>
    </div>;
};


import React from "react";

interface TeamInfoSectionProps {
  interest: string;
  frequency: string;
}

export const TeamInfoSection: React.FC<TeamInfoSectionProps> = ({
  interest,
  frequency
}) => {
  return (
    <div className="flex flex-wrap justify-between items-center border-t border-[#E0E0E0] pt-4 mb-4">
      <div className="mb-2 sm:mb-0">
        <span className="text-[14px] text-gray-600">Tagteam's Interest: </span>
        <span className="text-[14px] font-medium text-gray-800">{interest}</span>
      </div>
      <div>
        <span className="text-[14px] text-gray-600">Frequency: </span>
        <span className="text-[14px] font-medium text-gray-800">{frequency}</span>
      </div>
    </div>
  );
};

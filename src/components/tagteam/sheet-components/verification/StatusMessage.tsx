
import React from "react";

interface StatusMessageProps {
  partnerFirstName: string;
  hasLoggedActivity: boolean;
  frequencyText: string;
  userLoggedStatus?: "completed" | "pending";
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  partnerFirstName,
  hasLoggedActivity,
  frequencyText,
  userLoggedStatus
}) => {
  if (hasLoggedActivity && userLoggedStatus) {
    return (
      <div className="text-center mb-4">
        <div className={`py-3 px-4 rounded-lg ${
          userLoggedStatus === "completed" 
            ? "bg-[#DCFFDC] text-green-700" 
            : "bg-[#FFDFDF] text-red-700"
        }`}>
          <p className="text-[16px] font-medium">
            You have marked "{userLoggedStatus === "completed" ? "Completed" : "Pending"}" for today
          </p>
        </div>
      </div>
    );
  }

  return (
    <p className="text-center text-[16px] font-medium mb-4">
      Has {partnerFirstName} completed his {frequencyText} goal?
    </p>
  );
};

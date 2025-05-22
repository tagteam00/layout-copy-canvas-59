
import React from "react";

interface StatusMessageProps {
  partnerFirstName: string;
  hasLoggedActivity: boolean;
  frequencyText: string;
}

export const StatusMessage: React.FC<StatusMessageProps> = ({
  partnerFirstName,
  hasLoggedActivity,
  frequencyText
}) => {
  return (
    <>
      <p className="text-center text-[16px] font-medium mb-4">
        Has {partnerFirstName} completed his {frequencyText} goal?
      </p>
      
      {hasLoggedActivity && (
        <p className="text-center text-gray-500 text-sm mt-3">
          You've already verified {partnerFirstName}'s status for this cycle.
        </p>
      )}
    </>
  );
};

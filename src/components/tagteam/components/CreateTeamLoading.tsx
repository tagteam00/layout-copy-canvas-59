
import React from "react";

export const CreateTeamLoading: React.FC = () => {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-3/4"></div>
      <div className="h-32 bg-gray-200 rounded"></div>
    </div>
  );
};

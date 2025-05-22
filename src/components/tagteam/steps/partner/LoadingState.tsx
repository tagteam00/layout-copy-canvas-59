
import React from "react";

export const LoadingState: React.FC = () => {
  return (
    <div className="animate-pulse space-y-2">
      {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>)}
    </div>
  );
};

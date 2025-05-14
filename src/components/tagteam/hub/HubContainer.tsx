
import React from "react";

interface HubContainerProps {
  children: React.ReactNode;
}

export const HubContainer: React.FC<HubContainerProps> = ({ children }) => {
  return (
    <div className="max-w-[480px] w-full mx-auto px-4">
      {children}
    </div>
  );
};

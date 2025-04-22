
import React from "react";

interface AddTeamButtonProps {
  onClick: () => void;
}

export const AddTeamButton: React.FC<AddTeamButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-24 right-8 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[rgba(130,122,255,0.5)] rounded-full z-40"
      aria-label="Add new team"
    >
      <img
        src="https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/bea0f471f017ad178f3f2fa28fa2fd6da8b01480?placeholderIfAbsent=true"
        alt="Add new team"
        className="aspect-[1] object-contain w-14"
      />
    </button>
  );
};

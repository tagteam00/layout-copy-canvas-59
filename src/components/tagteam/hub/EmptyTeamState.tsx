
import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

interface EmptyTeamStateProps {
  onAddTeam?: () => void;
  userName?: string;
}

export const EmptyTeamState: React.FC<EmptyTeamStateProps> = ({ 
  onAddTeam, 
  userName 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="w-full max-w-[280px] mx-auto">
        <AspectRatio ratio={16 / 9}>
          <img 
            src="/lovable-uploads/6834f7c6-308c-44b6-833b-6bca71374722.png" 
            alt="People collaborating" 
            className="w-full h-full object-scale-down"
          />
        </AspectRatio>
      </div>
      <div
        style={{
          fontFamily: "Hanken Grotesk, sans-serif"
        }}
        className="text-base text-gray-700 text-center mt-6 mb-6 px-4"
      >
        {userName
          ? `${userName}, people are out-there to team up with you`
          : `People are out-there to team up with you`}
      </div>
      <Button
        style={{
          height: 56,
          fontSize: 18
        }}
        onClick={onAddTeam}
        size="lg"
        className="w-full max-w-[448px] text-base font-semibold bg-black text-white rounded-xl"
      >
        Start your first tagteam
      </Button>
    </div>
  );
};


import React from "react";
import { AspectRatio } from "@/components/ui/aspect-ratio";

export const EmptyTeamState: React.FC = () => {
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
      <p className="text-center text-gray-600 mt-6 italic my-0">
        You don't seem to be in any tagteam,
        Your next tagteam is just a click away.
      </p>
    </div>
  );
};


import React from "react";
import { Badge } from "@/components/ui/badge";

interface TagTeamCardProps {
  name: string;
  category: string;
  timeLeft: string;
  frequency: string;
  members: string;
}

export const TagTeamCard: React.FC<TagTeamCardProps> = ({
  name,
  category,
  timeLeft,
  frequency,
  members,
}) => {
  return (
    <div className="border w-full mt-4 p-3 rounded-xl border-[rgba(130,122,255,0.41)] border-solid">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h3 className="text-xl font-bold whitespace-nowrap">{name}</h3>
          <Badge variant="secondary" className="whitespace-nowrap">
            {category}
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="ghost" className="whitespace-nowrap">
            {timeLeft}
          </Badge>
          <div className="text-xs text-[rgba(116,116,116,1)] whitespace-nowrap">
            {frequency}
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-between mt-[11px]">
        <div className="text-sm">{members}</div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/e5f91170adad06de08b3da90b3e19dabe3e3f5a4?placeholderIfAbsent=true"
          alt="Action buttons"
          className="w-12 object-contain"
        />
      </div>
    </div>
  );
};

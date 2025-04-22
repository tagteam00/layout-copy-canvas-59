import React from "react";
import { Badge } from "@/components/ui/Badge";

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
      <div className="flex w-full gap-[4px_124px]">
        <div className="flex items-center gap-2.5">
          <h3 className="self-stretch gap-2.5 text-xl font-bold my-auto">
            {name}
          </h3>
          <Badge variant="secondary" className="whitespace-nowrap my-auto">
            {category}
          </Badge>
        </div>
        <Badge variant="ghost" className="flex-1 shrink basis-[0%]">
          {timeLeft}
        </Badge>
        <div className="self-stretch gap-2.5 text-xs text-[rgba(116,116,116,1)] font-normal whitespace-nowrap leading-none">
          {frequency}
        </div>
      </div>
      <div className="flex w-full items-center gap-[40px_100px] text-sm font-normal justify-between mt-[11px]">
        <div className="self-stretch gap-2.5 my-auto">{members}</div>
        <img
          src="https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/e5f91170adad06de08b3da90b3e19dabe3e3f5a4?placeholderIfAbsent=true"
          alt="Action buttons"
          className="aspect-[2] object-contain w-12 self-stretch shrink-0 my-auto"
        />
      </div>
    </div>
  );
};

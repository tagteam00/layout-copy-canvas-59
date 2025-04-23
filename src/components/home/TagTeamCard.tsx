
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface TagTeamCardProps {
  name: string;
  category: string;
  timeLeft: string;
  frequency: string;
  members: string;
  isLogged?: boolean;
  partnerLogged?: boolean;
}

export const TagTeamCard: React.FC<TagTeamCardProps> = ({
  name,
  category,
  timeLeft,
  frequency,
  members,
  isLogged = false,
  partnerLogged = false,
}) => {
  return (
    <div className="border w-full mt-4 p-4 rounded-xl border-[rgba(130,122,255,0.41)] border-solid">
      <div className="flex w-full items-center justify-between mb-3">
        <h3 className="text-xl font-bold truncate mr-2">{name}</h3>
        <Badge variant="secondary" className="shrink-0">
          {category}
        </Badge>
      </div>

      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`p-1 rounded-full ${isLogged ? 'bg-[#8CFF6E]/20' : 'bg-gray-100'}`}>
              {isLogged ? (
                <Check className="w-4 h-4 text-[#8CFF6E]" />
              ) : (
                <X className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <div className={`p-1 rounded-full ${partnerLogged ? 'bg-[#8CFF6E]/20' : 'bg-gray-100'}`}>
              {partnerLogged ? (
                <Check className="w-4 h-4 text-[#8CFF6E]" />
              ) : (
                <X className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
          <div className="text-xs text-[rgba(116,116,116,1)]">
            {frequency}
          </div>
        </div>
        <Badge variant="outline" className="whitespace-nowrap">
          {timeLeft}
        </Badge>
      </div>

      <div className="text-sm text-gray-600 mt-2">{members}</div>
    </div>
  );
};


import React from "react";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface TagTeamCardProps {
  name: string;
  category: string;
  timeLeft: string;
  frequency: string;
  members: string;
  partnerName?: string;
  isLogged?: boolean;
  partnerLogged?: boolean;
}

export const TagTeamCard: React.FC<TagTeamCardProps> = ({
  name,
  category,
  timeLeft,
  frequency,
  members,
  partnerName,
  isLogged = false,
  partnerLogged = false,
}) => {
  return (
    <div className="border w-full mt-4 p-4 rounded-xl border-[rgba(130,122,255,0.41)] border-solid flex flex-col gap-2" style={{boxShadow: '0 1px 5px rgba(130,122,255,0.05)'}}>
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold truncate mr-2">{name}</h3>
          <Badge className="bg-[#8CFF6E] text-black font-semibold px-3 py-0.5 rounded-full">{category}</Badge>
        </div>
        <div className="ml-2 text-base">{timeLeft}</div>
      </div>
      <div className="text-gray-400 mb-2">{frequency}</div>
      <div className="flex items-center justify-between">
        <div className="text-md text-black font-semibold">{members}</div>
        <div className="flex items-center gap-2">
          <div className={`p-1 rounded-full border border-gray-300 ${isLogged ? 'bg-[#8CFF6E]' : 'bg-white'}`}>
            {isLogged ? (
              <Check className="w-5 h-5 text-white" />
            ) : (
              <Check className="w-5 h-5 text-gray-400" />
            )}
          </div>
          <div className={`p-1 rounded-full border border-gray-300 ${partnerLogged ? 'bg-[#8CFF6E]' : 'bg-white'}`}>
            {partnerLogged ? (
              <Check className="w-5 h-5 text-white" />
            ) : (
              <Check className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

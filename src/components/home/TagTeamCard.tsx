
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface TagTeamCardProps {
  id: string;
  name: string;
  category: string;
  timeLeft: string;
  frequency: string;
  members: string[]; // always an array
  partnerId?: string;
  partnerName?: string;
  isLogged?: boolean;
  partnerLogged?: boolean;
  memberNames?: string[]; // [self, partner]
  memberInitials?: string[]; // [self, partner]
  onCardClick?: () => void;
}

const getInitials = (name: string) => {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
};

export const TagTeamCard: React.FC<TagTeamCardProps> = ({
  name,
  category,
  timeLeft,
  frequency,
  members = [],
  memberNames,
  memberInitials,
  isLogged = false,
  partnerLogged = false,
  onCardClick,
}) => {
  // Assume memberNames [user, partner], fallback to member id/initials if not provided
  let displayNames = memberNames?.length === 2 ? memberNames : members;
  let initialsArray = memberInitials 
    ? memberInitials 
    : displayNames.map((n) => getInitials(n));

  return (
    <div 
      className="border border-[rgba(130,122,255,0.41)] rounded-2xl p-4 w-full flex flex-col gap-2 cursor-pointer bg-white"
      style={{ boxShadow: "0 1px 5px rgba(130,122,255,0.05)" }}
      onClick={onCardClick}
    >
      {/* Avatars Row */}
      <div className="flex items-center mb-1 relative" style={{ height: 40 }}>
        <div className="flex -space-x-2">
          <div className="relative z-10">
            <Avatar className="h-8 w-8 border-2 border-white bg-[#FFD6D6]">
              <AvatarFallback className="bg-[#FFD6D6] text-xs font-bold">{initialsArray[0] ?? "A"}</AvatarFallback>
            </Avatar>
          </div>
          <div className="relative z-0">
            <Avatar className="h-8 w-8 border-2 border-white bg-[#BFE7FD]">
              <AvatarFallback className="bg-[#BFE7FD] text-xs font-bold">{initialsArray[1] ?? "B"}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      {/* Core Info Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-2xl font-bold truncate mr-2">{name}</h3>
          <Badge className="bg-[#8CFF6E] text-black font-semibold px-3 py-0.5 rounded-full">{category}</Badge>
        </div>
        <div className="ml-2 text-base">{timeLeft}</div>
      </div>
      <div className="text-gray-400 text-base">{frequency}</div>
      {/* Activity Pills Row */}
      <div className="flex mt-1 gap-4">
        <div
          className={`flex-1 rounded-[18px] py-2 text-center font-semibold text-lg transition-all`}
          style={{
            background: isLogged ? "#8CFF6E" : "#FEC6A1",
            color: "#161616",
            boxShadow: isLogged
              ? "0 0 0 2px #c7eec6"
              : "0 0 0 2px #ffe7d6",
            border: isLogged ? "1.5px solid #8CFF6E" : "1.5px solid #FEC6A1",
          }}
        >
          {displayNames[0]}
        </div>
        <div
          className={`flex-1 rounded-[18px] py-2 text-center font-semibold text-lg transition-all`}
          style={{
            background: partnerLogged ? "#8CFF6E" : "#FEC6A1",
            color: "#161616",
            boxShadow: partnerLogged
              ? "0 0 0 2px #c7eec6"
              : "0 0 0 2px #ffe7d6",
            border: partnerLogged ? "1.5px solid #8CFF6E" : "1.5px solid #FEC6A1",
          }}
        >
          {displayNames[1] ?? ""}
        </div>
      </div>
    </div>
  );
};

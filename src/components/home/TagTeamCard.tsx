
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
  memberNames?: [string, string]; // Tuple for [self, partner]
  memberInitials?: [string, string]; // Tuple for [self, partner]
  memberAvatars?: [string | null, string | null]; // URLs for avatars
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
  memberNames = ["", ""],
  memberInitials,
  memberAvatars = [null, null],
  isLogged = false,
  partnerLogged = false,
  onCardClick,
}) => {
  // Use provided initials or generate them from names
  const initialsArray: [string, string] = memberInitials || 
    (memberNames.map(getInitials) as [string, string]);

  return (
    <div 
      className="border border-[rgba(130,122,255,0.41)] rounded-2xl p-4 w-full flex flex-col gap-3 cursor-pointer bg-white"
      style={{ boxShadow: "0 1px 5px rgba(130,122,255,0.05)" }}
      onClick={onCardClick}
    >
      {/* Row 1: Avatars */}
      <div className="flex items-center mb-1">
        <div className="flex -space-x-2">
          {memberAvatars.map((avatarUrl, index) => (
            <Avatar key={index} className="h-10 w-10 border-2 border-white">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={`${memberNames[index]} avatar`} />
              ) : (
                <AvatarFallback 
                  className={`${index === 0 ? 'bg-[#FFD6D6]' : 'bg-[#BFE7FD]'} text-sm font-bold`}
                >
                  {initialsArray[index]}
                </AvatarFallback>
              )}
            </Avatar>
          ))}
        </div>
      </div>
      
      {/* Row 2: Team Name, Category, Time Left */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 max-w-[70%]">
          <h3 className="text-lg font-bold truncate">{name}</h3>
          <Badge className="bg-[#8CFF6E] text-black font-semibold px-3 py-0.5 rounded-full">{category}</Badge>
        </div>
        <div className="text-sm text-gray-500 whitespace-nowrap">{timeLeft}</div>
      </div>
      
      {/* Row 3: Frequency */}
      <div className="text-gray-400 text-sm">{frequency}</div>
      
      {/* Row 4: Activity Pills */}
      <div className="flex mt-1 gap-4">
        {memberNames.map((memberName, index) => (
          <div
            key={index}
            className={`flex-1 rounded-[18px] py-2 text-center font-semibold text-lg transition-all`}
            style={{
              background: index === 0 ? (isLogged ? "#8CFF6E" : "#FEC6A1") : (partnerLogged ? "#8CFF6E" : "#FEC6A1"),
              color: "#161616",
              boxShadow: (index === 0 ? isLogged : partnerLogged)
                ? "0 0 0 2px #c7eec6"
                : "0 0 0 2px #ffe7d6",
              border: (index === 0 ? isLogged : partnerLogged) 
                ? "1.5px solid #8CFF6E" 
                : "1.5px solid #FEC6A1",
            }}
          >
            {memberName}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagTeamCard;

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
  onCardClick
}) => {
  const initialsArray: [string, string] = memberInitials || memberNames.map(getInitials) as [string, string];
  return <div style={{
    boxShadow: "0 1px 5px rgba(130,122,255,0.05)"
  }} onClick={onCardClick} className="border border-[rgba(130,122,255,0.41)] rounded-2xl p-4 w-full flex flex-col gap-3 cursor-pointer bg-white py-[7px] my-[16px]">
      <div className="flex items-center mb-1">
        <div className="flex -space-x-2">
          {memberAvatars.map((avatarUrl, index) => <Avatar key={index} className="h-10 w-10 border-2 border-white">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt={`${memberNames[index]} avatar`} /> : <AvatarFallback className={`${index === 0 ? 'bg-[#FFD6D6]' : 'bg-[#BFE7FD]'} text-sm font-bold`}>
                  {initialsArray[index]}
                </AvatarFallback>}
            </Avatar>)}
        </div>
      </div>
      
      <div className="flex items-center justify-between py-0">
        <div className="flex items-center gap-2 max-w-[70%]">
          <h3 className="text-lg font-bold truncate">{name}</h3>
          <Badge className="text-black font-regular px-3 py-0.5 rounded-full bg-[C5FFB6] bg-[#c5ffb6]">{category}</Badge>
        </div>
        <div className="text-sm text-gray-500 whitespace-nowrap">{timeLeft}</div>
      </div>
      
      <div className="text-gray-400 text-sm">{frequency}</div>
      
      <div className="flex mt-1 gap-4">
        {memberNames.map((memberName, index) => {
        // Determine if this is "My Status" or "Partner's Status"
        const isMyStatus = index === 0;
        const isPending = isMyStatus ? !partnerLogged : !isLogged;
        const statusText = memberName || (isMyStatus ? "Me" : "Partner");
        return <div key={index} className="flex-1 rounded-[18px] py-2 text-center font-normal transition-all" style={{
          width: '168px',
          height: '32px',
          background: isPending ? "#FEC6A1" : "#8CFF6E",
          color: "#161616",
          fontSize: '14px',
          boxShadow: isPending ? "0 0 0 2px #ffe7d6" : "0 0 0 2px #c7eec6",
          border: isPending ? "1.5px solid #FEC6A1" : "1.5px solid #8CFF6E",
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
              {statusText}
              {isMyStatus ? <span className="ml-1 text-xs opacity-70">{partnerLogged ? "(Completed)" : "(Pending)"}</span> : <span className="ml-1 text-xs opacity-70">{isLogged ? "(Completed)" : "(Pending)"}</span>}
            </div>;
      })}
      </div>
    </div>;
};
export default TagTeamCard;
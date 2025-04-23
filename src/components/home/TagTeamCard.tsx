
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
  resetTime?: Date | string; // Added for countdown
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
  resetTime,
  onCardClick
}) => {
  const initialsArray: [string, string] = memberInitials || memberNames.map(getInitials) as [string, string];
  
  // Format countdown time if resetTime is provided
  const formattedTimeLeft = resetTime ? 
    formatDistanceToNow(new Date(resetTime), { addSuffix: true }) : 
    timeLeft;
  
  return (
    <div 
      style={{
        boxShadow: "0 1px 5px rgba(130,122,255,0.05)"
      }} 
      onClick={onCardClick} 
      className="border border-[rgba(130,122,255,0.41)] rounded-2xl p-4 w-full flex flex-col gap-3 cursor-pointer bg-white my-[16px] py-[16px]"
    >
      <div className="flex items-center mb-1">
        <div className="flex -space-x-2">
          {memberAvatars.map((avatarUrl, index) => (
            <Avatar key={index} className="h-10 w-10 border-2 border-white">
              {avatarUrl ? (
                <AvatarImage src={avatarUrl} alt={`${memberNames[index]} avatar`} />
              ) : (
                <AvatarFallback className={`${index === 0 ? 'bg-[#FFD6D6]' : 'bg-[#BFE7FD]'} text-sm font-bold`}>
                  {initialsArray[index]}
                </AvatarFallback>
              )}
            </Avatar>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-between py-0">
        <div className="flex items-center gap-2 max-w-[70%]">
          <h3 className="text-lg font-bold truncate">{name}</h3>
          <Badge className="text-black font-regular px-3 py-0.5 rounded-full bg-[#c5ffb6]">{category}</Badge>
        </div>
        <div className="text-sm text-gray-500 whitespace-nowrap flex items-center gap-1">
          <Clock size={14} />
          {formattedTimeLeft}
        </div>
      </div>
      
      <div className="text-gray-400 text-sm">{frequency}</div>
      
      <div className="flex flex-col sm:flex-row mt-1 gap-2">
        {memberNames.map((memberName, index) => {
          // Determine if this is "My Status" or "Partner's Status"
          const isMyStatus = index === 0;
          const isCompleted = isMyStatus ? partnerLogged : isLogged;
          const statusText = memberName || (isMyStatus ? "Me" : "Partner");
          
          return (
            <div 
              key={index} 
              className="flex-1 rounded-[18px] py-2 text-center font-normal transition-all" 
              style={{
                background: isCompleted ? "#8CFF6E" : "#FEC6A1",
                color: "#161616",
                fontSize: '14px',
                boxShadow: isCompleted ? "0 0 0 2px #c7eec6" : "0 0 0 2px #ffe7d6",
                border: isCompleted ? "1.5px solid #8CFF6E" : "1.5px solid #FEC6A1",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {statusText}
              <span className="ml-1 text-xs opacity-70">
                {isCompleted ? "(Completed)" : "(Pending)"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TagTeamCard;

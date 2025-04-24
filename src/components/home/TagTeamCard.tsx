
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Clock, Check, Square } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Checkbox } from "@/components/ui/checkbox";

interface TagTeamCardProps {
  id: string;
  name: string;
  category: string;
  timeLeft: string;
  frequency: string;
  members: string[];
  partnerId?: string;
  partnerName?: string;
  isLogged?: boolean;
  partnerLogged?: boolean;
  memberNames?: [string, string];
  memberInitials?: [string, string];
  memberAvatars?: [string | null, string | null];
  resetTime?: Date | string;
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
  memberNames = ["", ""],
  memberInitials,
  memberAvatars = [null, null],
  isLogged = false,
  partnerLogged = false,
  resetTime,
  onCardClick
}) => {
  const initialsArray: [string, string] = memberInitials || memberNames.map(getInitials) as [string, string];
  
  const formattedTimeLeft = resetTime ? 
    formatDistanceToNow(new Date(resetTime), { addSuffix: true }) : 
    timeLeft;

  const isCompleted = isLogged && partnerLogged;
  
  return (
    <div 
      onClick={onCardClick}
      className={`border rounded-2xl p-4 w-full flex flex-col gap-3 cursor-pointer bg-white my-[16px] py-[16px] transition-all ${
        isCompleted ? 'border-green-400 bg-green-50' : 'border-[rgba(130,122,255,0.41)]'
      }`}
      style={{
        boxShadow: "0 1px 5px rgba(130,122,255,0.05)"
      }}
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
          <Badge className="text-black font-regular px-3 py-0.5 rounded-full bg-[#c5ffb6]">
            {category}
          </Badge>
        </div>
        <div className="text-sm text-gray-500 whitespace-nowrap flex items-center gap-1">
          <Clock size={14} />
          {formattedTimeLeft}
        </div>
      </div>
      
      <div className="text-gray-400 text-sm">{frequency}</div>
      
      <div className="flex flex-col sm:flex-row mt-1 gap-2">
        {memberNames.map((memberName, index) => {
          const isMyStatus = index === 0;
          const isChecked = isMyStatus ? partnerLogged : isLogged;
          const checkboxLabel = memberName || (isMyStatus ? "Me" : "Partner");
          
          return (
            <div 
              key={index}
              className="flex-1 rounded-[18px] py-2 px-4 flex items-center justify-between bg-gray-50"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-sm font-medium">{checkboxLabel}</span>
              <div className="flex items-center gap-2">
                {isChecked ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : (
                  <Square className="h-5 w-5 text-gray-300" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TagTeamCard;

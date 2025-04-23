
import React, { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";

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
  const initialsArray: [string, string] = memberInitials || (memberNames.map(getInitials) as [string, string]);
  
  // Show celebration effect when both users have completed their activity
  useEffect(() => {
    if (isLogged && partnerLogged) {
      toast.success("🎉 Congratulations! TagTeam activity completed by both members!", {
        duration: 4000
      });
    }
  }, [isLogged, partnerLogged]);
  
  return <div
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
    <div className="flex items-center justify-between py-0">
      <div className="flex items-center gap-2 max-w-[70%]">
        <h3 className="text-lg font-bold truncate">{name}</h3>
        <Badge className="text-black font-regular px-3 py-0.5 rounded-full bg-[#c5ffb6]">{category}</Badge>
      </div>
      <div className="text-sm text-gray-500 whitespace-nowrap">{timeLeft}</div>
    </div>
    <div className="text-gray-400 text-sm">{frequency}</div>
    <div className="flex flex-col md:flex-row gap-2 mt-1">
      {/* Show both user and partner status pills */}
      <div className="rounded-[18px] flex-1 py-2 px-2 text-center font-normal transition-all flex items-center justify-center"
        style={{
          maxWidth: "100%",
          height: 32,
          fontSize: 13,
          fontWeight: 400,
          background: !partnerLogged ? "#FEC6A1" : "#8CFF6E",
          color: "#161616",
          boxShadow: !partnerLogged ? "0 0 0 2px #ffe7d6" : "0 0 0 2px #c7eec6",
          border: !partnerLogged ? "1.5px solid #FEC6A1" : "1.5px solid #8CFF6E",
        }}
      >
        {memberNames[0] || "Me"}
        {
          partnerLogged
            ? <span className="ml-1 text-xs opacity-70">(Complete)</span>
            : <span className="ml-1 text-xs opacity-70">(Pending)</span>
        }
      </div>
      
      <div className="rounded-[18px] flex-1 py-2 px-2 text-center font-normal transition-all flex items-center justify-center"
        style={{
          maxWidth: "100%",
          height: 32,
          fontSize: 13,
          fontWeight: 400,
          background: !isLogged ? "#FEC6A1" : "#8CFF6E",
          color: "#161616",
          boxShadow: !isLogged ? "0 0 0 2px #ffe7d6" : "0 0 0 2px #c7eec6",
          border: !isLogged ? "1.5px solid #FEC6A1" : "1.5px solid #8CFF6E",
        }}
      >
        {memberNames[1] || "Partner"}
        {
          isLogged
            ? <span className="ml-1 text-xs opacity-70">(Complete)</span>
            : <span className="ml-1 text-xs opacity-70">(Pending)</span>
        }
      </div>
    </div>
    
    {isLogged && partnerLogged && (
      <div className="bg-[#e9ffe1] text-center text-green-800 text-xs rounded-lg mt-1 py-1 px-2">
        ✅ Completed! Great teamwork!
      </div>
    )}
  </div>;
};

export default TagTeamCard;

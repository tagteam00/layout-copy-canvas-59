
import React from "react";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UserStatus {
  name: string;
  status: "completed" | "pending";
}

export interface EnhancedTagTeamCardProps {
  name: string;
  user1: UserStatus;
  user2: UserStatus;
  timeLeft: string;
  interest: string;
  frequency: string;
  onClick?: () => void;
}

export const EnhancedTagTeamCard: React.FC<EnhancedTagTeamCardProps> = ({
  name,
  user1,
  user2,
  timeLeft,
  interest,
  frequency,
  onClick,
}) => {
  const getStatusBadge = (status: "completed" | "pending") => {
    if (status === "completed") {
      return (
        <Badge 
          className="bg-[#DCFFDC] hover:bg-[#DCFFDC] text-[#2A7B17] border-none font-medium px-3 py-1"
        >
          Completed
        </Badge>
      );
    }
    return (
      <Badge 
        className="bg-[#FFE8CC] hover:bg-[#FFE8CC] text-[#B76E00] border-none font-medium px-3 py-1"
      >
        Pending
      </Badge>
    );
  };

  return (
    <div 
      onClick={onClick}
      className={cn(
        "max-w-[400px] w-full bg-[#F5F4FF] border border-[#E5E1FF] rounded-2xl p-4",
        onClick && "cursor-pointer"
      )}
      role="button"
      tabIndex={0}
      aria-label={`TagTeam ${name}`}
    >
      {/* Header Section */}
      <h3 className="text-xl font-medium text-[#827AFF] text-center mb-4">
        {name}
      </h3>

      {/* User Status Section */}
      <div className="grid grid-cols-3 gap-2 items-center mb-4">
        {/* User 1 */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-base font-medium text-gray-800">{user1.name}</span>
          {getStatusBadge(user1.status)}
        </div>

        {/* Timer */}
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-600">Resets in:</span>
          <span className="text-base font-medium">{timeLeft}</span>
        </div>

        {/* User 2 */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-base font-medium text-gray-800">{user2.name}</span>
          {getStatusBadge(user2.status)}
        </div>
      </div>

      <Separator className="my-4 bg-[#E0E0E0]" />

      {/* Information Section */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="text-sm text-gray-600">TagTeam's Interest:</span>
          <p className="text-sm font-medium text-gray-800">{interest}</p>
        </div>
        <div>
          <span className="text-sm text-gray-600">Frequency:</span>
          <p className="text-sm font-medium text-gray-800">{frequency}</p>
        </div>
      </div>
    </div>
  );
};


import React from "react";
import { Button } from "@/components/ui/button";
import { UserMinus } from "lucide-react";

interface LeaveTeamSectionProps {
  onLeaveTeam: () => void;
}

export const LeaveTeamSection: React.FC<LeaveTeamSectionProps> = ({
  onLeaveTeam
}) => {
  return (
    <div className="mt-8 border-t border-gray-200 pt-4">
      <Button 
        variant="outline"
        className="w-full border-red-300 text-red-600 hover:bg-red-50 hover:text-red-700"
        onClick={onLeaveTeam}
      >
        <UserMinus className="mr-2 h-4 w-4" />
        Leave TagTeam
      </Button>
    </div>
  );
};

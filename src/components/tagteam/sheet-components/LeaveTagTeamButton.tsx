
import React from "react";
import { DoorOpen } from "lucide-react";
import { LeaveTagTeamDialog } from "../LeaveTagTeamDialog";

interface LeaveTagTeamButtonProps {
  tagTeamId: string;
  tagTeamName: string;
  partnerName: string;
  currentUserId: string;
  onLeaveComplete?: () => void;
}

export const LeaveTagTeamButton: React.FC<LeaveTagTeamButtonProps> = ({
  tagTeamId,
  tagTeamName,
  partnerName,
  currentUserId,
  onLeaveComplete
}) => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  return (
    <>
      <button
        onClick={() => setIsDialogOpen(true)}
        className="flex items-center justify-center gap-2 py-4 text-gray-500 hover:text-gray-700 transition-colors w-full text-sm mt-2"
      >
        <DoorOpen className="h-4 w-4" />
        <span>Leave Tag Team</span>
      </button>

      <LeaveTagTeamDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        tagTeamId={tagTeamId}
        tagTeamName={tagTeamName}
        partnerName={partnerName}
        currentUserId={currentUserId}
        onLeaveComplete={onLeaveComplete}
      />
    </>
  );
};

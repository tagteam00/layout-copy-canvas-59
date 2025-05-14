
import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DoorOpen } from "lucide-react";
import { toast } from "sonner";
import { leaveTeam } from "@/services/teamService";
import { useNavigate } from "react-router-dom";

interface LeaveTagTeamDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  tagTeamId: string;
  tagTeamName: string;
  partnerName: string;
  currentUserId: string;
  onLeaveComplete?: () => void;
}

export const LeaveTagTeamDialog: React.FC<LeaveTagTeamDialogProps> = ({
  isOpen,
  onOpenChange,
  tagTeamId,
  tagTeamName,
  partnerName,
  currentUserId,
  onLeaveComplete
}) => {
  const navigate = useNavigate();
  const [isLeaving, setIsLeaving] = React.useState(false);

  const handleLeave = async () => {
    if (!currentUserId || !tagTeamId) return;
    
    setIsLeaving(true);
    try {
      await leaveTeam(tagTeamId, currentUserId);
      toast.success("Tag Team ended successfully");
      
      // Close dialog
      onOpenChange(false);
      
      // Execute callback if provided
      if (onLeaveComplete) {
        onLeaveComplete();
      } else {
        // Navigate back to the Tag Team hub by default
        navigate('/tagteam-hub');
      }
    } catch (error) {
      console.error('Error leaving team:', error);
      toast.error("Failed to end Tag Team");
    } finally {
      setIsLeaving(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">End this Tag Team?</AlertDialogTitle>
          <div className="flex justify-center my-3">
            <div className="bg-gray-100 rounded-full p-3">
              <DoorOpen className="h-6 w-6 text-gray-600" />
            </div>
          </div>
          <AlertDialogDescription className="text-center">
            Leaving will end this Tag Team for both you and <span className="font-semibold">{partnerName}</span>. 
            Your activity history will be saved, but this Tag Team will no longer appear in either of your active Tag Teams.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col space-y-2 sm:space-y-0">
          <AlertDialogCancel 
            disabled={isLeaving}
            className="w-full sm:w-auto mt-0 font-medium"
          >
            Stay in Tag Team
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleLeave} 
            disabled={isLeaving}
            className="w-full sm:w-auto bg-gray-800 text-white hover:bg-gray-700"
          >
            {isLeaving ? "Ending..." : "End Tag Team"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

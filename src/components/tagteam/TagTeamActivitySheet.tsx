
import React, { useState } from "react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription 
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Check, X, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TagTeamActivitySheetProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
  partnerId: string;
  onLeaveTeam: () => void;
}

export const TagTeamActivitySheet: React.FC<TagTeamActivitySheetProps> = ({
  isOpen, 
  onClose, 
  teamId, 
  teamName, 
  partnerId,
  onLeaveTeam
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleActivityLog = async (completed: boolean) => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { error } = await supabase.from('team_activity_logs').insert({
        team_id: teamId,
        user_id: user.id,
        partner_id: partnerId,
        completed,
        period_start: new Date().toISOString(),
        period_end: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
      });

      if (error) throw error;

      toast.success(`Partner activity marked as ${completed ? 'Completed' : 'Pending'}`);
      onClose();
    } catch (error) {
      console.error('Error logging activity:', error);
      toast.error('Failed to log activity');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLeaveTeam = async () => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Delete the team
      const { error: teamError } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId)
        .contains('members', [user.id]);

      if (teamError) throw teamError;

      // Delete related activity logs
      const { error: logError } = await supabase
        .from('team_activity_logs')
        .delete()
        .eq('team_id', teamId);

      if (logError) throw logError;

      toast.success(`Left ${teamName}`);
      onLeaveTeam();
      onClose();
    } catch (error) {
      console.error('Error leaving team:', error);
      toast.error('Failed to leave team');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Tag Team: {teamName}</DrawerTitle>
          <DrawerDescription>Mark your partner's activity or leave the team</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div className="flex space-x-4">
            <Button 
              onClick={() => handleActivityLog(true)} 
              disabled={isProcessing} 
              className="flex-1 bg-[#8CFF6E] hover:bg-green-600"
            >
              <Check className="mr-2" /> Mark Completed
            </Button>
            <Button 
              onClick={() => handleActivityLog(false)} 
              disabled={isProcessing} 
              variant="destructive" 
              className="flex-1"
            >
              <X className="mr-2" /> Mark Pending
            </Button>
          </div>
          <Button 
            onClick={handleLeaveTeam} 
            disabled={isProcessing} 
            variant="outline" 
            className="w-full text-red-500 hover:bg-red-50"
          >
            <LogOut className="mr-2" /> Leave Tag Team
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

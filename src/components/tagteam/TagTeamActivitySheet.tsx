
import React, { useState, useEffect } from "react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription 
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Check, X, LogOut, User, Calendar, Award } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface TagTeamActivitySheetProps {
  isOpen: boolean;
  onClose: () => void;
  teamId: string;
  teamName: string;
  partnerId: string;
  partnerName?: string;
  onLeaveTeam: () => void;
  onActivityLogged?: (teamId: string, completed: boolean) => void;
  isPartnerLogged?: boolean;
  partnerLogged?: boolean;
}

export const TagTeamActivitySheet: React.FC<TagTeamActivitySheetProps> = ({
  isOpen, 
  onClose, 
  teamId, 
  teamName, 
  partnerId,
  partnerName = "Partner",
  onLeaveTeam,
  onActivityLogged,
  isPartnerLogged = false,
  partnerLogged = false
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Only allow logging PARTNER's activity; don't expose controls otherwise
  const handleActivityLog = async (completed: boolean) => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // Only log for the partner
      const { error } = await supabase.from('team_activity_logs').insert({
        team_id: teamId,
        user_id: user.id,
        partner_id: partnerId,
        completed,
        period_start: new Date().toISOString(),
        period_end: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString()
      });

      if (error) throw error;

      toast.success(`Marked ${partnerName}'s activity as ${completed ? 'complete' : 'pending'}`);
      
      if (onActivityLogged) onActivityLogged(teamId, completed);

      // Check if both activities are now complete
      if (completed && partnerLogged) {
        toast.success(
          <div className="flex flex-col items-center gap-2">
            <Award size={20} className="text-yellow-500" />
            <span>Congratulations! You and {partnerName} have completed the TagTeam activity!</span>
          </div>,
          { 
            duration: 5000,
            className: "bg-gradient-to-r from-green-50 to-green-100 border-green-200"
          }
        );
      }
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
      if (!user) throw new Error('Not authenticated');

      // Remove from team/membership (unchanged logic)
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

      toast.success(`Left "${teamName}"`);
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
      <DrawerContent className="max-h-[85vh] overflow-y-auto px-4 pb-4" style={{ borderRadius: 18, boxShadow: '0 -2px 8px 0 rgba(130,122,255,0.03)' }}>
        <DrawerHeader className="p-4 pt-6">
          <DrawerTitle className="text-lg font-bold">{teamName}</DrawerTitle>
          <DrawerDescription className="text-[15px] text-center">
            Log <b>{partnerName}</b>'s activity
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 w-full px-4" style={{ maxWidth: 432, margin: '0 auto' }}>
          <div className="bg-gray-100 rounded-xl p-3 text-sm text-gray-700 font-normal">
            You can only log your <b>partner's</b> activity. Your partner logs yours.
            {partnerLogged && <p className="mt-2 text-green-700">Your partner has marked your activity as complete! ✓</p>}
          </div>
          <div className="flex flex-col gap-3 mt-1">
            <Button 
              onClick={() => handleActivityLog(true)} 
              disabled={isProcessing}
              className="w-full text-[15px] font-semibold bg-[#8CFF6E] hover:bg-[#74e95b] text-black py-3 px-3 rounded-lg"
              style={{ minHeight: 48 }}
            >
              <Check className="mr-2" size={18} /> Complete
            </Button>
            <Button 
              onClick={() => handleActivityLog(false)} 
              disabled={isProcessing}
              className="w-full text-[15px] bg-[#FFD6D6] hover:bg-[#ffe0e0] text-black py-3 px-3 rounded-lg border border-[#ffb4b4]"
              style={{ minHeight: 48 }}
              variant="outline"
            >
              <X className="mr-2" size={18} /> Not Complete
            </Button>
          </div>
          
          <div className="w-full mb-2 mt-2">
            <Button
              onClick={handleLeaveTeam}
              disabled={isProcessing}
              variant="outline"
              className="w-full py-3 px-3 border border-red-400 text-red-600 rounded-md bg-white"
              style={{ minHeight: 44 }}
            >
              <LogOut className="mr-2" size={17} /> Leave TagTeam
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

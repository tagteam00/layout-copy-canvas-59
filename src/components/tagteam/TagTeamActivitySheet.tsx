
import React, { useState } from "react";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerDescription 
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { 
  Check, 
  X, 
  LogOut, 
  AlertTriangle,
  Clock
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";

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
  resetTime?: Date | string;
  frequency?: string;
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
  resetTime,
  frequency = "Daily"
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleActivityLog = async (completed: boolean) => {
    setIsProcessing(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      // First, check if there's already a log entry to avoid duplicates
      const { data: existingLogs } = await supabase
        .from('team_activity_logs')
        .select('*')
        .eq('team_id', teamId)
        .eq('user_id', user.id)
        .eq('partner_id', partnerId);

      if (existingLogs && existingLogs.length > 0) {
        // Update existing log
        const { error } = await supabase
          .from('team_activity_logs')
          .update({ completed })
          .eq('id', existingLogs[0].id);

        if (error) throw error;
      } else {
        // Create new log
        const period_end = resetTime || new Date(new Date().setDate(new Date().getDate() + (frequency.toLowerCase().includes('weekly') ? 7 : 1)));
        
        const { error } = await supabase.from('team_activity_logs').insert({
          team_id: teamId,
          user_id: user.id,
          partner_id: partnerId,
          completed,
          period_start: new Date().toISOString(),
          period_end: new Date(period_end).toISOString()
        });

        if (error) throw error;
      }

      toast.success(`${partnerName}'s activity marked as ${completed ? 'Completed' : 'Pending'}`);
      
      // Call the callback to update UI state
      if (onActivityLogged) {
        onActivityLogged(teamId, completed);
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

  const formattedResetTime = resetTime ? formatDistanceToNow(
    new Date(resetTime),
    { addSuffix: true }
  ) : "soon";

  const exactResetTime = resetTime ? format(
    new Date(resetTime),
    "PPpp"
  ) : "unknown";

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Team: {teamName}</DrawerTitle>
          <DrawerDescription>Log {partnerName}'s activity</DrawerDescription>
        </DrawerHeader>
        
        <div className="p-4 space-y-6">
          <Card className="border-none shadow-sm bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertTriangle size={16} className="flex-shrink-0" />
                <p className="text-sm">
                  You can only log your partner's activity. Your partner will log your activity.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-500" />
              <span className="text-sm text-gray-600">Resets {formattedResetTime}</span>
            </div>
            <span className="text-xs text-gray-400" title={exactResetTime}>{frequency}</span>
          </div>

          <div className="text-center mb-4">
            <p className="text-sm font-medium">
              {isPartnerLogged ? 
                <span className="text-green-600">Your partner has marked your activity as completed!</span> : 
                <span className="text-amber-600">Your partner hasn't logged your activity yet.</span>
              }
            </p>
          </div>
          
          <div className="text-center text-lg font-medium mb-4">
            How did {partnerName} do?
          </div>

          <div className="flex flex-col space-y-4">
            <Button 
              onClick={() => handleActivityLog(true)} 
              disabled={isProcessing} 
              className="flex-1 bg-[#8CFF6E] hover:bg-green-600 h-14"
            >
              <Check className="mr-2" /> {partnerName} Completed Their Activity
            </Button>
            <Button 
              onClick={() => handleActivityLog(false)} 
              disabled={isProcessing} 
              variant="outline" 
              className="flex-1 border-amber-300 text-amber-700 hover:bg-amber-50 h-14"
            >
              <X className="mr-2" /> {partnerName} Didn't Complete
            </Button>
          </div>

          <div className="pt-6">
            <Button 
              onClick={handleLeaveTeam} 
              disabled={isProcessing} 
              variant="outline" 
              className="w-full text-red-500 hover:bg-red-50"
            >
              <LogOut className="mr-2" /> Leave Tag Team
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

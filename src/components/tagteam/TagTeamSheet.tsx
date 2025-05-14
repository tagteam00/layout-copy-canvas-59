import React, { useState, useEffect } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Team } from "@/services/teamService";
import { useUserData } from "@/hooks/useUserData";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { TagTeamSheetProps } from "@/types/tagteam";
import { checkTagTeamLimit } from "@/utils/teamLimitUtils";

export const TagTeamSheet: React.FC<TagTeamSheetProps> = ({
  isOpen,
  onClose,
  tagTeam,
  currentUserId,
  onBeforeAcceptRequest
}) => {
  const { toast } = useToast();
  const [isLeaving, setIsLeaving] = useState(false);
  const [open, setOpen] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [isLimitReached, setIsLimitReached] = useState(false);

  const handleLeaveTeam = async () => {
    setOpen(false);
    setIsLeaving(true);
    try {
      const { error } = await supabase.functions.invoke('leave-team', {
        body: { teamId: tagTeam.id, userId: currentUserId },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "TagTeam Ended",
        description: "You have left the tagteam.",
      });
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    } finally {
      setIsLeaving(false);
    }
  };

  const handleAcceptTeamRequest = async () => {
    setIsAccepting(true);
    try {
      // Check if the user is allowed to accept the request
      if (onBeforeAcceptRequest) {
        const canAccept = await onBeforeAcceptRequest();
        if (!canAccept) {
          setIsAccepting(false);
          return;
        }
      }
      
      // Optimistically update the UI
      toast({
        title: "Request Accepted",
        description: "You have accepted the tagteam request.",
      });
      onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
      });
    } finally {
      setIsAccepting(false);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{tagTeam.name}</SheetTitle>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="name" className="text-right text-sm font-medium">
              First User
            </label>
            <input
              type="text"
              id="name"
              value={tagTeam.firstUser.name}
              className="col-span-3 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="username" className="text-right text-sm font-medium">
              Second User
            </label>
            <input
              type="text"
              id="username"
              value={tagTeam.secondUser.name}
              className="col-span-3 flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:cursor-not-allowed disabled:opacity-50"
              disabled
            />
          </div>
        </div>
        <Button type="submit" disabled={isAccepting} onClick={handleAcceptTeamRequest}>
          {isAccepting ? (
            <>
              Accepting <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            "Accept TagTeam Request"
          )}
        </Button>
        <Button variant="destructive" onClick={() => setOpen(true)} disabled={isLeaving}>
          {isLeaving ? (
            <>
              Leaving <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            </>
          ) : (
            "Leave TagTeam"
          )}
        </Button>
      </SheetContent>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove you from the tagteam.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeaveTeam} disabled={isLeaving}>
              {isLeaving ? (
                <>
                  Leaving <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                </>
              ) : (
                "Leave TagTeam"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sheet>
  );
};


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
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

type LimitReachedContext = "send" | "accept";

interface LimitReachedDialogProps {
  isOpen: boolean;
  onClose: () => void;
  context: LimitReachedContext;
}

export const LimitReachedDialog: React.FC<LimitReachedDialogProps> = ({
  isOpen,
  onClose,
  context,
}) => {
  const navigate = useNavigate();

  const title = context === 'send' ? "You're All Tagged Up!" : "Room for 3 Tag Teams";
  const message = context === 'send' 
    ? "You currently have 3 active Tag Teams - that's our magic number for maintaining quality accountability partnerships. To start a new Tag Team, you'll need to complete or leave one of your existing teams first."
    : "You currently have 3 active Tag Teams, which is our limit to help you focus on quality partnerships. To accept this request, you'll need to complete or leave one of your existing teams first.";

  const handleManageTeams = () => {
    navigate("/tagteam");
    onClose();
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-xl font-bold text-center">
            {title}
          </AlertDialogTitle>
          <div className="flex justify-center my-4">
            <div className="bg-purple-100 rounded-full p-6 w-20 h-20 flex items-center justify-center">
              <span className="text-3xl font-bold text-[#827AFF]">3</span>
            </div>
          </div>
          <AlertDialogDescription className="text-center">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2">
          <Button 
            onClick={handleManageTeams}
            className="w-full bg-black text-white hover:bg-black/90"
          >
            Manage My Tag Teams
          </Button>
          <AlertDialogCancel className="w-full mt-2">
            Got It
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

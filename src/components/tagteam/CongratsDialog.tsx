
import React from "react";
import { Trophy } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";

interface CongratsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  teamName: string;
  partnerName: string;
}

export const CongratsDialog: React.FC<CongratsDialogProps> = ({ 
  isOpen, 
  onOpenChange,
  teamName,
  partnerName
}) => {
  return (
    <>
      <Confetti active={isOpen} duration={8} />
      
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader className="flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-[#FFF8E0] flex items-center justify-center mb-4">
              <Trophy className="h-8 w-8 text-[#FFD700]" />
            </div>
            <DialogTitle className="text-xl sm:text-2xl">Goal Accomplished! 🎉</DialogTitle>
          </DialogHeader>
          
          <DialogDescription className="text-center py-4">
            <p className="text-base font-medium mb-2">
              You and {partnerName} have successfully completed your goals in "{teamName}"!
            </p>
            <p className="text-sm text-gray-500">
              Keep up the great teamwork and stay accountable to each other.
            </p>
          </DialogDescription>
          
          <DialogFooter className="sm:justify-center pt-2">
            <Button 
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto bg-black text-white hover:bg-gray-800"
            >
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

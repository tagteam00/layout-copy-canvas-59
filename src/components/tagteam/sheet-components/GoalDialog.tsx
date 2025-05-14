
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface GoalDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newGoal: string;
  setNewGoal: (goal: string) => void;
  onSave: () => void;
  isSubmitting: boolean;
}

const MAX_GOAL_LENGTH = 180;

export const GoalDialog: React.FC<GoalDialogProps> = ({
  isOpen,
  onOpenChange,
  newGoal,
  setNewGoal,
  onSave,
  isSubmitting
}) => {
  const charactersLeft = MAX_GOAL_LENGTH - (newGoal?.length || 0);
  
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_GOAL_LENGTH) {
      setNewGoal(value);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set Your Goal</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="Describe your goal here..."
            value={newGoal}
            onChange={handleTextChange}
            className="min-h-[100px]"
          />
          <div className="text-xs text-gray-500 text-right">
            {charactersLeft} characters left
          </div>
        </div>
        <DialogFooter>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={onSave}
            disabled={isSubmitting || !newGoal.trim()}
            className="bg-black text-white"
          >
            {isSubmitting ? "Saving..." : "Save Goal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

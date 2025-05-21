
import React from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditGoalButtonProps {
  onClick: () => void;
  visible: boolean;
}

export const EditGoalButton: React.FC<EditGoalButtonProps> = ({ 
  onClick, 
  visible 
}) => {
  if (!visible) return null;
  
  return (
    <div className="absolute bottom-10 right-5">
      <Button 
        size="icon" 
        className="h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300"
        onClick={onClick}
      >
        <Pencil className="h-5 w-5" />
      </Button>
    </div>
  );
};

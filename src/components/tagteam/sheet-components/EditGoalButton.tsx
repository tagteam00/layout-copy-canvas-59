
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

  const handleClick = (e: React.TouchEvent | React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onClick();
  };
  
  return (
    <div className="absolute bottom-10 right-5 touch-none">
      <Button 
        size="icon" 
        className="h-12 w-12 rounded-full bg-gray-200 hover:bg-gray-300 active:bg-gray-400 min-h-[48px] touch-manipulation"
        onClick={handleClick}
        onTouchStart={handleClick}
        style={{ userSelect: 'none', WebkitUserSelect: 'none' }}
      >
        <Pencil className="h-5 w-5" />
      </Button>
    </div>
  );
};

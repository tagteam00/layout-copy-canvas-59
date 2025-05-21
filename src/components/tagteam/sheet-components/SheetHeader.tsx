
import React from "react";
import { X } from "lucide-react";
import { DrawerClose } from "@/components/ui/drawer";

interface SheetHeaderProps {
  title: string;
}

export const SheetHeader: React.FC<SheetHeaderProps> = ({ title }) => {
  return (
    <div className="relative flex items-center justify-center px-4 py-3 border-b border-gray-100">
      <h2 className="text-[20px] font-bold text-black">{title}</h2>
      <DrawerClose className="absolute right-4 top-3">
        <X className="h-6 w-6 text-gray-500" />
      </DrawerClose>
    </div>
  );
};

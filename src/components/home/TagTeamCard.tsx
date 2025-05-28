
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { CelebrationStrip } from "@/components/tagteam/CelebrationStrip";

interface TagTeamCardProps {
  name: string;
  category: string;
  timeLeft: string;
  frequency: string;
  members: string;
  partnerName?: string;
  isLogged?: boolean;
  partnerLogged?: boolean;
}

export const TagTeamCard: React.FC<TagTeamCardProps> = ({
  name,
  category,
  timeLeft,
  frequency,
  members,
  partnerName,
  isLogged = false,
  partnerLogged = false,
}) => {
  // Check if both users have completed their goals
  const bothCompleted = isLogged && partnerLogged;

  const cardVariants = {
    initial: { scale: 1 },
    completed: { 
      scale: 1.02,
      boxShadow: "0 8px 25px rgba(130, 122, 255, 0.15)",
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div 
      className={`border w-full mt-4 rounded-xl border-solid flex flex-col ${
        bothCompleted 
          ? "border-[#8CFF6E] bg-gradient-to-br from-white to-green-50/30" 
          : "border-[rgba(130,122,255,0.41)] bg-white"
      }`}
      style={{boxShadow: bothCompleted ? '0 8px 25px rgba(140,255,110,0.15)' : '0 1px 5px rgba(130,122,255,0.05)'}}
      variants={cardVariants}
      animate={bothCompleted ? "completed" : "initial"}
    >
      {/* Celebration Strip */}
      <AnimatePresence>
        {bothCompleted && (
          <CelebrationStrip />
        )}
      </AnimatePresence>

      {/* Card Content */}
      <div className={`p-3 gap-2 flex flex-col ${bothCompleted ? "rounded-b-xl" : "rounded-xl"}`}>
        <div className="flex w-full items-center justify-between">
          <div className="flex items-center gap-1 max-w-[65%]">
            <h3 className="text-lg font-bold truncate">{name}</h3>
            <Badge className="bg-[#8CFF6E] text-black font-semibold px-2 py-0.5 rounded-full text-xs whitespace-nowrap">{category}</Badge>
          </div>
          <div className="text-sm font-medium">{timeLeft}</div>
        </div>
        <div className="text-gray-400 mb-1 text-xs">{frequency}</div>
        <div className="flex items-center justify-between">
          <div className="text-sm text-black font-semibold text-left truncate max-w-[60%]">{members}</div>
          <div className="flex items-center gap-1">
            <div className={`p-1 rounded-full border border-gray-300 ${isLogged ? 'bg-[#8CFF6E]' : 'bg-white'}`}>
              {isLogged ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <Check className="w-4 h-4 text-gray-400" />
              )}
            </div>
            <div className={`p-1 rounded-full border border-gray-300 ${partnerLogged ? 'bg-[#8CFF6E]' : 'bg-white'}`}>
              {partnerLogged ? (
                <Check className="w-4 h-4 text-white" />
              ) : (
                <Check className="w-4 h-4 text-gray-400" />
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

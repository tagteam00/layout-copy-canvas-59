
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
    <div className="w-full px-1 mb-4">
      <motion.div 
        className={`border-2 w-full rounded-xl border-solid flex flex-col overflow-hidden ${
          bothCompleted 
            ? "border-[#8CFF6E] bg-gradient-to-br from-white to-green-50/30" 
            : "border-[rgba(130,122,255,0.41)] bg-white"
        }`}
        style={{
          boxShadow: bothCompleted 
            ? '0 8px 25px rgba(140,255,110,0.15)' 
            : '0 2px 10px rgba(130,122,255,0.08)',
          minHeight: 'auto'
        }}
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
        <div className="p-4 gap-3 flex flex-col">
          <div className="flex w-full items-center justify-between">
            <div className="flex items-center gap-2 max-w-[65%]">
              <h3 className="text-lg font-bold truncate">{name}</h3>
              <Badge className="bg-[#8CFF6E] text-black font-semibold px-2 py-1 rounded-full text-xs whitespace-nowrap">
                {category}
              </Badge>
            </div>
            <div className="text-sm font-medium text-gray-600">{timeLeft}</div>
          </div>
          
          <div className="text-gray-400 text-xs">{frequency}</div>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-black font-semibold text-left truncate max-w-[60%]">
              {members}
            </div>
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-full border-2 transition-all duration-300 ${
                isLogged 
                  ? 'bg-[#8CFF6E] border-[#8CFF6E]' 
                  : 'bg-white border-gray-300'
              }`}>
                <Check className={`w-4 h-4 ${isLogged ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <div className={`p-1.5 rounded-full border-2 transition-all duration-300 ${
                partnerLogged 
                  ? 'bg-[#8CFF6E] border-[#8CFF6E]' 
                  : 'bg-white border-gray-300'
              }`}>
                <Check className={`w-4 h-4 ${partnerLogged ? 'text-white' : 'text-gray-400'}`} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};


import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTagTeamTimer } from "@/hooks/useTagTeamTimer";
import { CelebrationStrip } from "./CelebrationStrip";

interface TagTeamCardProps {
  name: string;
  firstUser: {
    name: string;
    status: "completed" | "pending";
  };
  secondUser: {
    name: string;
    status: "completed" | "pending";
  };
  resetTime?: string;
  interest: string;
  frequency: string;
  resetDay?: string;
  onClick?: () => void;
  showConfetti?: boolean;
}

export const TagTeamCard: React.FC<TagTeamCardProps> = ({
  name,
  firstUser,
  secondUser,
  interest,
  frequency,
  resetDay,
  onClick,
  showConfetti = false
}) => {
  // Function to get first name
  const getFirstName = (fullName: string): string => {
    return fullName.split(' ')[0];
  };

  // Use the timer hook instead of internal state
  const { timer, timerColorClass } = useTagTeamTimer(frequency, resetDay);

  // Check if both users have completed their goals
  const bothCompleted = firstUser.status === "completed" && secondUser.status === "completed";

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
        onClick={onClick} 
        className={`w-full rounded-2xl border-2 cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden ${
          bothCompleted 
            ? "border-[#8CFF6E] bg-gradient-to-br from-slate-50 to-green-50/30" 
            : "border-[#E5DEFF] bg-slate-50"
        }`}
        style={{
          boxShadow: bothCompleted 
            ? '0 8px 25px rgba(140,255,110,0.15)' 
            : '0 2px 10px rgba(229,222,255,0.15)',
          minHeight: 'auto'
        }}
        variants={cardVariants}
        animate={bothCompleted ? "completed" : "initial"}
      >
        {/* Celebration Strip */}
        <AnimatePresence>
          {bothCompleted && (
            <CelebrationStrip showConfetti={showConfetti} />
          )}
        </AnimatePresence>

        {/* Card Content */}
        <div className="p-5">
          {/* Header Section */}
          <h3 className="text-center text-[20px] text-[#827AFF] mb-4 truncate font-extrabold">
            {name}
          </h3>

          {/* User Status Section */}
          <div className="flex justify-between items-start mb-4">
            {/* First User - Left aligned */}
            <div className="flex flex-col items-start space-y-2 max-w-[30%]">
              <span className="text-[16px] font-medium text-gray-800 text-left truncate w-full">
                {getFirstName(firstUser.name)}
              </span>
              <span className={`py-1 px-3 rounded-full text-xs font-medium ${
                firstUser.status === "completed" 
                  ? "bg-[#DCFFDC] text-green-700" 
                  : "bg-[#FFE8CC] text-amber-700"
              }`}>
                {firstUser.status === "completed" ? "Completed" : "Pending"}
              </span>
            </div>

            {/* Reset Timer - simplified */}
            <div className="flex flex-col items-center">
              <span className="text-[13px] text-gray-600 mb-1">
                Resets:
              </span>
              <span className={`text-[15px] font-medium ${timerColorClass}`}>
                {timer.timeString}
              </span>
            </div>

            {/* Second User - Right aligned */}
            <div className="flex flex-col items-end space-y-2 max-w-[30%]">
              <span className="text-[16px] font-medium text-gray-800 text-right truncate w-full">
                {getFirstName(secondUser.name)}
              </span>
              <span className={`py-1 px-3 rounded-full text-xs font-medium ${
                secondUser.status === "completed" 
                  ? "bg-[#DCFFDC] text-green-700" 
                  : "bg-[#FFE8CC] text-amber-700"
              }`}>
                {secondUser.status === "completed" ? "Completed" : "Pending"}
              </span>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[#E0E0E0] my-4"></div>

          {/* Information Section */}
          <div className="flex flex-wrap justify-between items-center text-sm">
            <div>
              <span className="text-gray-600">Interest: </span>
              <span className="font-medium text-gray-800 truncate">{interest}</span>
            </div>
            <div>
              <span className="text-gray-600">Freq: </span>
              <span className="font-medium text-gray-800">{frequency}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

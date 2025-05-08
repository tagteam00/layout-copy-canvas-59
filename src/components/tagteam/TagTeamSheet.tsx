
import React, { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { useTagTeamTimer } from "@/hooks/useTagTeamTimer";
import { TeamInfoSection } from "./sheet-components/TeamInfoSection";
import { UserStatusSection } from "./sheet-components/UserStatusSection";
import { PartnerVerificationSection } from "./sheet-components/PartnerVerificationSection";
import { GoalSection } from "./sheet-components/GoalSection";
import { CalendarSection } from "./sheet-components/CalendarSection";
import { TagTeam } from "@/types/tagteam";

interface TagTeamSheetProps {
  isOpen: boolean;
  onClose: () => void;
  tagTeam: TagTeam;
  currentUserId: string;
}

export const TagTeamSheet = ({ isOpen, onClose, tagTeam, currentUserId }: TagTeamSheetProps) => {
  const [showCalendar, setShowCalendar] = useState(false);
  const [isCurrentUserFirst, setIsCurrentUserFirst] = useState(true);

  // Determine if current user is the first or second user in the team
  useEffect(() => {
    if (tagTeam.firstUser.id === currentUserId) {
      setIsCurrentUserFirst(true);
    } else if (tagTeam.secondUser.id === currentUserId) {
      setIsCurrentUserFirst(false);
    }
  }, [tagTeam, currentUserId]);

  // Custom hook for managing the timer display
  const { timer, timerColorClass, shortTimeDisplay } = useTagTeamTimer(tagTeam.frequency, tagTeam.resetDay);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader className="text-left mb-6">
          <SheetTitle className="text-[22px] font-bold text-center text-[#827AFF]">
            {tagTeam.name}
          </SheetTitle>
        </SheetHeader>
        
        <div className="space-y-6">
          <UserStatusSection 
            firstUser={tagTeam.firstUser} 
            secondUser={tagTeam.secondUser}
            timer={timer}
            timerColorClass={timerColorClass}
            shortTimeDisplay={shortTimeDisplay}
          />
          
          <TeamInfoSection
            interest={tagTeam.interest}
            frequency={tagTeam.frequency}
          />
          
          <PartnerVerificationSection 
            isCurrentUserFirst={isCurrentUserFirst}
            tagTeam={tagTeam}
            currentUserId={currentUserId}
          />
          
          <GoalSection 
            isCurrentUserFirst={isCurrentUserFirst} 
            tagTeam={tagTeam}
            showCalendar={showCalendar}
            setShowCalendar={setShowCalendar}
          />
          
          {showCalendar && (
            <CalendarSection 
              isCurrentUserFirst={isCurrentUserFirst}
              tagTeam={tagTeam}
              onClose={() => setShowCalendar(false)} 
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

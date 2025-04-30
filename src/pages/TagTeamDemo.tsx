
import React from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { EnhancedTagTeamCard } from "@/components/tagteam/EnhancedTagTeamCard";

const TagTeamDemo: React.FC = () => {
  const handleCardClick = () => {
    console.log("Card clicked");
  };

  return (
    <main className="flex flex-col min-h-screen bg-white max-w-[480px] w-full mx-auto relative pb-20">
      <AppHeader />
      
      <div className="p-4 flex flex-col gap-4">
        <h1 className="text-2xl font-bold mb-4">TagTeam Card Demo</h1>
        
        <EnhancedTagTeamCard 
          name="Gym Sharks"
          user1={{
            name: "Divyansh",
            status: "completed"
          }}
          user2={{
            name: "Divij",
            status: "pending"
          }}
          timeLeft="00:30:00"
          interest="Gym"
          frequency="Everyday"
          onClick={handleCardClick}
        />

        <EnhancedTagTeamCard 
          name="Book Club"
          user1={{
            name: "Sarah",
            status: "completed"
          }}
          user2={{
            name: "Michael",
            status: "completed"
          }}
          timeLeft="02:15:45"
          interest="Reading"
          frequency="Weekly"
          onClick={handleCardClick}
        />
      </div>
      
      <BottomNavigation />
    </main>
  );
};

export default TagTeamDemo;

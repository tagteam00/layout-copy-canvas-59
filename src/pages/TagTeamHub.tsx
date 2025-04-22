import React, { useState } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { TagTeamCard } from "@/components/home/TagTeamCard";
import { AddTeamButton } from "@/components/home/AddTeamButton";
import { CreateTeamSheet } from "@/components/tagteam/CreateTeamSheet";

const TagTeamHub: React.FC = () => {
  // State for tag teams
  const [tagTeams, setTagTeams] = useState([
    {
      id: "1",
      name: "Heavy Lifters",
      category: "Gym",
      timeLeft: "2hrs Left",
      frequency: "Everyday",
      members: "Parth - Divij",
    },
    {
      id: "2",
      name: "Sharks",
      category: "Swimming",
      timeLeft: "2hrs Left",
      frequency: "Everyday",
      members: "Parth - Divij",
    },
    {
      id: "3",
      name: "Runners",
      category: "Running",
      timeLeft: "5hrs Left",
      frequency: "Everyday",
      members: "Divij - Alex",
    },
  ]);

  // State for active navigation tab
  const [activeTab, setActiveTab] = useState("tagteam");

  // State for sheet visibility
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Available categories
  const categories = ["Swimming", "Gym", "Football", "Running", "Yoga"];

  // Navigation items
  const navItems = [
    {
      name: "Home",
      icon: "https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/c761f5256fcea0afdf72f5aa0ab3d05e40a3545b?placeholderIfAbsent=true",
      path: "/",
      isActive: activeTab === "home",
    },
    {
      name: "Tagteam",
      icon: "https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/99b9d22862884f6e83475b74fa086fd10fb5e57f?placeholderIfAbsent=true",
      path: "/tagteam",
      isActive: activeTab === "tagteam",
    },
    {
      name: "Profile",
      icon: "https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/6015a6ceb8f49982ed2ff6177f7ee6374f72c48d?placeholderIfAbsent=true",
      path: "/profile",
      isActive: activeTab === "profile",
    },
  ];

  // Handler for logging activity
  const handleLogActivity = (teamId: string) => {
    // To be implemented with activity logging sheet
    console.log("Log activity for team:", teamId);
  };

  // Handler for adding a new team
  const handleAddTeam = (newTeam) => {
    setTagTeams([...tagTeams, newTeam]);
    setIsSheetOpen(false);
  };

  return (
    <main className="bg-white max-w-[480px] w-full overflow-hidden mx-auto">
      <AppHeader />
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">TagTeam Hub</h1>
        
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Track and manage all your active TagTeams
          </p>
        </div>

        {tagTeams.map((team) => (
          <div key={team.id} onClick={() => handleLogActivity(team.id)}>
            <TagTeamCard
              name={team.name}
              category={team.category}
              timeLeft={team.timeLeft}
              frequency={team.frequency}
              members={team.members}
            />
          </div>
        ))}
      </div>

      <BottomNavigation items={navItems} />
      
      <AddTeamButton onClick={() => setIsSheetOpen(true)} />

      <CreateTeamSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onCreateTeam={handleAddTeam}
        categories={categories}
      />
    </main>
  );
};

export default TagTeamHub;

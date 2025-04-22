
import React, { useState } from "react";
import { ProfileHeader } from "@/components/home/ProfileHeader";
import { TagTeamList } from "@/components/home/TagTeamList";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { CreateTeamSheet } from "@/components/tagteam/CreateTeamSheet";

const Index: React.FC = () => {
  // State for user profile
  const [userProfile, setUserProfile] = useState({
    username: "Divij",
    interests: ["Swimming", "Gym", "Football"],
  });

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
  ]);

  // State for active navigation tab
  const [activeTab, setActiveTab] = useState("home");

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

  // Handler for adding a new team
  const handleAddTeam = (newTeam) => {
    setTagTeams([...tagTeams, newTeam]);
    setIsSheetOpen(false);
  };

  // Handler for opening the sheet
  const handleOpenSheet = () => {
    setIsSheetOpen(true);
  };

  return (
    <main className="flex flex-col min-h-screen bg-white max-w-[480px] w-full mx-auto relative pb-20">
      <div className="flex-1 overflow-y-auto">
        <ProfileHeader
          username={userProfile.username}
          interests={userProfile.interests}
        />
        <TagTeamList teams={tagTeams} onAddTeam={handleOpenSheet} />
      </div>

      <BottomNavigation items={navItems} />

      <CreateTeamSheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onCreateTeam={handleAddTeam}
        categories={categories}
      />
    </main>
  );
};

export default Index;

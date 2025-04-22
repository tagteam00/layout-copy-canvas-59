import React, { useState } from "react";
import { ProfileHeader } from "@/components/home/ProfileHeader";
import { TagTeamList } from "@/components/home/TagTeamList";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { CreateTeamModal } from "@/components/home/CreateTeamModal";

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

  // State for modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  // Handler for navigation tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Handler for adding a new team
  const handleAddTeam = (newTeam) => {
    setTagTeams([...tagTeams, newTeam]);
  };

  // Handler for opening the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  return (
    <main className="bg-white max-w-[480px] w-full overflow-hidden mx-auto">
      <ProfileHeader
        username={userProfile.username}
        interests={userProfile.interests}
      />
      <TagTeamList teams={tagTeams} onAddTeam={handleOpenModal} />
      <BottomNavigation items={navItems} />

      <CreateTeamModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreateTeam={handleAddTeam}
        categories={categories}
      />
    </main>
  );
};

export default Index;

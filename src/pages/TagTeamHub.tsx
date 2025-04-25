import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { TagTeamCard } from "@/components/home/TagTeamCard";
import { AddTeamButton } from "@/components/home/AddTeamButton";
import { CreateTeamSheet } from "@/components/tagteam/CreateTeamSheet";
import { useUserData } from "@/hooks/useUserData";
import { toast } from "sonner";
const TagTeamHub: React.FC = () => {
  const {
    getUserData
  } = useUserData();
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    interests: [] as string[]
  });
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          setUserProfile({
            fullName: userData.fullName,
            interests: userData.interests
          });
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, []);
  const [tagTeams, setTagTeams] = useState([]);
  const [activeTab, setActiveTab] = useState("tagteam");
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const handleLogActivity = (teamId: string) => {
    console.log("Log activity for team:", teamId);
  };
  const handleAddTeam = newTeam => {
    setTagTeams([...tagTeams, newTeam]);
    setIsSheetOpen(false);
  };
  return <main className="bg-white max-w-[480px] w-full overflow-hidden mx-auto">
      <AppHeader />
      <div className="p-4">
        <h1 className="mb-6 font-extrabold text-3xl">Tagteam Hub</h1>
        
        <div className="mb-4">
          
        </div>

        {tagTeams.length > 0 ? tagTeams.map(team => <div key={team.id} onClick={() => handleLogActivity(team.id)}>
              <TagTeamCard name={team.name} category={team.category} timeLeft={team.timeLeft} frequency={team.frequency} members={team.members} />
            </div>) : <div className="text-center py-8">
            <p className="text-gray-500">No active TagTeams yet</p>
          </div>}
      </div>

      <BottomNavigation />
      
      <AddTeamButton onClick={() => setIsSheetOpen(true)} />

      <CreateTeamSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} onCreateTeam={handleAddTeam} categories={userProfile.interests} />
    </main>;
};
export default TagTeamHub;

import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { TagTeamCard } from "@/components/home/TagTeamCard";
import { EnhancedTagTeamCard } from "@/components/tagteam/EnhancedTagTeamCard";
import { AddTeamButton } from "@/components/home/AddTeamButton";
import { CreateTeamSheet } from "@/components/tagteam/CreateTeamSheet";
import { useUserData } from "@/hooks/useUserData";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const TagTeamHub: React.FC = () => {
  const {
    getUserData
  } = useUserData();
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    interests: [] as string[]
  });
  const [loading, setLoading] = useState(true);
  const [useEnhancedCards, setUseEnhancedCards] = useState(true);
  
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
  
  // Demo data for the enhanced cards
  const demoTeams = [
    {
      id: "1",
      name: "Gym Sharks",
      category: "Fitness",
      interest: "Gym",
      timeLeft: "00:30:00",
      frequency: "Everyday",
      members: "You & Divij",
      user1: { name: "Divyansh", status: "completed" as const },
      user2: { name: "Divij", status: "pending" as const }
    },
    {
      id: "2",
      name: "Book Club",
      category: "Reading",
      interest: "Reading",
      timeLeft: "02:15:45",
      frequency: "Weekly",
      members: "You & Sarah",
      user1: { name: "You", status: "completed" as const },
      user2: { name: "Sarah", status: "completed" as const }
    }
  ];
  
  return <main className="bg-white max-w-[480px] w-full overflow-hidden mx-auto">
      <AppHeader />
      <div className="p-4">
        <h1 className="mb-4 font-extrabold text-lg">Tagteam Hub</h1>
        
        <div className="mb-4 flex items-center justify-end space-x-2">
          <Label htmlFor="card-toggle" className="text-sm">Enhanced Cards</Label>
          <Switch
            id="card-toggle"
            checked={useEnhancedCards}
            onCheckedChange={setUseEnhancedCards}
          />
        </div>

        {demoTeams.length > 0 ? 
          <div className="space-y-4">
            {demoTeams.map(team => 
              useEnhancedCards ? (
                <EnhancedTagTeamCard 
                  key={team.id}
                  name={team.name}
                  user1={team.user1}
                  user2={team.user2}
                  timeLeft={team.timeLeft}
                  interest={team.interest || team.category}
                  frequency={team.frequency}
                  onClick={() => handleLogActivity(team.id)}
                />
              ) : (
                <div key={team.id} onClick={() => handleLogActivity(team.id)}>
                  <TagTeamCard 
                    name={team.name} 
                    category={team.category} 
                    timeLeft={team.timeLeft} 
                    frequency={team.frequency} 
                    members={team.members} 
                  />
                </div>
              )
            )}
          </div>
        : <div className="flex flex-col items-center justify-center py-8 px-4">
            <div className="w-full max-w-[280px] mx-auto">
              <AspectRatio ratio={16 / 9}>
                <img src="/lovable-uploads/6834f7c6-308c-44b6-833b-6bca71374722.png" alt="People collaborating" className="w-full h-full object-scale-down" />
              </AspectRatio>
            </div>
            <p className="text-center text-gray-600 mt-6 italic my-0">
              You don't seem to be in any tagteam,
              Your next tagteam is just a click away.
            </p>
          </div>}
      </div>

      <BottomNavigation />
      
      <AddTeamButton onClick={() => setIsSheetOpen(true)} />

      <CreateTeamSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} onCreateTeam={handleAddTeam} categories={userProfile.interests} />
    </main>;
};

export default TagTeamHub;

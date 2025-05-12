
import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { AddTeamButton } from "@/components/home/AddTeamButton";
import { CreateTeamSheet } from "@/components/tagteam/CreateTeamSheet";
import { TagTeamSheet } from "@/components/tagteam/TagTeamSheet";
import { useUserData } from "@/hooks/useUserData";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { toast } from "sonner";
import { TagTeamCard } from "@/components/tagteam/TagTeamCard";
import { supabase } from "@/integrations/supabase/client";

const TagTeamHub: React.FC = () => {
  const { getUserData } = useUserData();
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    interests: [] as string[],
    id: ""
  });
  const [loading, setLoading] = useState(true);
  const [tagTeams, setTagTeams] = useState<any[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isTagTeamSheetOpen, setIsTagTeamSheetOpen] = useState(false);
  const [selectedTagTeam, setSelectedTagTeam] = useState<any>(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await getUserData();
        if (userData) {
          const { data: authData } = await supabase.auth.getUser();
          
          setUserProfile({
            fullName: userData.fullName,
            interests: userData.interests || [],
            id: authData.user?.id || ""
          });
          
          // Fetch user's teams
          await fetchUserTeams(userData, authData.user?.id || "");
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
  
  const fetchUserTeams = async (userData: any, userId: string) => {
    try {
      if (!userId) return;
      
      const { data: teamsData, error } = await supabase
        .from('teams')
        .select('*')
        .contains('members', [userId]);
        
      if (error) {
        throw error;
      }
      
      // Transform team data for display
      if (teamsData) {
        const transformedTeams = await Promise.all(teamsData.map(async (team) => {
          // Get the partner ID (the other member that is not the current user)
          const partnerId = team.members.find((id: string) => id !== userId);
          
          // Fetch partner profile
          const { data: partnerData } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', partnerId)
            .single();
          
          // Extract reset day from frequency if it's weekly
          let resetDay;
          if (team.frequency.toLowerCase().includes('weekly')) {
            const match = team.frequency.match(/\((.*?)\)/);
            resetDay = match ? match[1] : undefined;
          }
            
          return {
            id: team.id,
            name: team.name,
            firstUser: {
              id: userId,
              name: userData.fullName,
              status: "pending" as const, // For now, hardcoded
              goal: "Will do Push pull legs the entire week, and take as much protien as I can" // Example goal
            },
            secondUser: {
              id: partnerId || "",
              name: partnerData?.full_name || "Partner",
              status: "completed" as const, // For now, hardcoded
              goal: "" // Empty goal for example
            },
            interest: team.category,
            frequency: team.frequency,
            resetDay: resetDay,
            resetTime: "00:30:00" // Example reset time
          };
        }));
        
        setTagTeams(transformedTeams);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      toast.error("Failed to load teams");
    }
  };

  const handleLogActivity = (teamId: string) => {
    const team = tagTeams.find(team => team.id === teamId);
    if (team) {
      setSelectedTagTeam(team);
      setIsTagTeamSheetOpen(true);
    }
  };

  const handleAddTeam = (newTeam: any) => {
    setTagTeams([...tagTeams, newTeam]);
    setIsSheetOpen(false);
  };

  return (
    <main className="flex flex-col min-h-screen bg-white w-full mx-auto relative pb-16">
      <AppHeader />
      <div className="max-w-[480px] w-full mx-auto px-4">
        <h1 className="mb-6 font-extrabold text-lg pt-4">Tagteam Hub</h1>
        
        {loading ? (
          <div className="flex justify-center p-8">
            <div className="animate-pulse">Loading your tagteams...</div>
          </div>
        ) : tagTeams.length > 0 ? (
          <div className="space-y-4">
            {tagTeams.map((team) => (
              <div key={team.id} onClick={() => handleLogActivity(team.id)} className="mb-4">
                <TagTeamCard 
                  name={team.name}
                  firstUser={team.firstUser}
                  secondUser={team.secondUser}
                  interest={team.interest}
                  frequency={team.frequency}
                  resetDay={team.resetDay}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-full max-w-[280px] mx-auto">
              <AspectRatio ratio={16 / 9}>
                <img 
                  src="/lovable-uploads/6834f7c6-308c-44b6-833b-6bca71374722.png" 
                  alt="People collaborating" 
                  className="w-full h-full object-scale-down"
                />
              </AspectRatio>
            </div>
            <p className="text-center text-gray-600 mt-6 italic my-0">
              You don't seem to be in any tagteam,
              Your next tagteam is just a click away.
            </p>
          </div>
        )}
      </div>

      <AddTeamButton onClick={() => setIsSheetOpen(true)} />
      
      <CreateTeamSheet 
        isOpen={isSheetOpen} 
        onClose={() => setIsSheetOpen(false)} 
        onCreateTeam={handleAddTeam} 
        categories={userProfile.interests} 
      />
      
      {selectedTagTeam && (
        <TagTeamSheet 
          isOpen={isTagTeamSheetOpen}
          onClose={() => setIsTagTeamSheetOpen(false)}
          tagTeam={selectedTagTeam}
          currentUserId={userProfile.id}
        />
      )}
      
      <BottomNavigation />
    </main>
  );
};

export default TagTeamHub;

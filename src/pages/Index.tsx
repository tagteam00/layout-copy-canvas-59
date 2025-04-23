
import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { TagTeamList, TagTeam } from "@/components/home/TagTeamList";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { CreateTeamSheet } from "@/components/tagteam/CreateTeamSheet";
import { useUserData } from "@/hooks/useUserData";
import { UsersList } from "@/components/home/UsersList";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index: React.FC = () => {
  const {
    getUserData,
    getAllUsers
  } = useUserData();
  
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    username: "",
    interests: [] as string[]
  });
  
  const [userId, setUserId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State for tag teams
  const [tagTeams, setTagTeams] = useState<TagTeam[]>([]);
  
  // State for active navigation tab
  const [activeTab, setActiveTab] = useState("home");
  
  // State for sheet visibility
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  // Available categories from user's interests
  const categories = userProfile.interests;
  
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setUserId(user.id);
        }
        
        const userData = await getUserData();
        if (userData) {
          setUserProfile({
            fullName: userData.fullName,
            username: userData.username,
            interests: userData.interests
          });
        }
        
        const users = await getAllUsers();
        setAllUsers(users);
        
        // Load tagteams after user data is loaded
        if (user) {
          await fetchTagTeams(user.id);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Function to fetch user's tagteams
  const fetchTagTeams = async (userId: string) => {
    try {
      const { data: teams, error } = await supabase
        .from('teams')
        .select('*')
        .contains('members', [userId]);
        
      if (error) {
        console.error("Error fetching teams:", error);
        return;
      }
      
      console.log("Fetched teams:", teams);
      
      // Process teams to get partner information
      const processedTeams = await Promise.all(teams.map(async (team) => {
        // Find partner id (the member that is not the current user)
        const partnerId = team.members.find((member: string) => member !== userId);
        
        // Get partner profile
        let partnerName = "Team Member";
        if (partnerId) {
          const { data: partner } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', partnerId)
            .single();
            
          if (partner) {
            partnerName = partner.full_name;
          }
        }
        
        // Calculate time left based on frequency
        let timeLeft = "1 day";
        if (team.frequency.includes("Weekly")) {
          timeLeft = "7 days";
        }
        
        return {
          id: team.id,
          name: team.name,
          category: team.category,
          timeLeft: timeLeft,
          frequency: team.frequency,
          members: team.members,
          partnerId: partnerId,
          partnerName: partnerName,
          isLogged: false,
          partnerLogged: false
        };
      }));
      
      setTagTeams(processedTeams);
    } catch (error) {
      console.error("Error processing teams:", error);
      toast.error("Failed to load your TagTeams");
    }
  };

  // Navigation items
  const navItems = [{
    name: "Home",
    icon: "https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/c761f5256fcea0afdf72f5aa0ab3d05e40a3545b?placeholderIfAbsent=true",
    path: "/",
    isActive: activeTab === "home"
  }, {
    name: "Tagteam",
    icon: "https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/99b9d22862884f6e83475b74fa086fd10fb5e57f?placeholderIfAbsent=true",
    path: "/tagteam",
    isActive: activeTab === "tagteam"
  }, {
    name: "Profile",
    icon: "https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/6015a6ceb8f49982ed2ff6177f7ee6374f72c48d?placeholderIfAbsent=true",
    path: "/profile",
    isActive: activeTab === "profile"
  }];

  // Handler for adding a new team
  const handleAddTeam = (newTeam: TagTeam) => {
    setTagTeams([...tagTeams, newTeam]);
    setIsSheetOpen(false);
  };

  // Handler for opening the sheet
  const handleOpenSheet = () => {
    setIsSheetOpen(true);
  };
  
  // Refresh tagteams when component gains focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && userId) {
        fetchTagTeams(userId);
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId]);
  
  return <main className="flex flex-col min-h-screen bg-white max-w-[480px] w-full mx-auto relative pb-20">
      <AppHeader />
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-[8px]">
          {loading ? <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="flex gap-1 mt-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-16"></div>
              </div>
            </div> : <>
              <h1 className="text-2xl font-bold mb-2">Hello, {userProfile.fullName}</h1>
              <div className="flex items-center gap-1 mt-2">
                {userProfile.interests.map((interest, index) => <div key={index} className="bg-[rgba(130,122,255,1)] text-xs text-white px-2 py-1 rounded-xl whitespace-nowrap">
                    {interest}
                  </div>)}
              </div>
            </>}
        </div>
        <TagTeamList teams={tagTeams} onAddTeam={handleOpenSheet} userName={userProfile.fullName} />
        <div className="px-4">
          <UsersList users={allUsers} loading={loading} />
        </div>
      </div>

      <BottomNavigation items={navItems} />

      <CreateTeamSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} onCreateTeam={handleAddTeam} categories={categories} />
    </main>;
};

export default Index;

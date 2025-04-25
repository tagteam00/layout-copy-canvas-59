
import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/hooks/useUserData";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileInfo } from "@/components/profile/ProfileInfo";

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    username: "",
    dateOfBirth: "",
    gender: "",
    interests: [] as string[],
    commitmentLevel: "",
    profileImage: "https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/59e6c2f5f7d74dddae24e7adf98c5564a2e93e95?placeholderIfAbsent=true",
    city: "",
    country: "",
    occupation: "",
    bio: ""
  });

  const { getUserData } = useUserData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    try {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/signin");
        return;
      }
      
      const userData = await getUserData();
      if (userData) {
        setUserProfile(prevProfile => ({
          ...prevProfile,
          fullName: userData.fullName,
          username: userData.username,
          dateOfBirth: userData.dateOfBirth,
          gender: userData.gender,
          interests: userData.interests,
          commitmentLevel: userData.commitmentLevel,
          city: userData.city,
          country: userData.country,
          occupation: userData.occupation,
          bio: userData.bio
        }));
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [navigate, getUserData]);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      toast.success("Logged out successfully");
      navigate("/signin");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <main className="bg-white max-w-[480px] w-full overflow-hidden mx-auto">
      <AppHeader />
      <div className="p-4">
        <ProfileHeader 
          userProfile={userProfile}
          onProfileUpdate={fetchUserData}
        />
        <ProfileInfo userProfile={userProfile} />
        <Button 
          variant="destructive" 
          className="w-full mt-4" 
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </div>
      <BottomNavigation />
    </main>
  );
};

export default ProfilePage;

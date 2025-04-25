import React, { useState, useEffect } from "react";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { useUserData } from "@/hooks/useUserData";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    username: "",
    dateOfBirth: "",
    gender: "",
    interests: [] as string[],
    commitmentLevel: "",
    city: "",
    country: "",
    occupation: "",
    bio: ""
  });
  const {
    getUserData
  } = useUserData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const fetchUserData = async () => {
    try {
      const {
        data
      } = await supabase.auth.getSession();
      if (!data.session) {
        navigate("/signin");
        return;
      }
      const userData = await getUserData();
      if (userData) {
        setUserProfile(prevProfile => ({
          ...prevProfile,
          ...userData
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
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-white">
        <p>Loading profile...</p>
      </div>;
  }
  return <main className="bg-white min-h-screen max-w-[480px] w-full mx-auto relative">
      <div className="absolute top-4 right-4 flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => navigate("/settings")} className="rounded-full my-[16px]">
          <Settings className="h-5 w-5" />
        </Button>
      </div>
      <ProfileInfo userProfile={userProfile} onProfileUpdate={fetchUserData} />
      <BottomNavigation />
    </main>;
};
export default ProfilePage;
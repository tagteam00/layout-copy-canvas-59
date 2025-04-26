
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { useUserData } from "@/hooks/useUserData";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { toast } from "sonner";

const UserProfilePage: React.FC = () => {
  const { userId } = useParams();
  const { getUserData } = useUserData();
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: profileData, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();

        if (error) throw error;

        if (profileData) {
          setUserProfile({
            fullName: profileData.full_name || '',
            username: profileData.username || '',
            dateOfBirth: profileData.date_of_birth || '',
            gender: profileData.gender || '',
            interests: profileData.interests || [],
            commitmentLevel: profileData.commitment_level || '',
            city: profileData.city || '',
            country: profileData.country || '',
            occupation: profileData.occupation || '',
            bio: profileData.bio || ''
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user profile");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen bg-white">
      <p>Loading profile...</p>
    </div>;
  }

  return (
    <main className="bg-white min-h-screen max-w-[480px] w-full mx-auto relative pb-24">
      <ProfileInfo 
        userProfile={userProfile} 
        onProfileUpdate={() => {}}
        isPublicView={true}
      />
      <BottomNavigation />
    </main>
  );
};

export default UserProfilePage;

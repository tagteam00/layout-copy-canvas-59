
import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { ProfileInfo } from "@/components/profile/ProfileInfo";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUserData } from "@/hooks/useUserData";
import { UserData } from "@/types/supabase";

const UserProfilePage: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { getUserDataById } = useUserData();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserData>({
    fullName: "",
    username: "",
    dateOfBirth: "",
    gender: "",
    interests: [] as string[],
    commitmentLevel: "",
    city: "",
    country: "",
    occupation: "",
    bio: "",
    avatarUrl: null
  });

  // Use useCallback to memoize the fetchUserData function
  const fetchUserData = useCallback(async () => {
    if (!userId) {
      toast.error("User ID is missing");
      navigate(-1);
      return;
    }

    setLoading(true);
    try {
      const userData = await getUserDataById(userId);
      if (userData) {
        setUserProfile(userData);
      } else {
        toast.error("User profile not found");
        navigate(-1);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load user profile");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [userId, getUserDataById, navigate]);

  useEffect(() => {
    // Create abort controller for cleanup
    const abortController = new AbortController();
    
    // Set a timeout to handle cases where the request takes too long
    const timeoutId = setTimeout(() => {
      if (loading) {
        toast.error("Loading took too long. Please try again.");
        navigate(-1);
      }
    }, 10000); // 10 second timeout
    
    fetchUserData();
    
    // Cleanup function
    return () => {
      abortController.abort();
      clearTimeout(timeoutId);
    };
  }, [fetchUserData]); // Only depend on the memoized function

  const goBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <main className="bg-white min-h-screen max-w-[480px] w-full mx-auto relative">
      <div className="fixed top-4 left-4 z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={goBack} 
          className="rounded-full bg-gray-100/80 hover:bg-gray-200/80"
        >
          <ArrowLeft className="h-5 w-5 text-gray-900" />
        </Button>
      </div>
      <ProfileInfo userProfile={userProfile} onProfileUpdate={async () => {}} isViewOnly={true} />
    </main>
  );
};

export default UserProfilePage;

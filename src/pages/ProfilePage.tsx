
import React, { useState, useEffect } from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useUserData } from "@/hooks/useUserData";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const ProfilePage: React.FC = () => {
  const [userProfile, setUserProfile] = useState({
    fullName: "",
    username: "",
    dateOfBirth: "",
    gender: "",
    interests: [] as string[],
    commitmentLevel: "",
    profileImage: "https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/59e6c2f5f7d74dddae24e7adf98c5564a2e93e95?placeholderIfAbsent=true",
  });

  const { getUserData } = useUserData();
  const { signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        // Get user profile data
        const userData = await getUserData();
        if (userData) {
          setUserProfile({
            ...userProfile,
            fullName: userData.fullName,
            username: userData.username,
            dateOfBirth: userData.dateOfBirth,
            gender: userData.gender,
            interests: userData.interests,
            commitmentLevel: userData.commitmentLevel
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [getUserData]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out");
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Not provided";
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
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
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
            <img 
              src={userProfile.profileImage} 
              alt={userProfile.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{userProfile.fullName || "New User"}</h1>
            <p className="text-gray-600">@{userProfile.username || "username"}</p>
          </div>
        </div>

        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Date of Birth:</span>
                <span>{formatDate(userProfile.dateOfBirth)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gender:</span>
                <span>{userProfile.gender || "Not provided"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Commitment Level:</span>
                <Badge variant="outline">{userProfile.commitmentLevel || "Not set"}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Interests</h2>
            {userProfile.interests && userProfile.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {userProfile.interests.map((interest, index) => (
                  <Badge key={index} variant="secondary">
                    {interest}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No interests added yet</p>
            )}
          </CardContent>
        </Card>

        <Button 
          variant="destructive" 
          className="w-full" 
          onClick={handleLogout}
        >
          Log Out
        </Button>
      </div>

      <BottomNavigation items={navItems} />
    </main>
  );
};

export default ProfilePage;

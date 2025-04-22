
import React, { useState } from "react";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const ProfilePage: React.FC = () => {
  // State for user profile (this would be fetched from an API in a real app)
  const [userProfile, setUserProfile] = useState({
    fullName: "Divij Kumar",
    username: "Divij",
    dateOfBirth: "1995-08-15",
    gender: "Male",
    interests: ["Swimming", "Gym", "Football"],
    commitmentLevel: "Committed",
    profileImage: "https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/59e6c2f5f7d74dddae24e7adf98c5564a2e93e95?placeholderIfAbsent=true",
  });

  // State for active navigation tab
  const [activeTab, setActiveTab] = useState("profile");

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

  const handleLogout = () => {
    // Handle logout logic
    console.log("Logout");
    // Redirect to sign in page
    window.location.href = "/signin";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  return (
    <main className="bg-white max-w-[480px] w-full overflow-hidden mx-auto">
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
            <h1 className="text-2xl font-bold">{userProfile.fullName}</h1>
            <p className="text-gray-600">@{userProfile.username}</p>
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
                <span>{userProfile.gender}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Commitment Level:</span>
                <Badge variant="outline">{userProfile.commitmentLevel}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {userProfile.interests.map((interest, index) => (
                <Badge key={index} variant="secondary">
                  {interest}
                </Badge>
              ))}
            </div>
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

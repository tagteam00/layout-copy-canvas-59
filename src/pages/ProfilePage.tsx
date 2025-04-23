
import React from "react";
import { AppHeader } from "@/components/layout/AppHeader";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/hooks/useProfile";

const ProfilePage: React.FC = () => {
  const { signOut } = useAuth();
  const { data: profile, isLoading, isError } = useProfile();
  const [activeTab] = React.useState("profile");

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

  if (isError) {
    return (
      <main className="bg-white max-w-[480px] w-full overflow-hidden mx-auto">
        <AppHeader />
        <div className="p-4 text-center">
          <p className="text-red-500">Failed to load profile data</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </div>
        <BottomNavigation items={navItems} />
      </main>
    );
  }

  return (
    <main className="bg-white max-w-[480px] w-full overflow-hidden mx-auto">
      <AppHeader />
      <div className="p-4">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 rounded-full overflow-hidden mr-4">
            {isLoading ? (
              <Skeleton className="w-full h-full rounded-full" />
            ) : (
              <img 
                src="https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/59e6c2f5f7d74dddae24e7adf98c5564a2e93e95?placeholderIfAbsent=true" 
                alt={profile?.username || "Profile"}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            {isLoading ? (
              <div className="space-y-2">
                <Skeleton className="h-7 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-bold">{profile?.fullName || "New User"}</h1>
                <p className="text-gray-600">@{profile?.username || "username"}</p>
              </>
            )}
          </div>
        </div>

        <Card className="mb-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Personal Information</h2>
            <div className="space-y-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-6 w-full" />
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date of Birth:</span>
                    <span>{formatDate(profile?.dateOfBirth || '')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Gender:</span>
                    <span>{profile?.gender || "Not provided"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Commitment Level:</span>
                    <Badge variant="outline">{profile?.commitmentLevel || "Not set"}</Badge>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">Interests</h2>
            {isLoading ? (
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-16" />
              </div>
            ) : profile?.interests && profile.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
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

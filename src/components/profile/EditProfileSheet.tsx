
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Pencil } from "lucide-react";
import { useUserData } from "@/hooks/useUserData";
import { toast } from "sonner";
import { useInterests } from "@/hooks/useInterests";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface EditProfileSheetProps {
  currentProfile: {
    fullName: string;
    username: string;
    interests: string[];
    dateOfBirth: string;
    gender: string;
    commitmentLevel: string;
    city?: string;
    country?: string;
    occupation?: string;
    bio?: string;
  };
  onProfileUpdate: () => void;
}

export const EditProfileSheet: React.FC<EditProfileSheetProps> = ({
  currentProfile,
  onProfileUpdate,
}) => {
  const [fullName, setFullName] = React.useState(currentProfile.fullName);
  const [username, setUsername] = React.useState(currentProfile.username);
  const [interests, setInterests] = React.useState(currentProfile.interests);
  const [city, setCity] = React.useState(currentProfile.city || '');
  const [country, setCountry] = React.useState(currentProfile.country || '');
  const [occupation, setOccupation] = React.useState(currentProfile.occupation || '');
  const [bio, setBio] = React.useState(currentProfile.bio || '');

  const { saveUserData } = useUserData();
  const { interests: availableInterests, loading } = useInterests();

  const handleSave = async () => {
    try {
      const success = await saveUserData({
        fullName,
        username,
        interests,
        dateOfBirth: currentProfile.dateOfBirth,
        gender: currentProfile.gender,
        commitmentLevel: currentProfile.commitmentLevel,
        city,
        country,
        occupation,
        bio
      });
      
      if (success) {
        toast.success("Profile updated successfully");
        onProfileUpdate();
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleAddInterest = (newInterest: string) => {
    if (!interests.includes(newInterest)) {
      setInterests([...interests, newInterest]);
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(interests.filter(interest => interest !== interestToRemove));
  };

  const groupedInterests = availableInterests.reduce((acc, interest) => {
    if (!acc[interest.category]) {
      acc[interest.category] = [];
    }
    acc[interest.category].push(interest);
    return acc;
  }, {} as Record<string, typeof availableInterests>);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="rounded-full bg-gray-100/80 hover:bg-gray-200/80"
        >
          <Pencil className="h-5 w-5 text-gray-900" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Edit Profile</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Full Name</label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Username</label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">City</label>
            <Input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter your city"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Country</label>
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="Enter your country"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Occupation</label>
            <Input
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder="Enter your occupation"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Bio</label>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              rows={4}
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-2 block">Interests</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {interests.map((interest, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer"
                  onClick={() => handleRemoveInterest(interest)}
                >
                  {interest} ×
                </Badge>
              ))}
            </div>
            <Select
              onValueChange={handleAddInterest}
            >
              <SelectTrigger>
                <SelectValue placeholder="Add an interest" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(groupedInterests).map(([category, categoryInterests]) => (
                  <div key={category}>
                    <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </div>
                    {categoryInterests.map((interest) => (
                      <SelectItem 
                        key={interest.id} 
                        value={interest.name}
                        disabled={interests.includes(interest.name)}
                      >
                        {interest.name}
                      </SelectItem>
                    ))}
                  </div>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button className="w-full" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

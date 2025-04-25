
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useInterests } from "@/hooks/useInterests";
import { PersonalInfoSection } from "./edit-form/PersonalInfoSection";
import { BioSection } from "./edit-form/BioSection";
import { InterestsSection } from "./edit-form/InterestsSection";
import { toast } from "sonner";
import { useUserData } from "@/hooks/useUserData";

interface EditProfileSheetProps {
  currentProfile: {
    fullName: string;
    username: string;
    interests: string[];
    dateOfBirth: string;
    gender: string;
    commitmentLevel: string;
    city: string;
    country: string;
    occupation: string;
    bio: string;
  };
  onProfileUpdate: () => void;
}

export const EditProfileSheet: React.FC<EditProfileSheetProps> = ({
  currentProfile,
  onProfileUpdate,
}) => {
  const [formData, setFormData] = React.useState(currentProfile);
  const { interests: availableInterests, loading } = useInterests();
  const { saveUserData } = useUserData();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddInterest = (newInterest: string) => {
    if (!formData.interests.includes(newInterest)) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, newInterest],
      }));
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((interest) => interest !== interestToRemove),
    }));
  };

  const handleSave = async () => {
    try {
      const success = await saveUserData({
        fullName: formData.fullName,
        username: formData.username,
        interests: formData.interests,
        dateOfBirth: currentProfile.dateOfBirth,
        gender: currentProfile.gender,
        commitmentLevel: currentProfile.commitmentLevel,
        city: formData.city,
        country: formData.country,
        occupation: formData.occupation,
        bio: formData.bio
      });
      
      if (success) {
        toast.success("Profile updated successfully");
        onProfileUpdate();
      }
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

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
          <PersonalInfoSection
            fullName={formData.fullName}
            username={formData.username}
            city={formData.city}
            country={formData.country}
            occupation={formData.occupation}
            onInputChange={handleInputChange}
          />
          <BioSection 
            bio={formData.bio} 
            onInputChange={handleInputChange} 
          />
          <InterestsSection
            interests={formData.interests}
            availableInterests={availableInterests}
            onAddInterest={handleAddInterest}
            onRemoveInterest={handleRemoveInterest}
          />
          <Button className="w-full" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};


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

import { PersonalInfoSection } from "./edit-form/PersonalInfoSection";
import { BioSection } from "./edit-form/BioSection";

import { PhotoSection } from "./edit-form/PhotoSection";
import { InstagramSection } from "./edit-form/InstagramSection";
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
    avatarUrl?: string | null;
    fullAddress?: string;
    coordinates?: { lat: number; lng: number };
    instagramHandle?: string;
  };
  onProfileUpdate: () => void;
}

export const EditProfileSheet: React.FC<EditProfileSheetProps> = ({
  currentProfile,
  onProfileUpdate,
}) => {
  const [formData, setFormData] = React.useState(currentProfile);
  const [profileImage, setProfileImage] = React.useState<File | null>(null);
  
  const { saveUserData } = useUserData();
  const [isSaving, setIsSaving] = React.useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };


  const handleSave = async () => {
    try {
      setIsSaving(true);
      const success = await saveUserData({
        fullName: formData.fullName,
        username: formData.username,
        interests: currentProfile.interests, // Keep current interests unchanged
        dateOfBirth: currentProfile.dateOfBirth,
        gender: currentProfile.gender,
        commitmentLevel: currentProfile.commitmentLevel,
        city: formData.city,
        country: formData.country,
        occupation: formData.occupation,
        bio: formData.bio,
        avatarUrl: formData.avatarUrl,
        fullAddress: formData.fullAddress,
        coordinates: formData.coordinates,
        instagramHandle: formData.instagramHandle
      }, profileImage);
      
      if (success) {
        toast.success("Profile updated successfully");
        onProfileUpdate();
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsSaving(false);
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
        <div className="space-y-6 mt-4">
          <PhotoSection 
            avatarUrl={formData.avatarUrl}
            username={formData.username}
            onImageChange={setProfileImage}
          />
          <PersonalInfoSection
            fullName={formData.fullName}
            username={formData.username}
            city={formData.city}
            country={formData.country}
            occupation={formData.occupation}
            fullAddress={formData.fullAddress}
            onInputChange={handleInputChange}
          />
          <BioSection 
            bio={formData.bio} 
            onInputChange={handleInputChange} 
          />
          <InstagramSection
            instagramHandle={formData.instagramHandle || ''}
            onInputChange={handleInputChange}
          />
          <Button className="w-full" onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

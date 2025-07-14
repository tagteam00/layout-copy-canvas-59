
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ProfileImageUploader } from "@/components/profile/ProfileImageUploader";
import { Card } from "@/components/ui/card";

interface BioStepProps {
  onSubmit: (data: { bio: string, profileImage?: File | null }) => void;
  onBack: () => void;
  loading?: boolean;
}

export const BioStep: React.FC<BioStepProps> = ({ onSubmit, onBack, loading = false }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const handleFormSubmit = (data: any) => {
    onSubmit({ ...data, profileImage });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <h2 className="text-lg font-semibold mb-4">Complete your profile</h2>
      
      <Card className="p-6 flex flex-col items-center">
        <h3 className="text-md font-medium mb-4">Profile picture</h3>
        <ProfileImageUploader 
          onImageChange={(file) => setProfileImage(file)}
          size="xl"
        />
        <p className="text-xs text-gray-500 mt-2">
          Upload a profile picture (will be compressed to &lt;100KB)
        </p>
      </Card>
      
      <div>
        <label htmlFor="bio" className="block text-sm font-medium mb-1">Bio</label>
        <Textarea
          id="bio"
          placeholder="Share a bit about yourself..."
          {...register("bio", { 
            required: "Bio is required",
            maxLength: {
              value: 500,
              message: "Bio cannot exceed 500 characters"
            }
          })}
          className="w-full min-h-[120px] border border-[rgba(130,122,255,0.41)] rounded-xl"
        />
        {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message as string}</p>}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack} disabled={loading}>
          Back
        </Button>
        <Button 
          type="submit" 
          className="bg-black text-white hover:bg-black/90"
          disabled={loading}
        >
          {loading ? "Saving..." : "Complete"}
        </Button>
      </div>
    </form>
  );
};

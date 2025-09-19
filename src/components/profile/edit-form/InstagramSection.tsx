import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Instagram } from "lucide-react";
import { validateInstagramUrl, getInstagramUrlValidationError, extractUsernameFromUrl } from "@/utils/instagramValidation";

interface InstagramSectionProps {
  instagramUrl: string;
  onInputChange: (field: string, value: string) => void;
}

export const InstagramSection: React.FC<InstagramSectionProps> = ({
  instagramUrl,
  onInputChange,
}) => {
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = (value: string) => {
    // Use proper validation helper
    if (validateInstagramUrl(value)) {
      onInputChange("instagramUrl", value);
      setValidationError(null);
    } else {
      // Show specific validation error
      const errorMessage = getInstagramUrlValidationError(value);
      setValidationError(errorMessage);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Instagram className="h-5 w-5 text-pink-500" />
        <h3 className="text-lg font-semibold text-gray-900">Instagram</h3>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="instagramUrl" className="text-sm font-medium text-gray-700">
          Instagram Profile URL
        </Label>
        <Input
          id="instagramUrl"
          type="url"
          placeholder="https://instagram.com/username"
          value={instagramUrl}
          onChange={(e) => handleInputChange(e.target.value)}
          className={validationError ? 'border-red-500' : ''}
          maxLength={500}
        />
        {validationError ? (
          <p className="text-xs text-red-500">
            {validationError}
          </p>
        ) : (
          <p className="text-xs text-gray-500">
            Share your Instagram profile URL with your TagTeam partners to build stronger connections
          </p>
        )}
      </div>
    </div>
  );
};
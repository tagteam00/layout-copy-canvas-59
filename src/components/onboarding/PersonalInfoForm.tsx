
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useSanitizedInput } from "@/utils/sanitization";

interface PersonalInfoFormProps {
  onSubmit: (data: any) => void;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ onSubmit }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { sanitizeText, validateProfile } = useSanitizedInput();

  const handleFormSubmit = (data: any) => {
    const result = validateProfile(data);
    if (result.success) {
      onSubmit(result.data);
    } else {
      console.error('Validation errors:', result.error.errors);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
      
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
        <Input
          id="fullName"
          placeholder="Your full name"
          {...register("fullName", { required: "Full name is required" })}
          className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
        />
        {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message as string}</p>}
      </div>

      <div>
        <label htmlFor="username" className="block text-sm font-medium mb-1">Username</label>
        <Input
          id="username"
          placeholder="Pick a username"
          {...register("username", { required: "Username is required" })}
          className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
        />
        {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message as string}</p>}
      </div>

      <div>
        <label htmlFor="dateOfBirth" className="block text-sm font-medium mb-1">Date of Birth</label>
        <Input
          id="dateOfBirth"
          type="date"
          {...register("dateOfBirth", { required: "Date of birth is required" })}
          className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
        />
        {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message as string}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Gender</label>
        <RadioGroup defaultValue="" className="space-y-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="male" id="male" {...register("gender", { required: "Gender is required" })} />
            <Label htmlFor="male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="female" id="female" {...register("gender")} />
            <Label htmlFor="female">Female</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="other" id="other" {...register("gender")} />
            <Label htmlFor="other">Other</Label>
          </div>
        </RadioGroup>
        {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender.message as string}</p>}
      </div>

      <Button type="submit" className="w-full bg-black text-white hover:bg-black/90">
        Next
      </Button>
    </form>
  );
};

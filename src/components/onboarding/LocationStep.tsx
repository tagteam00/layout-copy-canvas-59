
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LocationStepProps {
  onSubmit: (data: { city: string; country: string }) => void;
  onBack: () => void;
}

export const LocationStep: React.FC<LocationStepProps> = ({ onSubmit, onBack }) => {
  const { register, handleSubmit, formState: { errors } } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Where are you based?</h2>
      
      <div>
        <label htmlFor="city" className="block text-sm font-medium mb-1">City</label>
        <Input
          id="city"
          placeholder="Your city"
          {...register("city", { required: "City is required" })}
          className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
        />
        {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message as string}</p>}
      </div>

      <div>
        <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
        <Input
          id="country"
          placeholder="Your country"
          {...register("country", { required: "Country is required" })}
          className="w-full border border-[rgba(130,122,255,0.41)] rounded-xl"
        />
        {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country.message as string}</p>}
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" className="bg-black text-white hover:bg-black/90">
          Next
        </Button>
      </div>
    </form>
  );
};

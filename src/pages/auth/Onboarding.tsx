
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

const interests = [
  "Swimming",
  "Gym",
  "Football",
  "Running",
  "Yoga",
  "Cycling",
  "Meditation",
  "Reading",
  "Cooking",
  "Hiking"
];

const commitmentLevels = [
  { value: "casual", label: "Casual", description: "Relaxed approach with flexible schedules" },
  { value: "committed", label: "Committed", description: "Consistent engagement with regular check-ins" },
  { value: "fun", label: "Fun", description: "Social and enjoyable activities without pressure" }
];

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();
  
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    dateOfBirth: "",
    gender: "",
    interests: [] as string[],
    commitmentLevel: ""
  });

  const handlePersonalInfoSubmit = (data) => {
    setFormData({ ...formData, ...data });
    setStep(2);
  };

  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleInterestsSubmit = () => {
    setFormData({ ...formData, interests: selectedInterests });
    setStep(3);
  };

  const handleCommitmentSubmit = (level: string) => {
    setFormData({ ...formData, commitmentLevel: level });
    
    // Save all user data and redirect to dashboard
    console.log("Complete form data:", { ...formData, commitmentLevel: level });
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-black">Let's set up your profile</h1>
          <div className="flex justify-center items-center mt-4">
            <div className={`w-3 h-3 rounded-full ${step === 1 ? 'bg-[rgba(130,122,255,1)]' : 'bg-gray-200'} mx-1`}></div>
            <div className={`w-3 h-3 rounded-full ${step === 2 ? 'bg-[rgba(130,122,255,1)]' : 'bg-gray-200'} mx-1`}></div>
            <div className={`w-3 h-3 rounded-full ${step === 3 ? 'bg-[rgba(130,122,255,1)]' : 'bg-gray-200'} mx-1`}></div>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            {step === 1 && (
              <form onSubmit={handleSubmit(handlePersonalInfoSubmit)} className="space-y-4">
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
                  <RadioGroup defaultValue={formData.gender} className="space-y-2">
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
            )}

            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Select Your Interests</h2>
                <p className="text-gray-600 text-sm">Choose activities you want to be accountable for</p>
                
                <div className="flex flex-wrap gap-2 my-4">
                  {interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant={selectedInterests.includes(interest) ? "default" : "outline"}
                      className={`cursor-pointer py-1.5 px-3 ${
                        selectedInterests.includes(interest) ? "bg-[rgba(130,122,255,1)]" : ""
                      }`}
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleInterestsSubmit}
                    disabled={selectedInterests.length === 0}
                    className="bg-black text-white hover:bg-black/90"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold">Commitment Level</h2>
                <p className="text-gray-600 text-sm">How do you prefer to approach your activities?</p>
                
                <div className="space-y-3">
                  {commitmentLevels.map((level) => (
                    <div
                      key={level.value}
                      className={`p-4 border rounded-xl cursor-pointer transition-all ${
                        formData.commitmentLevel === level.value 
                          ? "border-[rgba(130,122,255,1)] bg-[rgba(130,122,255,0.1)]"
                          : "border-gray-200 hover:border-[rgba(130,122,255,0.5)]"
                      }`}
                      onClick={() => setFormData({ ...formData, commitmentLevel: level.value })}
                    >
                      <h3 className="font-medium">{level.label}</h3>
                      <p className="text-sm text-gray-600">{level.description}</p>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)}>
                    Back
                  </Button>
                  <Button 
                    onClick={() => handleCommitmentSubmit(formData.commitmentLevel)}
                    disabled={!formData.commitmentLevel}
                    className="bg-black text-white hover:bg-black/90"
                  >
                    Complete
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;

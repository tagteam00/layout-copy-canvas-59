
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Frequency } from "@/types/tagteam";

interface FrequencyStepProps {
  frequency: Frequency;
  setFrequency: (frequency: Frequency) => void;
}

export const FrequencyStep: React.FC<FrequencyStepProps> = ({
  frequency,
  setFrequency,
}) => {
  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  const handleFrequencyTypeChange = (value: 'daily' | 'weekly') => {
    setFrequency({ 
      type: value, 
      day: value === 'weekly' ? 'Monday' : undefined // Always set a default day for weekly
    });
  };

  const handleResetDayChange = (day: string) => {
    setFrequency({ ...frequency, day });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Frequency Type</label>
        <RadioGroup
          value={frequency.type}
          onValueChange={handleFrequencyTypeChange}
          className="flex flex-col space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="daily" id="daily" />
            <Label htmlFor="daily">Daily</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="weekly" id="weekly" />
            <Label htmlFor="weekly">Weekly</Label>
          </div>
        </RadioGroup>
      </div>

      {frequency.type === 'weekly' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">Select Reset Day</label>
          <Select
            value={frequency.day || 'Monday'}
            onValueChange={handleResetDayChange}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select day of the week" />
            </SelectTrigger>
            <SelectContent>
              {weekDays.map((day) => (
                <SelectItem key={day} value={day}>
                  {day}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
};

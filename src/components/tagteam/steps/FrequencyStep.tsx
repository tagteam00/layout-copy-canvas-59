
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface FrequencyStepProps {
  frequency: { type: 'daily' | 'weekly'; day?: string | number };
  setFrequency: (frequency: { type: 'daily' | 'weekly'; day?: string | number }) => void;
}

export const FrequencyStep: React.FC<FrequencyStepProps> = ({
  frequency,
  setFrequency,
}) => {
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  // Convert day names to day numbers (0 = Sunday, 1 = Monday, etc.)
  const dayNameToNumber = (dayName: string): number => {
    const dayMap: {[key: string]: number} = {
      'sunday': 0,
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5,
      'saturday': 6
    };
    return dayMap[dayName.toLowerCase()] || 0;
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Frequency Type</label>
        <RadioGroup
          value={frequency.type}
          onValueChange={(value: 'daily' | 'weekly') =>
            setFrequency({ type: value, day: value === 'weekly' ? frequency.day : undefined })
          }
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
          <label className="block text-sm font-medium">Select Day</label>
          <Select
            value={typeof frequency.day === 'string' ? frequency.day : `${frequency.day}`}
            onValueChange={(day) => {
              // Store the day as a number if it's a day name, otherwise as a string
              const dayValue = isNaN(parseInt(day)) ? dayNameToNumber(day) : day;
              setFrequency({ ...frequency, day: dayValue });
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select day of the week" />
            </SelectTrigger>
            <SelectContent>
              {weekDays.map((day, index) => (
                <SelectItem key={day} value={day.toLowerCase()}>
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

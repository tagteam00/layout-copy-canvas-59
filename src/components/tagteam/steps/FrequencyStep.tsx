
import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface FrequencyStepProps {
  frequency: { type: 'daily' | 'weekly'; day?: string };
  setFrequency: (frequency: { type: 'daily' | 'weekly'; day?: string }) => void;
}

export const FrequencyStep: React.FC<FrequencyStepProps> = ({
  frequency,
  setFrequency,
}) => {
  const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

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
            value={frequency.day}
            onValueChange={(day) => setFrequency({ ...frequency, day })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select day of the week" />
            </SelectTrigger>
            <SelectContent>
              {weekDays.map((day) => (
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

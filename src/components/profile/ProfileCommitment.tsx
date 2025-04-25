
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

interface ProfileCommitmentProps {
  commitmentLevel: string;
}

export const ProfileCommitment: React.FC<ProfileCommitmentProps> = ({ commitmentLevel }) => {
  return (
    <Card className="bg-white shadow-sm">
      <CardHeader>
        <h2 className="text-lg font-semibold">Commitment</h2>
      </CardHeader>
      <CardContent>
        <Badge 
          variant="secondary" 
          className="text-white bg-slate-800 py-[8px] px-[16px]"
        >
          {commitmentLevel}
        </Badge>
      </CardContent>
    </Card>
  );
};

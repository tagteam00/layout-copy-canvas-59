import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
interface ProfileCommitmentProps {
  commitmentLevel: string;
}
export const ProfileCommitment: React.FC<ProfileCommitmentProps> = ({
  commitmentLevel
}) => {
  return <Card className="bg-white border border-gray-100 shadow-sm">
      <CardHeader className="pb-2">
        <h2 className="text-lg font-semibold">Commitment</h2>
      </CardHeader>
      <CardContent>
        <Badge variant="secondary" className="text-white py-1.5 px-4 rounded-full bg-slate-950">
          {commitmentLevel || "Not specified"}
        </Badge>
      </CardContent>
    </Card>;
};
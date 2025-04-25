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
      <CardHeader className="pb-2 py-0">
        <h2 className="text-lg font-semibold">Commitment:</h2>
      </CardHeader>
      <CardContent className="my-0 py-[4px]">
        <Badge variant="secondary" className="text-white px-4 rounded-full bg-slate-950 py-[12px]">
          {commitmentLevel || "Not specified"}
        </Badge>
      </CardContent>
    </Card>;
};
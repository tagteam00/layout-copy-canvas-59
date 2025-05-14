import React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
interface ProfileCommitmentProps {
  commitmentLevel: string;
}
export const ProfileCommitment: React.FC<ProfileCommitmentProps> = ({
  commitmentLevel
}) => {
  return <Card className="border border-gray-100 shadow-sm bg-[#eceaff] py-[8px] my-[12px]">
      <CardHeader className="pb-2 py-[4px] my-[2px] px-[16px]">
        <h2 className="text-lg font-semibold px-0">Commitment:</h2>
      </CardHeader>
      <CardContent className="my-0 py-0 px-[16px]">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="text-white px-4 rounded-full bg-slate-950 py-[7px]">
            {commitmentLevel || "Not specified"}
          </Badge>
        </div>
      </CardContent>
    </Card>;
};
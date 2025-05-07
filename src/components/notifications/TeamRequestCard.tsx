
import React from "react";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

interface TeamRequest {
  id: string;
  name: string;
  category: string;
  frequency: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  sender_name?: string;
}

interface TeamRequestCardProps {
  request: TeamRequest;
  onAccept: (requestId: string, teamName: string) => void;
  onReject: (requestId: string, teamName: string) => void;
}

export const TeamRequestCard: React.FC<TeamRequestCardProps> = ({ 
  request, 
  onAccept, 
  onReject 
}) => {
  return (
    <Card className="border-[rgba(130,122,255,0.41)]">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{request.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm mb-1">
          <span className="font-medium">{request.sender_name}</span> invited you to join their TagTeam
        </p>
        <div className="flex gap-2 mt-2">
          <Badge className="bg-[rgba(130,122,255,1)]">{request.category}</Badge>
          <Badge variant="outline">{request.frequency}</Badge>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button
          variant="outline"
          className="border-red-500 text-red-500 hover:bg-red-50"
          onClick={() => onReject(request.id, request.name)}
        >
          <X className="w-4 h-4 mr-1" />
          Reject
        </Button>
        <Button
          className="bg-[#827AFF] hover:bg-[#827AFF]/90"
          onClick={() => onAccept(request.id, request.name)}
        >
          <Check className="w-4 h-4 mr-1" />
          Accept
        </Button>
      </CardFooter>
    </Card>
  );
};

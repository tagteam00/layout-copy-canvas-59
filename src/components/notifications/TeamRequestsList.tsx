
import React from "react";
import { TeamRequestCard } from "./TeamRequestCard";

interface TeamRequest {
  id: string;
  name: string;
  category: string;
  frequency: string;
  reset_day?: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  sender_name?: string;
}

interface TeamRequestsListProps {
  requests: TeamRequest[];
  onAccept: (requestId: string, teamName: string, category: string) => void;
  onReject: (requestId: string, teamName: string) => void;
}

export const TeamRequestsList: React.FC<TeamRequestsListProps> = ({
  requests,
  onAccept,
  onReject
}) => {
  if (requests.length === 0) return null;

  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium mb-3">Tag Team Requests</h2>
      <div className="space-y-4">
        {requests.map((request) => (
          <TeamRequestCard
            key={request.id}
            request={request}
            onAccept={onAccept}
            onReject={onReject}
          />
        ))}
      </div>
    </div>
  );
};

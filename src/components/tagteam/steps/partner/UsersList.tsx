
import React from "react";
import { UserItem } from "./UserItem";

interface UsersListProps {
  users: Array<{
    id: string;
    fullName: string;
    username: string;
    hasActiveTeam?: boolean;
  }>;
  onSelectPartner?: (fullName: string, partnerId: string) => void;
  isAvailable: boolean;
  title: string;
}

export const UsersList: React.FC<UsersListProps> = ({ 
  users, 
  onSelectPartner, 
  isAvailable,
  title 
}) => {
  if (users.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700 mt-4 mb-2">{title}</h3>
      <div className="space-y-2">
        {users.map(user => (
          <UserItem 
            key={user.id} 
            user={user} 
            onSelectPartner={onSelectPartner}
            isAvailable={isAvailable} 
          />
        ))}
      </div>
    </div>
  );
};

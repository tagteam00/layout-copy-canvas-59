
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserItemProps {
  user: {
    id: string;
    fullName: string;
    username: string;
    hasActiveTeam?: boolean;
    avatarUrl?: string | null;
  };
  onSelectPartner?: (fullName: string, partnerId: string) => void;
  isAvailable: boolean;
}

export const UserItem: React.FC<UserItemProps> = ({ user, onSelectPartner, isAvailable }) => {
  const navigate = useNavigate();
  
  const handleViewProfile = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/user/${user.id}`);
  };
  
  return (
    <div 
      className={`p-4 border ${isAvailable 
        ? 'border-[rgba(130,122,255,0.41)] hover:bg-[rgba(130,122,255,0.1)]' 
        : 'border-gray-200 bg-gray-50 opacity-70'
      } rounded-xl flex items-center justify-between transition-colors`}
    >
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          {user.avatarUrl && (
            <AvatarImage 
              src={user.avatarUrl} 
              alt={user.fullName || user.username}
              className="object-cover"
            />
          )}
          <AvatarFallback>
            {user.fullName?.charAt(0) || user.username?.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{user.fullName}</p>
          <p className="text-sm text-gray-500">@{user.username}</p>
        </div>
      </div>
      
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-600 p-2"
          onClick={handleViewProfile}
        >
          <User className="h-4 w-4 mr-1" />
          <span className="text-xs">Profile</span>
        </Button>
        
        {isAvailable ? (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onSelectPartner && onSelectPartner(user.fullName, user.id);
            }} 
            className="flex items-center space-x-1 text-white px-3 py-1.5 rounded-lg transition-colors bg-gray-950 hover:bg-gray-800"
          >
            <span>Select</span>
          </button>
        ) : (
          <span className="text-xs text-gray-500 py-1 px-2 bg-gray-100 rounded">
            Has active team
          </span>
        )}
      </div>
    </div>
  );
};

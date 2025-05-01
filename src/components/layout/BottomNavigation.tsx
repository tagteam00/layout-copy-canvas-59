
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1f1f1f] border-t border-gray-100/10">
      <div className="max-w-[480px] mx-auto px-4">
        <div className="flex items-center justify-center gap-10 py-3">
          <NavLink 
            to="/home" 
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center gap-1 relative",
              isActive ? "text-[#8B83FF]" : "text-gray-400"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute top-0 -translate-y-1/2 w-12 h-8 bg-[#45435E] rounded-full -z-10" />
                )}
                <Home className="w-5 h-5" />
                <span className="text-xs">Home</span>
              </>
            )}
          </NavLink>
          
          <NavLink 
            to="/tagteam" 
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center gap-1 relative",
              isActive ? "text-[#8B83FF]" : "text-gray-400"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute top-0 -translate-y-1/2 w-12 h-8 bg-[#45435E] rounded-full -z-10" />
                )}
                <Users className="w-5 h-5" />
                <span className="text-xs">Tagteam</span>
              </>
            )}
          </NavLink>
          
          <NavLink 
            to="/profile" 
            className={({ isActive }) => cn(
              "flex flex-col items-center justify-center gap-1 relative",
              isActive ? "text-[#8B83FF]" : "text-gray-400"
            )}
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className="absolute top-0 -translate-y-1/2 w-12 h-8 bg-[#45435E] rounded-full -z-10" />
                )}
                <User className="w-5 h-5" />
                <span className="text-xs">Profile</span>
              </>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  );
};

export { BottomNavigation };

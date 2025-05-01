import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
const BottomNavigation: React.FC = () => {
  const location = useLocation();
  return <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-100/10 rounded-t-lg bg-[#0f0f11]">
      <div className="max-w-[480px] mx-auto px-4">
        <div className="flex items-center justify-center gap-10 py-3">
          <NavLink to="/home" className={({
          isActive
        }) => cn("flex flex-col items-center justify-center gap-1", isActive ? "text-[#8B83FF]" : "text-gray-400")}>
            <Home className="w-5 h-5" />
            <span className="text-xs">Home</span>
          </NavLink>
          
          <NavLink to="/tagteam" className={({
          isActive
        }) => cn("flex flex-col items-center justify-center gap-1", isActive ? "text-[#8B83FF]" : "text-gray-400")}>
            <Users className="w-5 h-5" />
            <span className="text-xs">Tagteam</span>
          </NavLink>
          
          <NavLink to="/profile" className={({
          isActive
        }) => cn("flex flex-col items-center justify-center gap-1", isActive ? "text-[#8B83FF]" : "text-gray-400")}>
            <User className="w-5 h-5" />
            <span className="text-xs">Profile</span>
          </NavLink>
        </div>
      </div>
    </nav>;
};
export { BottomNavigation };
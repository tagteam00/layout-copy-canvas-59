import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Home, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
const BottomNavigation: React.FC = () => {
  const location = useLocation();
  return <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 rounded-[20px] px-6 py-3 shadow-[0_4px_15px_rgba(130,122,255,0.1)] border border-gray-100/50 flex items-center justify-center gap-12 w-[calc(100%-32px)] max-w-[480px] bg-slate-50">
      <NavLink to="/" className={({
      isActive
    }) => cn("flex flex-col items-center justify-center gap-1", isActive ? "text-[#827AFF]" : "text-gray-400")}>
        <Home className="w-5 h-5" />
        <span className="text-xs">Home</span>
      </NavLink>
      
      <NavLink to="/tagteam" className={({
      isActive
    }) => cn("flex flex-col items-center justify-center gap-1", isActive ? "text-[#827AFF]" : "text-gray-400")}>
        <Users className="w-5 h-5" />
        <span className="text-xs">Tagteam</span>
      </NavLink>
      
      <NavLink to="/profile" className={({
      isActive
    }) => cn("flex flex-col items-center justify-center gap-1", isActive ? "text-[#827AFF]" : "text-gray-400")}>
        <User className="w-5 h-5" />
        <span className="text-xs">Profile</span>
      </NavLink>
    </nav>;
};
export { BottomNavigation };
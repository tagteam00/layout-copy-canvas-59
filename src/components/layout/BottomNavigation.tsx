
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Users, User } from "lucide-react";

export interface NavItem {
  name: string;
  icon: React.FC<{ size?: number; className?: string }>;
  path: string;
  isActive: boolean;
}

interface BottomNavigationProps {
  items?: NavItem[];
}

export const BottomNavigation: React.FC<BottomNavigationProps> = () => {
  const location = useLocation();
  
  const navItems = [
    {
      name: "Home",
      icon: Home,
      path: "/",
      isActive: location.pathname === "/",
    },
    {
      name: "Tagteam",
      icon: Users,
      path: "/tagteam",
      isActive: location.pathname === "/tagteam",
    },
    {
      name: "Profile",
      icon: User,
      path: "/profile",
      isActive: location.pathname === "/profile",
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 flex w-full items-center gap-2 pt-3 pb-4 px-3 bg-white border-t border-gray-200 max-w-[480px] mx-auto z-50">
      {navItems.map((item, index) => {
        const Icon = item.icon;
        return (
          <Link
            key={index}
            to={item.path}
            className={`self-stretch flex flex-col items-center gap-1 flex-1 ${
              item.isActive
                ? "text-gray-900"
                : "text-gray-400"
            }`}
          >
            <Icon
              size={24}
              className={item.isActive ? "fill-current" : ""}
            />
            <span className="text-xs">{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};

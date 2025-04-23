
import React from "react";
import { Link } from "react-router-dom";
import { Home, Users, User } from "lucide-react";

interface NavItem {
  name: string;
  icon: string | React.ReactNode;
  path: string;
  isActive: boolean;
}

interface BottomNavigationProps {
  items: NavItem[];
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  items,
}) => {
  const filteredItems = items.filter(item => item.name !== "Notifications");
  return (
    <nav className="fixed bottom-0 left-0 right-0 flex w-full items-center gap-2 pt-3 pb-4 px-3 bg-white border-t border-gray-200 max-w-[480px] mx-auto z-50">
      {filteredItems.map((item, index) => {
        // Determine icon to use
        let IconComponent;
        switch(item.name) {
          case "Home":
            IconComponent = Home;
            break;
          case "Tagteam":
            IconComponent = Users;
            break;
          case "Profile":
            IconComponent = User;
            break;
          default:
            IconComponent = Home;
        }
        
        // Active state styles
        const activeStyles = item.isActive 
          ? "text-black font-bold" 
          : "text-[#9F9EA1] font-normal";

        return (
          <Link
            key={index}
            to={item.path}
            className={`self-stretch flex flex-col items-center text-xs whitespace-nowrap text-center leading-[22px] flex-1 shrink basis-[0%] my-auto ${activeStyles}`}
          >
            <div
              className={item.isActive ? "bg-[rgba(130,122,255,0.13)] self-center flex min-h-8 w-16 items-center gap-2.5 overflow-hidden justify-center px-[3px] py-[7px] rounded-xl" : ""}
            >
              <IconComponent
                size={24}
                strokeWidth={item.isActive ? 2.5 : 1.8}
                fill={item.isActive ? "currentColor" : "none"}
                color={item.isActive ? "#000000" : "#9F9EA1"}
              />
            </div>
            <div className="mt-1">{item.name}</div>
          </Link>
        );
      })}
    </nav>
  );
};

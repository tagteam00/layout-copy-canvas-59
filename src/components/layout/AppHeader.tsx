
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchUnreadNotificationsCount } from "@/services/goalService";

export const AppHeader = () => {
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notification count when component mounts
  useEffect(() => {
    fetchUnreadNotifications();
    
    // Set up real-time subscription for notifications and team requests
    const channel = supabase
      .channel('notification-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'team_requests'
        },
        () => {
          fetchUnreadNotifications();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications'
        },
        () => {
          fetchUnreadNotifications();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: 'read=eq.true'
        },
        () => {
          fetchUnreadNotifications();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchUnreadNotifications = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      // Get combined count from notifications and team requests
      const count = await fetchUnreadNotificationsCount(user.id);
      setUnreadCount(count);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  return (
    <div className="pt-[20px] pb-[11px] px-[15px] border-b py-[21px]">
      <div className="flex w-full items-center justify-between">
        <Link to="/">
          <img src="https://cdn.builder.io/api/v1/image/assets/579c825d05dd49c6a1b702d151caec64/0d01db784baab711236c04557204350e8d25d164" alt="TagTeam Logo" className="aspect-[3.27] object-contain w-[124px]" />
        </Link>
        <div className="relative">
          <button 
            aria-label="Notifications" 
            onClick={() => navigate("/notifications")} 
            style={{ boxShadow: "0 1px 2px rgba(130,122,255,0.04)" }} 
            className="flex min-h-10 items-center gap-2.5 overflow-hidden justify-center w-10 h-10 rounded-[100px] bg-gray-100"
          >
            <Bell className="w-[18px] h-[18px]" />
          </button>
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

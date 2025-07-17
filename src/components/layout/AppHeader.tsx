
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { fetchUnreadNotificationsCount } from "@/services/notificationService";
import { useAuth } from "@/contexts/AuthContext";

export const AppHeader = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Function to fetch notifications with better error handling
  const fetchUnreadNotifications = async (retryCount = 0) => {
    try {
      console.log('Fetching unread notifications...');
      
      if (!user) {
        console.log('No user found, skipping notification fetch');
        setUnreadCount(0);
        return;
      }
      
      const count = await fetchUnreadNotificationsCount(user.id);
      console.log('Unread notifications count:', count);
      setUnreadCount(count);
      setIsInitialized(true);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      
      // Retry logic - try up to 3 times with increasing delay
      if (retryCount < 3) {
        console.log(`Retrying notification fetch (attempt ${retryCount + 1})`);
        setTimeout(() => {
          fetchUnreadNotifications(retryCount + 1);
        }, 1000 * (retryCount + 1)); // 1s, 2s, 3s delays
      } else {
        setIsInitialized(true);
      }
    }
  };

  // Monitor authentication state and fetch notifications when user is available
  useEffect(() => {
    console.log('AppHeader: Auth state changed', { user: !!user, authLoading });
    
    if (authLoading) {
      console.log('Auth still loading, waiting...');
      return;
    }
    
    if (user && !isInitialized) {
      console.log('User authenticated, fetching notifications');
      fetchUnreadNotifications();
    } else if (!user) {
      console.log('User not authenticated, resetting notification count');
      setUnreadCount(0);
      setIsInitialized(true);
    }
  }, [user, authLoading, isInitialized]);

  // Set up real-time subscription for notifications and team requests
  useEffect(() => {
    if (!user) return;

    console.log('Setting up real-time subscription for notifications');
    
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
          console.log('New team request received, refreshing count');
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
          console.log('New notification received, refreshing count');
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
          console.log('Notification marked as read, refreshing count');
          fetchUnreadNotifications();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up notification subscription');
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <div className="pt-[20px] pb-[11px] px-[15px] border-b py-[21px]">
      <div className="flex w-full items-center justify-between">
        <Link to={user ? "/home" : "/"}>
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

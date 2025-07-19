
import React from "react";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InstagramConnectProps {
  partnerName: string;
  partnerInstagramHandle?: string;
  currentUserName: string;
}

// Helper function to extract username from Instagram URL or handle
const getInstagramUsername = (handle: string): string => {
  if (handle.includes('instagram.com/')) {
    // Extract username from URL
    const match = handle.match(/instagram\.com\/([^/?]+)/);
    return match ? match[1] : handle;
  }
  // If it's just a username, remove @ if present
  return handle.replace('@', '');
};

// Helper function to create Instagram URL
const getInstagramUrl = (handle: string): string => {
  const username = getInstagramUsername(handle);
  return `https://instagram.com/${username}`;
};

export const InstagramConnect: React.FC<InstagramConnectProps> = ({
  partnerName,
  partnerInstagramHandle,
  currentUserName,
}) => {
  if (!partnerInstagramHandle) {
    return null;
  }

  const handleConnect = () => {
    const instagramUrl = getInstagramUrl(partnerInstagramHandle);
    // iOS-safe navigation - create link element and click it
    const link = document.createElement('a');
    link.href = instagramUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.click();
  };

  return (
    <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
            <Instagram className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">
              Connect with {partnerName} on Instagram
            </p>
            <p className="text-xs text-gray-600">
              Stay connected and share your progress
            </p>
          </div>
        </div>
        <Button
          onClick={handleConnect}
          size="sm"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium px-4 py-2 rounded-lg"
        >
          Connect
        </Button>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Instagram, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { extractUsernameFromUrl } from "@/utils/instagramValidation";

interface InstagramSectionProps {
  currentUserId: string;
  partnerUserId: string;
  partnerName: string;
}

interface UserInstagramData {
  name: string;
  instagramUrl: string;
  username: string;
}

export const InstagramSection: React.FC<InstagramSectionProps> = ({
  currentUserId,
  partnerUserId,
  partnerName,
}) => {
  const [instagramData, setInstagramData] = useState<UserInstagramData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstagramUrls = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, instagram_url')
          .eq('id', partnerUserId);

        if (error) {
          console.error('Error fetching Instagram URLs:', error);
          return;
        }

        const urls = data
          .filter(profile => profile.instagram_url && profile.instagram_url.trim() !== '')
          .map(profile => ({
            name: profile.full_name || 'Unknown',
            instagramUrl: profile.instagram_url as string,
            username: extractUsernameFromUrl(profile.instagram_url as string)
          }));

        setInstagramData(urls);
      } catch (error) {
        console.error('Error fetching Instagram URLs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramUrls();
  }, [partnerUserId]);

  if (loading) {
    return null;
  }

  if (instagramData.length === 0) {
    return null;
  }

  const handleInstagramClick = (url: string) => {
    // Open Instagram URL directly in a new tab
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-xl p-4 mb-4">
      <div className="flex items-center gap-2 mb-3">
        <Instagram className="h-5 w-5 text-pink-500" />
        <h3 className="text-sm font-semibold text-gray-900">Connect on Instagram</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {instagramData.map((user, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="cursor-pointer hover:bg-pink-50 hover:text-pink-700 transition-colors flex items-center gap-2 px-3 py-1.5"
            onClick={() => handleInstagramClick(user.instagramUrl)}
          >
            <span className="text-sm">@{user.username || 'Instagram'}</span>
            <span className="text-xs text-gray-500">({user.name})</span>
            <ExternalLink className="h-3 w-3" />
          </Badge>
        ))}
      </div>
    </div>
  );
};
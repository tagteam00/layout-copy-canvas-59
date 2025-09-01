import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Instagram, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface InstagramSectionProps {
  currentUserId: string;
  partnerUserId: string;
  partnerName: string;
}

interface UserInstagramData {
  name: string;
  instagramHandle: string;
}

export const InstagramSection: React.FC<InstagramSectionProps> = ({
  currentUserId,
  partnerUserId,
  partnerName,
}) => {
  const [instagramData, setInstagramData] = useState<UserInstagramData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstagramHandles = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, instagram_handle')
          .eq('id', partnerUserId);

        if (error) {
          console.error('Error fetching Instagram handles:', error);
          return;
        }

        const handles = data
          .filter(profile => profile.instagram_handle && profile.instagram_handle.trim() !== '')
          .map(profile => ({
            name: profile.full_name || 'Unknown',
            instagramHandle: profile.instagram_handle as string
          }));

        setInstagramData(handles);
      } catch (error) {
        console.error('Error fetching Instagram handles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramHandles();
  }, [partnerUserId]);

  if (loading) {
    return null;
  }

  if (instagramData.length === 0) {
    return null;
  }

  const handleInstagramClick = (handle: string) => {
    const url = `https://instagram.com/${handle.replace('@', '')}`;
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
            onClick={() => handleInstagramClick(user.instagramHandle)}
          >
            <span className="text-sm">@{user.instagramHandle}</span>
            <span className="text-xs text-gray-500">({user.name})</span>
            <ExternalLink className="h-3 w-3" />
          </Badge>
        ))}
      </div>
    </div>
  );
};
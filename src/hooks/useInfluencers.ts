import { useState, useEffect } from 'react';
import { influencersAPI, Influencer as APIInfluencer } from '@/lib/api';

export interface Influencer {
  id: string;
  name: string;
  platform: string | null;
  platform_link: string | null;
  follower_count: number | null;
  engagement_rate: number;
  match_score: number | null;
  categories: string | null;
  location: string | null;
  profile_image: string | null;
  average_views: number | null;
  created_at: string | null;
  email: string | null;
}

interface UseInfluencersReturn {
  influencers: Influencer[];
  loading: boolean;
  error: string | null;
  canAccessContactInfo: (influencerId: string) => boolean;
  refetch: () => Promise<void>;
}

// Transform API influencer to frontend influencer format
function transformInfluencer(apiInfluencer: APIInfluencer): Influencer {
  return {
    id: apiInfluencer._id,
    name: apiInfluencer.name,
    platform: apiInfluencer.platform || null,
    platform_link: apiInfluencer.profileUrl || null,
    follower_count: apiInfluencer.followers || null,
    engagement_rate: apiInfluencer.engagement || 0,
    match_score: null, // Not in API response
    categories: apiInfluencer.categories?.join(', ') || apiInfluencer.niche?.join(', ') || null,
    location: apiInfluencer.country || null,
    profile_image: null, // Not in API response
    average_views: apiInfluencer.avgViews || null,
    created_at: apiInfluencer.createdAt || null,
    email: apiInfluencer.email || null,
  };
}

export function useInfluencers(): UseInfluencersReturn {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Permission function - for now, always allow access if logged in
   * Can be enhanced later with role-based access
   */
  const canAccessContactInfo = (influencerId: string): boolean => {
    // For now, allow access to all logged-in users
    // This can be enhanced with proper role checking
    return true;
  };

  const fetchInfluencers = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await influencersAPI.getAll();

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch influencers');
      }

      // Handle different response structures
      const apiInfluencers = (result.data as any)?.influencers || result.data || [];

      if (Array.isArray(apiInfluencers)) {
        const transformedInfluencers = apiInfluencers.map(transformInfluencer);
        setInfluencers(transformedInfluencers);
      } else {
        setInfluencers([]);
      }
    } catch (err: any) {
      console.error('Error fetching influencers:', err);
      setError(err.message || 'Failed to fetch influencers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInfluencers();
  }, []);

  return {
    influencers,
    loading,
    error,
    canAccessContactInfo,
    refetch: fetchInfluencers,
  };
}

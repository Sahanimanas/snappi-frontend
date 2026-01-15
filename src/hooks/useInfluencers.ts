import { useState, useEffect } from 'react';
import { influencersAPI, Influencer, InfluencerFilters } from '@/lib/api';

// Use the InfluencerFilters from api.ts which matches backend query params
export interface InfluencerQueryParams extends InfluencerFilters {
  // Additional frontend-specific params if needed
}

export interface PaginationData {
  currentPage: number;
  limit: number;
  total: number;
  pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface UseInfluencersReturn {
  influencers: Influencer[];
  pagination: PaginationData | null;
  loading: boolean;
  error: string | null;
  canAccessContactInfo: (influencerId: string) => boolean;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch and manage influencers data
 * Now uses the correct backend data structure without transformation
 */
export function useInfluencers(queryParams: InfluencerQueryParams = {}): UseInfluencersReturn {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user can access contact info (implement your logic here)
  const canAccessContactInfo = (influencerId: string): boolean => {
    // TODO: Implement based on subscription/permission logic
    return true;
  };

  const fetchInfluencers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Call API with query params
      const result = await influencersAPI.getAll(queryParams);

      if (!result.success) {
        throw new Error(result.message || 'Failed to fetch influencers');
      }

      // Backend response structure:
      // {
      //   success: true,
      //   count: 10,
      //   pagination: { page, pages, total, limit, hasNextPage, hasPrevPage },
      //   data: [...influencers]  // Array directly
      // }
      
      // Extract influencers array (result.data is already the array)
      const influencersData = result.data || [];
      
      // Extract pagination from top level (not nested in data)
      const paginationData = (result as any).pagination || null;

      // console.log('API Response:', result);
      // console.log('Influencers Data:', influencersData);
      // console.log('Pagination Data:', paginationData);

      // Set influencers directly (no transformation needed)
      if (Array.isArray(influencersData)) {
        setInfluencers(influencersData);
      } else {
        console.warn('Influencers data is not an array:', influencersData);
        setInfluencers([]);
      }
      
      // Transform pagination if it exists
      if (paginationData) {
        setPagination({
          currentPage: paginationData.page || paginationData.currentPage || 1,
          limit: paginationData.limit || 10,
          total: paginationData.totalItems || 0,
          pages: paginationData.pages || 1,
          hasNextPage: paginationData.hasNextPage || false,
          hasPrevPage: paginationData.hasPrevPage || false,
        });
      } else {
        setPagination(null);
      }
    } catch (err: any) {
      console.error('Error fetching influencers:', err);
      setError(err.message || 'Failed to fetch influencers');
      setInfluencers([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when query params change
  useEffect(() => {
    // Debounce search queries to avoid excessive API calls
    const isSearchQuery = queryParams.search && queryParams.search.length > 0;
    const debounceTime = isSearchQuery ? 300 : 0;

    const timer = setTimeout(() => {
      fetchInfluencers();
    }, debounceTime);

    return () => clearTimeout(timer);
  }, [
    // Track all query parameters
    queryParams.page,
    queryParams.limit,
    queryParams.search,
    queryParams.platform,
    queryParams.minFollowers,
    queryParams.maxFollowers,
    queryParams.niche,
    queryParams.country,
  ]);

  return { 
    influencers, 
    pagination, 
    loading, 
    error, 
    canAccessContactInfo, 
    refetch: fetchInfluencers 
  };
}

/**
 * Helper function to format follower count
 * Usage: formatFollowerCount(50000) => "50K"
 */
export function formatFollowerCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Helper function to format engagement rate
 * Usage: formatEngagementRate(5.67) => "5.7%"
 */
export function formatEngagementRate(rate: number): string {
  return `${rate.toFixed(1)}%`;
}

/**
 * Helper function to get platform color
 */
export function getPlatformColor(platform: string): string {
  const colors: Record<string, string> = {
    instagram: 'bg-pink-500',
    youtube: 'bg-red-500',
    tiktok: 'bg-black',
    facebook: 'bg-blue-600',
    twitter: 'bg-sky-500',
    linkedin: 'bg-blue-700',
    pinterest: 'bg-red-600',
  };
  return colors[platform.toLowerCase()] || 'bg-gray-500';
}

/**
 * Helper function to get status badge variant
 */
export function getStatusBadgeVariant(status: string): string {
  const variants: Record<string, string> = {
    available: 'default',
    busy: 'secondary',
    unavailable: 'outline',
  };
  return variants[status.toLowerCase()] || 'outline';
}
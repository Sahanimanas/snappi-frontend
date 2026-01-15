import { useState, useCallback } from 'react';
import { 
  influencersAPI, 
  Influencer, 
  SearchFilters, 
  FilterOptions, 
  SearchSuggestions,
  RecommendationParams 
} from '@/lib/api';

export const useInfluencerSearch = () => {
  const [influencers, setInfluencers] = useState<Influencer[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null);

  /**
   * Search influencers with advanced filters
   */
  const searchInfluencers = useCallback(async (filters: SearchFilters) => {
    setLoading(true);
    setError(null);

    try {
      const result = await influencersAPI.search(filters);

      if (result.success && result.data) {
        setInfluencers(result.data);
        setTotal(result.total || result.count || result.data.length);
      } else {
        setError(result.message || 'Failed to search influencers');
        setInfluencers([]);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to search influencers');
      setInfluencers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Get search suggestions for autocomplete
   */
  const getSuggestions = useCallback(async (query: string): Promise<SearchSuggestions> => {
    if (!query || query.length < 2) {
      return { names: [], niches: [], categories: [] };
    }

    try {
      const result = await influencersAPI.getSearchSuggestions(query);

      if (result.success && result.data) {
        return result.data;
      }
    } catch (err) {
      console.error('Failed to get suggestions:', err);
    }

    return { names: [], niches: [], categories: [] };
  }, []);

  /**
   * Get filter options (available values with counts)
   */
  const fetchFilterOptions = useCallback(async () => {
    try {
      const result = await influencersAPI.getFilterOptions();

      if (result.success && result.data) {
        setFilterOptions(result.data);
        return result.data;
      }
    } catch (err) {
      console.error('Failed to get filter options:', err);
    }

    return null;
  }, []);

  /**
   * Get AI-powered recommendations
   */
  const getRecommendations = useCallback(async (params: RecommendationParams) => {
    setLoading(true);
    setError(null);

    try {
      const result = await influencersAPI.getRecommendations(params);

      if (result.success && result.data) {
        setInfluencers(result.data);
        setTotal(result.count || result.data.length);
        return result.data;
      } else {
        setError(result.message || 'Failed to get recommendations');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }

    return [];
  }, []);

  /**
   * Clear search results
   */
  const clearResults = useCallback(() => {
    setInfluencers([]);
    setTotal(0);
    setError(null);
  }, []);

  return {
    influencers,
    total,
    loading,
    error,
    filterOptions,
    searchInfluencers,
    getSuggestions,
    getFilterOptions: fetchFilterOptions,
    getRecommendations,
    clearResults
  };
};

export default useInfluencerSearch;
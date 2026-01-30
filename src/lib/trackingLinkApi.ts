// lib/trackingLinkApi.ts
// API functions for tracking links - includes public endpoints for influencer submissions

const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper to get auth token
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Helper for authenticated requests
const authHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

// Helper for public requests (no auth)
const publicHeaders = () => ({
  'Content-Type': 'application/json',
});

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}

interface SubmitPostData {
  platform: string;
  postType?: string;
  postUrl: string;
  caption?: string;
  postedAt?: string;
}

interface TrackingLinkData {
  _id: string;
  trackingCode: string;
  trackingUrl: string;
  destinationUrl: string;
  status: string;
  campaign: {
    _id: string;
    name: string;
    status: string;
  };
  influencer: {
    _id: string;
    name: string;
    email?: string;
    profileImage?: string;
  };
  submittedPosts: Array<{
    _id: string;
    platform: string;
    postType: string;
    postUrl: string;
    caption?: string;
    status: string;
    submittedAt: string;
    metrics?: {
      views: number;
      likes: number;
      comments: number;
      shares: number;
    };
  }>;
  totalPerformance?: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalClicks: number;
  };
  clickStats?: {
    totalClicks: number;
    uniqueClicks: number;
    lastClickedAt?: string;
  };
}

export const trackingLinkAPI = {
  // ============ PUBLIC ENDPOINTS (no auth required) ============
  
  /**
   * Get tracking link details by code (public)
   * Used by influencers to view their submission page
   */
  getByCode: async (code: string): Promise<ApiResponse<TrackingLinkData>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking-links/code/${code}`, {
        method: 'GET',
        headers: publicHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching tracking link by code:', error);
      return { success: false, message: 'Failed to fetch tracking link' };
    }
  },

  /**
   * Submit a post using tracking code (public)
   * Used by influencers to submit their social media posts
   */
  submitPost: async (code: string, data: SubmitPostData): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking-links/submit/${code}`, {
        method: 'POST',
        headers: publicHeaders(),
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error submitting post:', error);
      return { success: false, message: 'Failed to submit post' };
    }
  },

  /**
   * Record a click on tracking link (public)
   * Used for click tracking when users visit the link
   */
  recordClick: async (code: string): Promise<ApiResponse<{ destinationUrl: string }>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking-links/click/${code}`, {
        method: 'POST',
        headers: publicHeaders(),
        body: JSON.stringify({
          referrer: document.referrer,
          userAgent: navigator.userAgent,
        }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error recording click:', error);
      return { success: false, message: 'Failed to record click' };
    }
  },

  // ============ PROTECTED ENDPOINTS (auth required) ============

  /**
   * Generate a new tracking link for an influencer in a campaign
   */
  generate: async (data: {
    campaignId: string;
    influencerId: string;
    destinationUrl?: string;
    notes?: string;
  }): Promise<ApiResponse<TrackingLinkData>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking-links/generate`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error generating tracking link:', error);
      return { success: false, message: 'Failed to generate tracking link' };
    }
  },

  /**
   * Get all tracking links for a campaign
   */
  getByCampaign: async (campaignId: string): Promise<ApiResponse<TrackingLinkData[]>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking-links/campaign/${campaignId}`, {
        method: 'GET',
        headers: authHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching campaign tracking links:', error);
      return { success: false, message: 'Failed to fetch tracking links' };
    }
  },

  /**
   * Get a single tracking link by ID
   */
  getById: async (id: string): Promise<ApiResponse<TrackingLinkData>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking-links/${id}`, {
        method: 'GET',
        headers: authHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching tracking link:', error);
      return { success: false, message: 'Failed to fetch tracking link' };
    }
  },

  /**
   * Update a tracking link
   */
  update: async (id: string, data: {
    destinationUrl?: string;
    notes?: string;
    status?: string;
  }): Promise<ApiResponse<TrackingLinkData>> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking-links/${id}`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating tracking link:', error);
      return { success: false, message: 'Failed to update tracking link' };
    }
  },

  /**
   * Delete a tracking link
   */
  delete: async (id: string): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking-links/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting tracking link:', error);
      return { success: false, message: 'Failed to delete tracking link' };
    }
  },

  /**
   * Get tracking stats for a campaign
   */
  getStats: async (campaignId: string): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking-links/stats/campaign/${campaignId}`, {
        method: 'GET',
        headers: authHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching tracking stats:', error);
      return { success: false, message: 'Failed to fetch stats' };
    }
  },

  /**
   * Get overall tracking stats across all campaigns
   */
  getOverallStats: async (): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking-links/stats/overall`, {
        method: 'GET',
        headers: authHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Error fetching overall stats:', error);
      return { success: false, message: 'Failed to fetch stats' };
    }
  },

  /**
   * Update post status (approve/reject)
   */
  updatePostStatus: async (trackingLinkId: string, postId: string, data: {
    status: 'approved' | 'rejected' | 'pending';
    reviewNotes?: string;
  }): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking-links/${trackingLinkId}/posts/${postId}/status`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify(data),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating post status:', error);
      return { success: false, message: 'Failed to update post status' };
    }
  },

  /**
   * Update post metrics
   */
  updatePostMetrics: async (trackingLinkId: string, postId: string, metrics: {
    views?: number;
    likes?: number;
    comments?: number;
    shares?: number;
    saves?: number;
    clicks?: number;
  }): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking-links/${trackingLinkId}/posts/${postId}/metrics`, {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ metrics }),
      });
      return await response.json();
    } catch (error) {
      console.error('Error updating post metrics:', error);
      return { success: false, message: 'Failed to update metrics' };
    }
  },

  /**
   * Delete a submitted post
   */
  deletePost: async (trackingLinkId: string, postId: string): Promise<ApiResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/tracking-links/${trackingLinkId}/posts/${postId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });
      return await response.json();
    } catch (error) {
      console.error('Error deleting post:', error);
      return { success: false, message: 'Failed to delete post' };
    }
  },
};

export default trackingLinkAPI;
/**
 * Tracking Links API
 * Handles all tracking link related API calls
 */

const API_BASE_URL = import.meta.env.VITE_API_URL;

// ==================== TOKEN HELPERS ====================

const USER_TOKEN_KEY = 'snappi_user_token';

const getToken = (): string | null => localStorage.getItem(USER_TOKEN_KEY);

// ==================== API REQUEST HELPER ====================

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{
  success: boolean;
  data?: T;
  message?: string;
  token?: string;
  error?: string;
  total?: number;
  count?: number;
  totalPages?: number;
  currentPage?: number;
  pagination?: any;
}> {
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Error: ${response.status}`,
        error: data.message || 'Request failed',
      };
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Public API request (no auth token)
async function publicApiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });

    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = { message: await response.text() };
    }

    if (!response.ok) {
      return {
        success: false,
        message: data.message || `Error: ${response.status}`,
        error: data.message || 'Request failed',
      };
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      message: 'Network error. Please check your connection.',
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// ==================== INTERFACES ====================

export interface SubmittedPost {
  _id: string;
  platform: 'instagram' | 'youtube' | 'tiktok' | 'facebook' | 'twitter' | 'linkedin' | 'pinterest' | 'other';
  postType: 'post' | 'story' | 'reel' | 'video' | 'short' | 'live' | 'blog' | 'review' | 'other';
  postUrl: string;
  caption?: string;
  postedAt?: string;
  metrics: {
    views: number;
    likes: number;
    comments: number;
    shares: number;
    saves: number;
    clicks: number;
    reach: number;
    impressions: number;
  };
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNotes?: string;
}

export interface TrackingLink {
  _id: string;
  campaign: {
    _id: string;
    name: string;
    status: string;
    startDate?: string;
    endDate?: string;
  };
  influencer: {
    _id: string;
    name: string;
    email?: string;
    profileImage?: string;
    platforms: Array<{
      platform: string;
      username: string;
      followers: number;
      engagement: number;
    }>;
  };
  campaignInfluencer?: string;
  createdBy: string;
  trackingCode: string;
  trackingUrl: string;
  shortUrl?: string;
  destinationUrl?: string;
  utmParams?: {
    source: string;
    medium: string;
    campaign: string;
    content?: string;
    term?: string;
  };
  submittedPosts: SubmittedPost[];
  totalPerformance: {
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalClicks: number;
    totalReach: number;
    totalImpressions: number;
    totalConversions: number;
    revenue: number;
    engagementRate: number;
  };
  clickStats: {
    totalClicks: number;
    uniqueClicks: number;
    lastClickedAt?: string;
  };
  status: 'active' | 'paused' | 'expired' | 'completed';
  expiresAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingStats {
  overview: {
    totalLinks: number;
    activeLinks: number;
    totalPosts: number;
    totalClicks: number;
    totalViews: number;
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalReach: number;
  };
  postsByStatus: Array<{
    _id: string;
    count: number;
  }>;
  topCampaigns: Array<{
    _id: string;
    campaignName: string;
    linkCount: number;
    postCount: number;
    totalClicks: number;
  }>;
}

export interface TrackingLinkPublicData {
  trackingCode: string;
  campaign: {
    name: string;
    status: string;
  };
  influencer: {
    name: string;
  };
  status: string;
  submittedPosts: Array<{
    _id: string;
    platform: string;
    postType: string;
    postUrl: string;
    status: string;
    submittedAt: string;
  }>;
}

// ==================== TRACKING LINKS API ====================

export const trackingLinkAPI = {
  // ==================== PROTECTED ROUTES ====================

  /**
   * Generate tracking link for influencer in campaign
   */
  generate: async (
    campaignId: string,
    influencerId: string,
    destinationUrl?: string,
    notes?: string
  ) =>
    apiRequest<TrackingLink>('/tracking-links/generate', {
      method: 'POST',
      body: JSON.stringify({ campaignId, influencerId, destinationUrl, notes }),
    }),

  /**
   * Get all tracking links for a campaign
   */
  getByCampaign: async (campaignId: string) =>
    apiRequest<TrackingLink[]>(`/tracking-links/campaign/${campaignId}`, {
      method: 'GET',
    }),

  /**
   * Get single tracking link details
   */
  getById: async (id: string) =>
    apiRequest<TrackingLink>(`/tracking-links/${id}`, {
      method: 'GET',
    }),

  /**
   * Delete tracking link
   */
  delete: async (id: string) =>
    apiRequest(`/tracking-links/${id}`, {
      method: 'DELETE',
    }),

  /**
   * Get submitted posts for a tracking link
   */
  getPosts: async (trackingLinkId: string) =>
    apiRequest<{
      trackingLink: Partial<TrackingLink>;
      campaign: TrackingLink['campaign'];
      influencer: TrackingLink['influencer'];
      submittedPosts: SubmittedPost[];
      summary: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
      };
    }>(`/tracking-links/${trackingLinkId}/posts`, {
      method: 'GET',
    }),

  /**
   * Update post status (approve/reject)
   */
  updatePostStatus: async (
    trackingLinkId: string,
    postId: string,
    status: 'approved' | 'rejected' | 'pending',
    reviewNotes?: string
  ) =>
    apiRequest<SubmittedPost>(`/tracking-links/${trackingLinkId}/posts/${postId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, reviewNotes }),
    }),

  /**
   * Update post metrics
   */
  updatePostMetrics: async (
    trackingLinkId: string,
    postId: string,
    metrics: Partial<SubmittedPost['metrics']>
  ) =>
    apiRequest<{
      post: SubmittedPost;
      totalPerformance: TrackingLink['totalPerformance'];
    }>(`/tracking-links/${trackingLinkId}/posts/${postId}/metrics`, {
      method: 'PUT',
      body: JSON.stringify({ metrics }),
    }),

  /**
   * Delete a submitted post
   */
  deletePost: async (trackingLinkId: string, postId: string) =>
    apiRequest(`/tracking-links/${trackingLinkId}/posts/${postId}`, {
      method: 'DELETE',
    }),

  /**
   * Get tracking statistics overview
   */
  getStats: async () =>
    apiRequest<TrackingStats>('/tracking-links/stats/overview', {
      method: 'GET',
    }),

  // ==================== PUBLIC ROUTES ====================
  // These are used by influencers via the tracking link (no auth required)

  /**
   * Get tracking link details by code (public)
   */
  getByCode: async (trackingCode: string) =>
    publicApiRequest<TrackingLinkPublicData>(`/tracking-links/code/${trackingCode}`, {
      method: 'GET',
    }),

  /**
   * Submit a post via tracking code (public)
   */
  submitPost: async (
    trackingCode: string,
    data: {
      platform: string;
      postType: string;
      postUrl: string;
      caption?: string;
      postedAt?: string;
    }
  ) =>
    publicApiRequest<{
      postId: string;
      totalPosts: number;
    }>(`/tracking-links/code/${trackingCode}/submit`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  /**
   * Record link click (public - for redirect tracking)
   */
  recordClick: async (trackingCode: string, isUnique: boolean = false) =>
    publicApiRequest<{
      destinationUrl: string;
      totalClicks: number;
    }>(`/tracking-links/code/${trackingCode}/click`, {
      method: 'POST',
      body: JSON.stringify({ isUnique }),
    }),
};

export default trackingLinkAPI;
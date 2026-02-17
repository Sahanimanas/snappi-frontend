/**
 * API Service Layer
 * Handles all communication with the Snappi backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL 

// Token management - User
const USER_TOKEN_KEY = 'snappi_user_token';
const USER_DATA_KEY = 'snappi_user';

// Token management - Admin
const ADMIN_TOKEN_KEY = 'adminToken';
const ADMIN_DATA_KEY = 'adminData';

// ==================== TOKEN HELPERS ====================

export const getToken = (): string | null => localStorage.getItem(USER_TOKEN_KEY);
export const setToken = (token: string): void => localStorage.setItem(USER_TOKEN_KEY, token);
export const removeToken = (): void => {
  localStorage.removeItem(USER_TOKEN_KEY);
  localStorage.removeItem(USER_DATA_KEY);
};
export const getStoredUser = (): any => {
  const user = localStorage.getItem(USER_DATA_KEY);
  return user ? JSON.parse(user) : null;
};
export const setStoredUser = (user: any): void => localStorage.setItem(USER_DATA_KEY, JSON.stringify(user));

export const getAdminToken = (): string | null => localStorage.getItem(ADMIN_TOKEN_KEY);
export const setAdminToken = (token: string): void => localStorage.setItem(ADMIN_TOKEN_KEY, token);
export const removeAdminToken = (): void => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  localStorage.removeItem(ADMIN_DATA_KEY);
};
export const getStoredAdmin = (): any => {
  const admin = localStorage.getItem(ADMIN_DATA_KEY);
  return admin ? JSON.parse(admin) : null;
};
export const setStoredAdmin = (admin: any): void => localStorage.setItem(ADMIN_DATA_KEY, JSON.stringify(admin));

// ==================== API REQUEST HELPER ====================

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  useAdminToken: boolean = false
): Promise<{ success: boolean; data?: T; message?: string; token?: string; error?: string; total?: number; count?: number; totalPages?: number; currentPage?: number; pagination?: any; campaign?: any }> {
  const token = useAdminToken ? getAdminToken() : getToken();

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

    if (response.status === 401) {
      if (useAdminToken) {
        removeAdminToken();
      } else {
        removeToken();
      }
      return { success: false, message: data.message || 'Session expired. Please login again.', error: 'unauthorized' };
    }

    if (!response.ok) {
      return { success: false, message: data.message || `Error: ${response.status}`, error: data.message || 'Request failed' };
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    return { success: false, message: 'Network error. Please check your connection.', error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// ==================== INTERFACES ====================

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'brand' | 'agency';
  company?: { name?: string; website?: string; industry?: string; size?: string; logo?: string };
  profileImage?: string;
  phone?: string;
  location?: { country?: string; city?: string };
  subscription?: { plan: string; startDate?: string; endDate?: string; isActive: boolean };
  permissions?: { canSearchInfluencers: boolean; canCreateCampaigns: boolean; canViewAnalytics: boolean; canExportData: boolean; canManageTeam: boolean; maxCampaigns: number; maxSavedInfluencers: number };
  savedInfluencers?: string[];
  isActive: boolean;
  isEmailVerified?: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface Admin {
  _id: string;
  name: string;
  email: string;
  role: 'admin';
  profileImage?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface Platform {
  _id?: string;
  platform: 'instagram' | 'youtube' | 'tiktok' | 'twitter' | 'facebook' | 'linkedin' | 'pinterest' | 'snapchat' | 'twitch';
  username: string;
  profileUrl: string;
  followers: number;
  engagement: number;
  avgViews?: number;
  avgLikes?: number;
  avgComments?: number;
  postsCount?: number;
  verified?: boolean;
  pricing?: { post?: number; story?: number; video?: number; reel?: number; short?: number; live?: number };
  lastUpdated?: string;
}

export interface Influencer {
  _id: string;
  name: string;
  email?: string;
  profileImage?: string;
  platforms: Platform[];
  keywords?: Keyword[];
  location?: { country?: string; city?: string; state?: string };
  languages?: string[];
  demographics?: { primaryAgeRange?: string; gender?: { male: number; female: number; other: number }; topCountries?: Array<{ country: string; percentage: number }> };
  status: 'available' | 'busy' | 'unavailable';
  bio?: string;
  contactInfo?: { phone?: string; whatsapp?: string; email?: string; preferredContact?: string };
  rating?: { average: number; count: number };
  totalCollaborations?: number;
  isVerified?: boolean;
  isFeatured?: boolean;
  totalFollowers?: number;
  avgEngagement?: number;
  platformList?: string[];
  platformCount?: number;
  createdAt: string;
  updatedAt: string;
  // Collaborating influencer fields
  campaigns?: CampaignCollaboration[];
  totalCampaigns?: number;
  activeCampaigns?: number;
  collaborationStatus?: string;
}

export interface CampaignCollaboration {
  _id: string;
  name: string;
  status: string;
  collaborationStatus?: string;
  compensation?: { amount: number; type: string };
  startDate?: string;
  endDate?: string;
  hasTrackingLink?: boolean;
  deliverablesCount?: number;
}

export interface Keyword {
  _id: string;
  name: string;
  displayName: string;
  description?: string;
  icon?: string;
  color?: string;
  influencers?: string[];
  influencerCount?: number;
  isActive: boolean;
  createdAt: string;
}

export interface Campaign {
  _id: string;
  name: string;
  description?: string;
  objective?: 'brand_awareness' | 'increase_sales' | 'engagement' | 'lead_generation' | 'traffic';
  campaignType?: 'sponsored_post' | 'product_review' | 'giveaway' | 'brand_ambassador' | 'affiliate';
  status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
  budget?: { total: number; spent?: number; remaining?: number };
  startDate?: string;
  endDate?: string;
  targetPlatforms: string[];
  productUrls?: string[];
  influencers?: string[];
  influencerCount?: number;
  performance?: { totalReach?: number; totalEngagement?: number; totalClicks?: number; totalConversions?: number; roi?: number };
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== USER AUTH API ====================

export const authAPI = {
  register: async (data: { name: string; email: string; password: string; role?: string; company?: any; phone?: string; location?: any }) => {
    const result = await apiRequest<User>('/users/register', { method: 'POST', body: JSON.stringify(data) });
    if (result.success && result.token) {
      setToken(result.token);
      if (result.data) setStoredUser(result.data);
    }
    return result;
  },

  login: async (data: { email: string; password: string }) => {
    const result = await apiRequest<User>('/users/login', { method: 'POST', body: JSON.stringify(data) });
    if (result.success && result.token) {
      setToken(result.token);
      if (result.data) setStoredUser(result.data);
    }
    return result;
  },

  logout: async () => {
    const result = await apiRequest('/users/logout', { method: 'GET' });
    removeToken();
    return result;
  },

  getMe: async () => apiRequest<User>('/users/me', { method: 'GET' }),

  updateDetails: async (data: Partial<User>) => apiRequest<User>('/users/updatedetails', { method: 'PUT', body: JSON.stringify(data) }),

  updatePassword: async (currentPassword: string, newPassword: string) => apiRequest('/users/updatepassword', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }),

  // Saved Influencers
  getSavedInfluencers: async (page = 1, limit = 10) => apiRequest<Influencer[]>(`/users/saved-influencers?page=${page}&limit=${limit}`, { method: 'GET' }),

  saveInfluencer: async (influencerId: string) => apiRequest(`/users/saved-influencers/${influencerId}`, { method: 'POST' }),

  removeSavedInfluencer: async (influencerId: string) => apiRequest(`/users/saved-influencers/${influencerId}`, { method: 'DELETE' }),
};

// ==================== ADMIN AUTH API ====================

export const adminAPI = {
  login: async (data: { email: string; password: string }) => {
    const result = await apiRequest<Admin>('/admin/login', { method: 'POST', body: JSON.stringify(data) }, true);
    if (result.success && result.token) {
      setAdminToken(result.token);
      if (result.data) setStoredAdmin(result.data);
    }
    return result;
  },

  register: async (data: { name: string; email: string; password: string }) => {
    const result = await apiRequest<Admin>('/admin/register', { method: 'POST', body: JSON.stringify(data) }, true);
    if (result.success && result.token) {
      setAdminToken(result.token);
      if (result.data) setStoredAdmin(result.data);
    }
    return result;
  },

  logout: async () => {
    const result = await apiRequest('/admin/logout', { method: 'GET' }, true);
    removeAdminToken();
    return result;
  },

  getMe: async () => apiRequest<Admin>('/admin/me', { method: 'GET' }, true),

  updateDetails: async (data: Partial<Admin>) => apiRequest<Admin>('/admin/updatedetails', { method: 'PUT', body: JSON.stringify(data) }, true),

  updatePassword: async (currentPassword: string, newPassword: string) => apiRequest('/admin/updatepassword', { method: 'PUT', body: JSON.stringify({ currentPassword, newPassword }) }, true),

  // Admin Management
  getAllAdmins: async (params: { page?: number; limit?: number; search?: string } = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && query.append(k, String(v)));
    return apiRequest<Admin[]>(`/admin/admins?${query}`, { method: 'GET' }, true);
  },

  getAdmin: async (id: string) => apiRequest<Admin>(`/admin/admins/${id}`, { method: 'GET' }, true),

  createAdmin: async (data: { name: string; email: string; password: string }) => apiRequest<Admin>('/admin/admins', { method: 'POST', body: JSON.stringify(data) }, true),

  updateAdmin: async (id: string, data: Partial<Admin>) => apiRequest<Admin>(`/admin/admins/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),

  deleteAdmin: async (id: string) => apiRequest(`/admin/admins/${id}`, { method: 'DELETE' }, true),

  resetAdminPassword: async (id: string, newPassword: string) => apiRequest(`/admin/admins/${id}/resetpassword`, { method: 'PUT', body: JSON.stringify({ newPassword }) }, true),

  // User Management
  getAllUsers: async (params: { page?: number; limit?: number; search?: string; role?: string; plan?: string; isActive?: string; sortBy?: string; sortOrder?: string } = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && query.append(k, String(v)));
    return apiRequest<User[]>(`/admin/users?${query}`, { method: 'GET' }, true);
  },

  getUser: async (id: string) => apiRequest<User>(`/admin/users/${id}`, { method: 'GET' }, true),

  createUser: async (data: Partial<User> & { password: string }) => apiRequest<User>('/admin/users', { method: 'POST', body: JSON.stringify(data) }, true),

  updateUser: async (id: string, data: Partial<User>) => apiRequest<User>(`/admin/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),

  deleteUser: async (id: string) => apiRequest(`/admin/users/${id}`, { method: 'DELETE' }, true),

  updateUserSubscription: async (id: string, data: { plan?: string; startDate?: string; endDate?: string; isActive?: boolean }) => apiRequest<User>(`/admin/users/${id}/subscription`, { method: 'PUT', body: JSON.stringify(data) }, true),

  getUserStats: async () => apiRequest<any>('/admin/users/stats', { method: 'GET' }, true),
};

// ==================== KEYWORDS API ====================

export const keywordsAPI = {
  getAll: async (params: { search?: string; isActive?: string } = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && query.append(k, String(v)));
    return apiRequest<Keyword[]>(`/keywords?${query}`, { method: 'GET' });
  },

  getList: async () => apiRequest<Keyword[]>('/keywords/list', { method: 'GET' }),

  getById: async (id: string) => apiRequest<Keyword>(`/keywords/${id}`, { method: 'GET' }),

  getInfluencersByKeyword: async (id: string, params: { page?: number; limit?: number; platform?: string; minFollowers?: number; maxFollowers?: number; sortBy?: string; sortOrder?: string } = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && query.append(k, String(v)));
    return apiRequest<Influencer[]>(`/keywords/${id}/influencers?${query}`, { method: 'GET' });
  },

  // Admin only
  create: async (data: { name: string; displayName: string; description?: string; icon?: string; color?: string }) => apiRequest<Keyword>('/keywords', { method: 'POST', body: JSON.stringify(data) }, true),

  update: async (id: string, data: Partial<Keyword>) => apiRequest<Keyword>(`/keywords/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),

  delete: async (id: string) => apiRequest(`/keywords/${id}`, { method: 'DELETE' }, true),

  bulkCreate: async (keywords: Array<{ name: string; displayName: string; description?: string; icon?: string; color?: string }>) => apiRequest<any>('/keywords/bulk', { method: 'POST', body: JSON.stringify({ keywords }) }, true),

  assignInfluencer: async (keywordId: string, influencerId: string) => apiRequest(`/keywords/${keywordId}/influencers/${influencerId}`, { method: 'POST' }, true),

  removeInfluencer: async (keywordId: string, influencerId: string) => apiRequest(`/keywords/${keywordId}/influencers/${influencerId}`, { method: 'DELETE' }, true),

  bulkAssignInfluencers: async (keywordId: string, influencerIds: string[]) => apiRequest(`/keywords/${keywordId}/influencers/bulk`, { method: 'POST', body: JSON.stringify({ influencerIds }) }, true),

  getStats: async () => apiRequest<any>('/keywords/admin/stats', { method: 'GET' }, true),
};

// ==================== INFLUENCERS API ====================

export const influencersAPI = {
  getAll: async (filters: { page?: number; limit?: number; search?: string; platform?: string; keywords?: string; minFollowers?: number; maxFollowers?: number; minEngagement?: number; maxEngagement?: number; country?: string; city?: string; status?: string; isVerified?: string; sortBy?: string; sortOrder?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v !== undefined && v !== '' && params.append(k, String(v)));
    return apiRequest<Influencer[]>(`/influencers?${params}`, { method: 'GET' });
  },

  getById: async (id: string) => apiRequest<Influencer>(`/influencers/${id}`, { method: 'GET' }),

  getTopByEngagement: async (params: { platform?: string; limit?: number } = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => v !== undefined && query.append(k, String(v)));
    return apiRequest<Influencer[]>(`/influencers/top/engagement?${query}`, { method: 'GET' });
  },

  // NEW: Get collaborating influencers (assigned to user's campaigns)
  getCollaborating: async (params?: { search?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const queryString = queryParams.toString();
    return apiRequest<Influencer[]>(`/influencers/collaborating${queryString ? `?${queryString}` : ''}`, { method: 'GET' });
  },

  // NEW: Get influencers for a specific campaign
  getByCampaign: async (campaignId: string) =>
    apiRequest<Influencer[]>(`/influencers/campaign/${campaignId}`, { method: 'GET' }),

  // Admin only
  create: async (data: Partial<Influencer> & { keywordIds?: string[] }) => apiRequest<Influencer>('/influencers', { method: 'POST', body: JSON.stringify(data) }, true),

  update: async (id: string, data: Partial<Influencer> & { keywordIds?: string[] }) => apiRequest<Influencer>(`/influencers/${id}`, { method: 'PUT', body: JSON.stringify(data) }, true),

  delete: async (id: string) => apiRequest(`/influencers/${id}`, { method: 'DELETE' }, true),

  addPlatform: async (id: string, platform: Partial<Platform>) => apiRequest<Influencer>(`/influencers/${id}/platforms`, { method: 'POST', body: JSON.stringify(platform) }, true),

  updatePlatform: async (id: string, platformId: string, data: Partial<Platform>) => apiRequest<Influencer>(`/influencers/${id}/platforms/${platformId}`, { method: 'PUT', body: JSON.stringify(data) }, true),

  removePlatform: async (id: string, platformId: string) => apiRequest(`/influencers/${id}/platforms/${platformId}`, { method: 'DELETE' }, true),

  assignKeywords: async (id: string, keywordIds: string[]) => apiRequest<Influencer>(`/influencers/${id}/keywords`, { method: 'POST', body: JSON.stringify({ keywordIds }) }, true),

  removeKeywords: async (id: string, keywordIds: string[]) => apiRequest(`/influencers/${id}/keywords`, { method: 'DELETE', body: JSON.stringify({ keywordIds }) }, true),

  getStats: async () => apiRequest<any>('/influencers/admin/stats', { method: 'GET' }, true),
};

// ==================== CAMPAIGNS API ====================

export const campaignsAPI = {
  getAll: async (filters: { page?: number; limit?: number; status?: string; search?: string; sortBy?: string; sortOrder?: string } = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v !== undefined && v !== '' && params.append(k, String(v)));
    return apiRequest<Campaign[]>(`/campaigns?${params}`, { method: 'GET' });
  },

  getById: async (id: string) => apiRequest<Campaign>(`/campaigns/${id}`, { method: 'GET' }),

  create: async (data: Partial<Campaign>) => apiRequest<Campaign>('/campaigns', { method: 'POST', body: JSON.stringify(data) }),

  update: async (id: string, data: Partial<Campaign>) => apiRequest<Campaign>(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  delete: async (id: string) => apiRequest(`/campaigns/${id}`, { method: 'DELETE' }),

  addInfluencer: async (campaignId: string, influencerId: string, compensation?: { amount: number; type: string }, trackingLink?: string) => apiRequest(`/campaigns/${campaignId}/influencers`, { method: 'POST', body: JSON.stringify({ influencerId, compensation, trackingLink }) }),

  getPerformance: async (campaignId: string) => apiRequest<any>(`/campaigns/${campaignId}/performance`, { method: 'GET' }),

  getStats: async () => apiRequest<any>('/campaigns/stats/overview', { method: 'GET' }),
};

// ==================== DASHBOARD API ====================

export const dashboardAPI = {
  getOverview: async () => apiRequest<any>('/dashboard', { method: 'GET' }),
  getStats: async () => apiRequest<any>('/dashboard/stats', { method: 'GET' }),
  getRecentCampaigns: async (limit = 5) => apiRequest<any>(`/dashboard/campaigns/recent?limit=${limit}`, { method: 'GET' }),
  getTopInfluencers: async (limit = 5, sortBy = 'engagement') => apiRequest<any>(`/dashboard/influencers/top?limit=${limit}&sortBy=${sortBy}`, { method: 'GET' }),
  getAnalytics: async (period = '30days') => apiRequest<any>(`/dashboard/analytics?period=${period}`, { method: 'GET' }),
};




// ==================== HELPERS ====================

export const isAuthenticated = (): boolean => !!getToken();
export const isAdminAuthenticated = (): boolean => !!getAdminToken();
export const isAuthError = (result: { error?: string }): boolean => result.error === 'unauthorized';

export const formatNumber = (num: number): string => {
  if (num >= 1000000000) return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  return num.toString();
};

export default {
  auth: authAPI,
  admin: adminAPI,
  keywords: keywordsAPI,
  influencers: influencersAPI,
  campaigns: campaignsAPI,
  dashboard: dashboardAPI,
};
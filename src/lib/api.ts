/**
 * API Service Layer
 * Handles all communication with the Snappi backend API
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// Token management
const TOKEN_KEY = 'snappi_auth_token';
const USER_KEY = 'snappi_user';

export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
};

export const setToken = (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const removeToken = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

export const getStoredUser = (): any => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user: any): void => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// API request helper with proper error handling
async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; token?: string; error?: string; total?: number; count?: number; pagination?: any }> {
    const token = getToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
    };

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        let data;
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = { message: await response.text() };
        }

        // Only logout on 401 Unauthorized
        if (response.status === 401) {
            removeToken();
            return {
                success: false,
                message: data.message || 'Session expired. Please login again.',
                error: 'unauthorized',
            };
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

// ==================== AUTH API ====================

export interface RegisterData {
    name: string;
    email: string;
    password: string;
    company?: string;
    phoneNumber?: string;
    role?: 'brand' | 'influencer' | 'admin';
}

export interface LoginData {
    email: string;
    password: string;
}

export interface User {
    _id: string;
    name: string;
    email: string;
    company?: string;
    phoneNumber?: string;
    role: string;
    isActive: boolean;
    createdAt: string;
}

export const authAPI = {
    register: async (data: RegisterData) => {
        const result = await apiRequest<{ user: User }>('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (result.success && result.token) {
            setToken(result.token);
            if (result.data) {
                setStoredUser(result.data);
            }
        }

        return result;
    },

    login: async (data: LoginData) => {
        const result = await apiRequest<User>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(data),
        });

        if (result.success && result.token) {
            setToken(result.token);
            if (result.data) {
                setStoredUser(result.data);
            }
        }

        return result;
    },

    logout: async () => {
        const result = await apiRequest('/auth/logout', { method: 'GET' });
        removeToken();
        return result;
    },

    getMe: async () => {
        return apiRequest<User>('/auth/me', { method: 'GET' });
    },

    updateDetails: async (data: Partial<User>) => {
        return apiRequest<User>('/auth/updatedetails', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    updatePassword: async (currentPassword: string, newPassword: string) => {
        return apiRequest('/auth/updatepassword', {
            method: 'PUT',
            body: JSON.stringify({ currentPassword, newPassword }),
        });
    },
};

// ==================== INFLUENCERS API ====================

export interface Influencer {
    _id: string;
    name: string;
    username: string;
    email?: string;
    platform: 'instagram' | 'youtube' | 'tiktok' | 'facebook' | 'twitter' | 'linkedin' | 'pinterest';
    profileUrl: string;
    profileImage?: string;
    followers: number;
    engagement: number;
    avgViews?: number;
    matchScore?: number;
    niche: string[];
    categories: string[];
    country?: string;
    city?: string;
    languages?: string[];
    demographics?: {
        ageRange?: '13-17' | '18-24' | '25-34' | '35-44' | '45-54' | '55+';
        gender?: {
            male?: number;
            female?: number;
            other?: number;
        };
        topCountries?: Array<{
            country: string;
            percentage: number;
        }>;
    };
    status: 'available' | 'busy' | 'unavailable';
    bio?: string;
    contactInfo?: {
        phone?: string;
        email?: string;
        preferredContact?: 'email' | 'phone' | 'platform';
    };
    pricing?: {
        post?: number;
        story?: number;
        video?: number;
        reel?: number;
    };
    verified?: boolean;
    rating?: number;
    totalCollaborations?: number;
    addedBy?: string;
    createdAt: string;
    updatedAt: string;
}

export interface InfluencerFilters {
    page?: number;
    limit?: number;
    search?: string;
    platform?: string;
    minFollowers?: number;
    maxFollowers?: number;
    niche?: string;
    country?: string;
}

export interface InfluencerStats {
    totalInfluencers: number;
    byPlatform: Record<string, number>;
    byStatus: Record<string, number>;
    avgEngagement: number;
    avgFollowers: number;
}

export interface SearchFilters {
    search?: string;
    platforms?: string[];
    niche?: string;
    location?: string;
    keywords?: string;
    minFollowers?: number;
    maxFollowers?: number;
    minEngagement?: number;
    maxEngagement?: number;
    campaignObjective?: 'awareness' | 'sales' | 'both';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    limit?: number;
    skip?: number;
}

export interface FilterOptions {
    platforms: { value: string; count: number }[];
    niches: { value: string; count: number }[];
    categories: { value: string; count: number }[];
    countries: { value: string; count: number }[];
    followerRange: { minFollowers: number; maxFollowers: number; avgFollowers: number };
    engagementRange: { minEngagement: number; maxEngagement: number; avgEngagement: number };
}

export interface SearchSuggestions {
    names: string[];
    niches: string[];
    categories: string[];
}

export interface RecommendationParams {
    campaignObjective?: string;
    targetAudience?: string;
    budget?: number;
    platforms?: string[];
    niche?: string;
    limit?: number;
}

export const influencersAPI = {
    getAll: async (filters: InfluencerFilters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.append(key, String(value));
            }
        });
        return apiRequest<{ influencers: Influencer[]; pagination: any }>(
            `/influencers?${params.toString()}`,
            { method: 'GET' }
        );
    },

    getAllNoPagination: async () => {
        return apiRequest<Influencer[]>('/influencers/all', { method: 'GET' });
    },

    getById: async (id: string) => {
        return apiRequest<Influencer>(`/influencers/${id}`, { method: 'GET' });
    },

    create: async (data: Partial<Influencer>) => {
        return apiRequest<Influencer>('/influencers', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update: async (id: string, data: Partial<Influencer>) => {
        return apiRequest<Influencer>(`/influencers/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete: async (id: string) => {
        return apiRequest(`/influencers/${id}`, { method: 'DELETE' });
    },

    getStats: async () => {
        return apiRequest<InfluencerStats>('/influencers/stats/overview', { method: 'GET' });
    },

    search: async (filters: SearchFilters) => {
        const cleanedFilters = {
            ...filters,
            niche: filters.niche === 'all' ? undefined : filters.niche,
            location: filters.location === 'all' ? undefined : filters.location,
        };

        return apiRequest<Influencer[]>('/influencers/search', {
            method: 'POST',
            body: JSON.stringify(cleanedFilters),
        });
    },

    getSearchSuggestions: async (query: string) => {
        if (!query || query.length < 2) {
            return {
                success: true,
                data: { names: [], niches: [], categories: [] } as SearchSuggestions
            };
        }
        return apiRequest<SearchSuggestions>(
            `/influencers/search/suggestions?q=${encodeURIComponent(query)}`,
            { method: 'GET' }
        );
    },

    getFilterOptions: async () => {
        return apiRequest<FilterOptions>('/influencers/search/filters', { method: 'GET' });
    },

    getRecommendations: async (params: RecommendationParams) => {
        return apiRequest<Influencer[]>('/influencers/search/recommendations', {
            method: 'POST',
            body: JSON.stringify(params),
        });
    },
};

// ==================== CAMPAIGNS API ====================

export interface Campaign {
    _id: string;
    name: string;
    description?: string;
    objective?: 'brand_awareness' | 'increase_sales' | 'engagement' | 'lead_generation' | 'traffic';
    campaignType?: 'sponsored_post' | 'product_review' | 'giveaway' | 'brand_ambassador' | 'affiliate';
    status: 'draft' | 'active' | 'paused' | 'completed' | 'cancelled';
    budget?: {
        total: number;
        spent?: number;
        remaining?: number;
    };
    startDate?: string;
    endDate?: string;
    targetPlatforms: Array<'instagram' | 'youtube' | 'tiktok' | 'facebook' | 'twitter' | 'linkedin' | 'pinterest'>;
    demographics?: {
        ageRange?: Array<'13-17' | '18-24' | '25-34' | '35-44' | '45-54' | '55+'>;
        gender?: Array<'male' | 'female' | 'all'>;
        location?: {
            countries?: string[];
            cities?: string[];
        };
    };
    compensationType?: 'monetary' | 'product' | 'both' | 'affiliate';
    kpis?: {
        impressions?: boolean;
        engagement?: boolean;
        clicks?: boolean;
        conversions?: boolean;
        sales?: boolean;
        reach?: boolean;
    };
    deliverables?: Array<{
        type: 'post' | 'story' | 'reel' | 'video' | 'blog' | 'review';
        quantity: number;
        description?: string;
    }>;
    contract?: {
        templateUsed?: boolean;
        fileUrl?: string;
        uploadedAt?: string;
    };
    performance?: {
        totalReach?: number;
        totalEngagement?: number;
        totalClicks?: number;
        totalConversions?: number;
        roi?: number;
    };
    influencers?: string[];
    influencerCount?: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface CampaignInfluencer {
    _id: string;
    campaign: string | Campaign;
    influencer: string | Influencer;
    status: 'invited' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
    compensation?: {
        amount?: number;
        type?: 'monetary' | 'product' | 'both' | 'affiliate';
        paid?: boolean;
    };
    trackingLink?: string;
    deliverables?: Array<{
        type: 'post' | 'story' | 'reel' | 'video' | 'blog' | 'review';
        url?: string;
        submittedAt?: string;
        approved?: boolean;
        approvedAt?: string;
    }>;
    performance?: {
        reach?: number;
        impressions?: number;
        engagement?: number;
        engagementRate?: number;
        clicks?: number;
        conversions?: number;
        sales?: number;
        lastUpdated?: string;
    };
    notes?: string;
    invitedAt?: string;
    acceptedAt?: string;
    completedAt?: string;
    createdAt: string;
    updatedAt: string;
}

export interface CampaignFilters {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface CampaignStats {
    totalCampaigns: number;
    activeCampaigns: number;
    totalBudget: number;
    totalSpent: number;
    totalReach: number;
    avgROI: number;
}

export const campaignsAPI = {
    getAll: async (filters: CampaignFilters = {}) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== '') {
                params.append(key, String(value));
            }
        });
        return apiRequest<{ campaigns: Campaign[]; pagination: any }>(
            `/campaigns?${params.toString()}`,
            { method: 'GET' }
        );
    },

    getById: async (id: string) => {
        return apiRequest<Campaign>(`/campaigns/${id}`, { method: 'GET' });
    },

    create: async (data: Partial<Campaign>) => {
        return apiRequest<Campaign>('/campaigns', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    },

    update: async (id: string, data: Partial<Campaign>) => {
        return apiRequest<Campaign>(`/campaigns/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    },

    delete: async (id: string) => {
        return apiRequest(`/campaigns/${id}`, { method: 'DELETE' });
    },

    addInfluencer: async (
        campaignId: string,
        influencerId: string,
        compensation?: { amount: number; type: 'monetary' | 'product' | 'both' | 'affiliate' },
        trackingLink?: string
    ) => {
        return apiRequest<CampaignInfluencer>(`/campaigns/${campaignId}/influencers`, {
            method: 'POST',
            body: JSON.stringify({ influencerId, compensation, trackingLink }),
        });
    },

    getPerformance: async (campaignId: string) => {
        return apiRequest<{
            campaignOverview: {
                name: string;
                status: string;
                budget: Campaign['budget'];
                performance: Campaign['performance'];
            };
            influencerPerformances: CampaignInfluencer[];
        }>(`/campaigns/${campaignId}/performance`, { method: 'GET' });
    },

    getStats: async () => {
        return apiRequest<{
            overview: CampaignStats;
            byStatus: Array<{
                _id: string;
                count: number;
                totalBudget: number;
            }>;
        }>('/campaigns/stats/overview', { method: 'GET' });
    },
};

// ==================== DASHBOARD API ====================

// Top performing influencer interface
export interface TopInfluencer {
    _id: string;
    name: string;
    username: string;
    profileImage?: string;
    followers: number;
    followersFormatted?: string;
    engagement: number;
    engagementFormatted?: string;
    platform: string;
    niche: string[];
    verified: boolean;
    matchScore: number;
}

// Dashboard stats interface
export interface DashboardStats {
    activeCampaigns: {
        value: number;
        change: number;
        changeLabel: string;
    };
    totalReach: {
        value: number;
        formatted: string;
        changePercent: number;
        changeLabel: string;
    };
    campaignROI: {
        value: number;
        formatted: string;
        changePercent: number;
        changeLabel: string;
    };
    totalSpend: {
        value: number;
        formatted: string;
        changePercent: number;
        changeLabel: string;
    };
}

// Recent campaign interface for dashboard
export interface RecentCampaign {
    _id: string;
    name: string;
    status: string;
    budget: number;
    spent: number;
    influencerCount: number;
    startDate?: string;
    endDate?: string;
    createdAt: string;
}

// Full dashboard data interface
export interface DashboardData {
    stats: DashboardStats;
    recentCampaigns: RecentCampaign[];
    topPerformingInfluencers: TopInfluencer[];
    summary: {
        totalCampaigns: number;
        totalBudget: number;
        totalInfluencersWorkedWith: number;
    };
}

export const dashboardAPI = {
    /**
     * Get complete dashboard overview
     */
    getOverview: async () => {
        return apiRequest<DashboardData>('/dashboard', { method: 'GET' });
    },

    /**
     * Get dashboard stats only (lightweight)
     */
    getStats: async () => {
        return apiRequest<{
            activeCampaigns: number;
            totalReach: string;
            totalReachRaw: number;
            campaignROI: string;
            campaignROIRaw: number;
            totalSpend: string;
            totalSpendRaw: number;
        }>('/dashboard/stats', { method: 'GET' });
    },

    /**
     * Get recent campaigns for dashboard
     */
    getRecentCampaigns: async (limit: number = 5) => {
        return apiRequest<RecentCampaign[]>(`/dashboard/campaigns/recent?limit=${limit}`, { method: 'GET' });
    },

    /**
     * Get top performing influencers (sorted by engagement rate)
     */
    getTopInfluencers: async (limit: number = 5, sortBy: 'engagement' | 'followers' | 'matchScore' = 'engagement') => {
        return apiRequest<TopInfluencer[]>(`/dashboard/influencers/top?limit=${limit}&sortBy=${sortBy}`, { method: 'GET' });
    },

    /**
     * Get dashboard analytics for charts
     */
    getAnalytics: async (period: '7days' | '30days' | '90days' | '12months' = '30days') => {
        return apiRequest<{
            period: string;
            campaignsInPeriod: number;
            statusBreakdown: Array<{ status: string; count: number }>;
            platformBreakdown: Array<{ platform: string; count: number }>;
            monthlyTrend: Array<{ month: string; spent: number; budget: number; campaigns: number }>;
        }>(`/dashboard/analytics?period=${period}`, { method: 'GET' });
    },

    /**
     * Get influencer dashboard (for influencer users)
     */
    getInfluencerDashboard: async () => {
        return apiRequest<any>('/dashboard/influencer', { method: 'GET' });
    },
};

// ============================================
// Helper functions
// ============================================
export const isAuthenticated = (): boolean => {
    return !!getToken();
};

export const isAuthError = (result: { error?: string }): boolean => {
    return result.error === 'unauthorized';
};

export const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
};

export default {
    auth: authAPI,
    influencers: influencersAPI,
    campaigns: campaignsAPI,
    dashboard: dashboardAPI,
};
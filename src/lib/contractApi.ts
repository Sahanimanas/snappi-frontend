/**
 * Contract API Service
 */

const API_BASE_URL = import.meta.env.VITE_API_URL;

const getToken = (): string | null => localStorage.getItem('snappi_user_token');

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ success: boolean; data?: T; message?: string; count?: number }> {
  const token = getToken();

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || 'Request failed' };
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    return { success: false, message: 'Network error' };
  }
}

export interface SentContract {
  _id?: string;
  influencer: {
    _id: string;
    name: string;
    email?: string;
    profileImage?: string;
  } | string;
  influencerEmail: string;
  influencerName?: string;
  campaign?: {
    _id: string;
    name: string;
    status: string;
  } | string;
  campaignName?: string;
  responseToken?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'connected';
  sentAt: string;
  respondedAt?: string;
}

export interface Contract {
  _id: string;
  title: string;
  content: string;
  createdBy: string;
  sentContracts: SentContract[];
  createdAt: string;
  updatedAt: string;
}

export interface ContractResponse {
  title: string;
  content: string;
  brandName: string;
  brandEmail: string;
  campaignName?: string;
  influencerName?: string;
  status: string;
  sentAt: string;
  respondedAt?: string;
}

export interface ContractStatus {
  status: 'pending' | 'accepted' | 'rejected' | 'connected';
  sentAt: string;
  respondedAt?: string;
  contractId: string;
  contractTitle: string;
}

export const contractsAPI = {
  // Get all contracts
  getAll: async () => apiRequest<Contract[]>('/contracts', { method: 'GET' }),

  // Get single contract
  getById: async (id: string) => apiRequest<Contract>(`/contracts/${id}`, { method: 'GET' }),

  // Create contract
  create: async (data: { title: string; content: string }) =>
    apiRequest<Contract>('/contracts', { method: 'POST', body: JSON.stringify(data) }),

  // Update contract
  update: async (id: string, data: { title?: string; content?: string }) =>
    apiRequest<Contract>(`/contracts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Delete contract
  delete: async (id: string) =>
    apiRequest(`/contracts/${id}`, { method: 'DELETE' }),

  // Send contract to influencer
  send: async (contractId: string, data: { influencerId: string; campaignId?: string }) =>
    apiRequest<Contract>(`/contracts/${contractId}/send`, {
      method: 'POST',
      body: JSON.stringify(data)
    }),

  // Get contract by response token (public)
  getByToken: async (token: string) =>
    apiRequest<ContractResponse>(`/contracts/respond/${token}`, { method: 'GET' }),

  // Respond to contract (public)
  respond: async (token: string, action: 'accept' | 'reject' | 'connect') =>
    apiRequest<{ status: string; brandEmail?: string }>(`/contracts/respond/${token}`, {
      method: 'POST',
      body: JSON.stringify({ action })
    }),

  // Get contract status for influencer in campaign
  getStatus: async (influencerId: string, campaignId: string) =>
    apiRequest<ContractStatus | null>(`/contracts/status/${influencerId}/${campaignId}`, {
      method: 'GET'
    }),

  // Get all contracts for a campaign
  getByCampaign: async (campaignId: string) =>
    apiRequest<Array<{
      contractId: string;
      contractTitle: string;
      influencer: any;
      influencerId: string;
      status: string;
      sentAt: string;
      respondedAt?: string;
    }>>(`/contracts/campaign/${campaignId}`, { method: 'GET' })
};

export default contractsAPI;

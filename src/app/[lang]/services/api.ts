const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

export interface User {
    id: string;
    fullName: string;
    email: string;
    telegramId: string;
    role: 'admin' | 'user' | 'moderator';
    createdAt: string;
    updatedAt: string;
    status: 'active' | 'inactive';
    balance: number;
    adsWatched: number;
}

export interface CreateUserData {
    fullName: string;
    email: string;
    telegramId: string;
    role: 'admin' | 'user' | 'moderator';
}

export interface UpdateUserData extends Partial<CreateUserData> {
    status?: 'active' | 'inactive';
    balance?: number;
}

export interface UserFilters {
    status?: string;
    dateRange?: string;
    search?: string;
    page?: number;
    pageSize?: number;
}

export interface Invitation {
    id: string;
    email: string;
    status: 'pending' | 'accepted' | 'expired';
    createdBy: string;
    createdAt: string;
    expiresAt: string;
}

export interface CreateInvitationData {
    email: string;
    expiresAt: string;
}

export interface InvitationFilters {
    status?: string;
    dateRange?: string;
    search?: string;
    page?: number;
    pageSize?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
}

export interface ApiErrorResponse {
    error: string;
    status: number;
}

export interface ApiSuccessResponse<T> {
    message?: string;
    data: T;
}

export type GetUsersResponse = ApiSuccessResponse<PaginatedResponse<User>>;
export type GetUserResponse = ApiSuccessResponse<User>;
export type GetUserStatsResponse = ApiSuccessResponse<{
    totalUsers: number;
    activeUsers: number;
    inactiveUsers: number;
    newUsersToday: number;
}>;

export type GetInvitationsResponse = ApiSuccessResponse<PaginatedResponse<Invitation>>;
export type GetInvitationStatsResponse = ApiSuccessResponse<{
    totalInvitations: number;
    pendingInvitations: number;
    acceptedInvitations: number;
    expiredInvitations: number;
}>;

class ApiService {
    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw {
                message: data.error || 'An unexpected error occurred',
                status: response.status,
                error: true
            };
        }

        return data;
    }

    // User Management
    async createUser(data: CreateUserData): Promise<GetUserResponse> {
        return this.request<GetUserResponse>('/users', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async getUsers(filters: UserFilters = {}): Promise<GetUsersResponse> {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) params.append(key, value.toString());
        });

        return this.request<GetUsersResponse>(`/users?${params.toString()}`);
    }

    async updateUser(id: string, data: UpdateUserData): Promise<GetUserResponse> {
        return this.request<GetUserResponse>(`/users/${id}`, {
            method: 'PATCH',
            body: JSON.stringify({ id, ...data }),
        });
    }

    async deleteUser(id: string): Promise<ApiSuccessResponse<void>> {
        return this.request<ApiSuccessResponse<void>>(`/users/${id}`, {
            method: 'DELETE',
        });
    }

    // Statistics
    async getUserStats(): Promise<GetUserStatsResponse> {
        return this.request<GetUserStatsResponse>('/users/stats');
    }

    // Invitation Management
    async getInvitations(filters: InvitationFilters = {}): Promise<GetInvitationsResponse> {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined) params.append(key, value.toString());
        });

        return this.request<GetInvitationsResponse>(`/invitations?${params.toString()}`);
    }

    async createInvitation(data: CreateInvitationData): Promise<ApiSuccessResponse<Invitation>> {
        return this.request<ApiSuccessResponse<Invitation>>('/invitations', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async resendInvitation(id: string): Promise<ApiSuccessResponse<void>> {
        return this.request<ApiSuccessResponse<void>>(`/invitations/${id}/resend`, {
            method: 'POST',
        });
    }

    async deleteInvitation(id: string): Promise<ApiSuccessResponse<void>> {
        return this.request<ApiSuccessResponse<void>>(`/invitations/${id}`, {
            method: 'DELETE',
        });
    }

    async getInvitationStats(): Promise<GetInvitationStatsResponse> {
        return this.request<GetInvitationStatsResponse>('/invitations/stats');
    }
}

export const api = new ApiService();

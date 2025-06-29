export interface AdminStats {
  totalUsers: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
  newUsersLast24h: number;
}

export interface RecentActivity {
  id: string;
  type: string;
  description: string;
  timestamp: string;
  userId?: string;
}

export interface AdminState {
  stats: AdminStats;
  recentActivities: RecentActivity[];
  loading: boolean;
  error: string | null;
}

export enum AdminActionTypes {
  FETCH_ADMIN_STATS_REQUEST = 'FETCH_ADMIN_STATS_REQUEST',
  FETCH_ADMIN_STATS_SUCCESS = 'FETCH_ADMIN_STATS_SUCCESS',
  FETCH_ADMIN_STATS_FAILURE = 'FETCH_ADMIN_STATS_FAILURE',
  FETCH_RECENT_ACTIVITIES_REQUEST = 'FETCH_RECENT_ACTIVITIES_REQUEST',
  FETCH_RECENT_ACTIVITIES_SUCCESS = 'FETCH_RECENT_ACTIVITIES_SUCCESS',
  FETCH_RECENT_ACTIVITIES_FAILURE = 'FETCH_RECENT_ACTIVITIES_FAILURE'
}

export type AdminAction =
  | { type: AdminActionTypes.FETCH_ADMIN_STATS_REQUEST }
  | { type: AdminActionTypes.FETCH_ADMIN_STATS_SUCCESS; payload: AdminStats }
  | { type: AdminActionTypes.FETCH_ADMIN_STATS_FAILURE; payload: string }
  | { type: AdminActionTypes.FETCH_RECENT_ACTIVITIES_REQUEST }
  | { type: AdminActionTypes.FETCH_RECENT_ACTIVITIES_SUCCESS; payload: RecentActivity[] }
  | { type: AdminActionTypes.FETCH_RECENT_ACTIVITIES_FAILURE; payload: string };

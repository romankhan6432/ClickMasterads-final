export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersToday: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  balance: number;
  lastLoginAt?: string;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  pageSize: number;
  filters: {
    status?: 'active' | 'inactive';
    search?: string;
    dateRange?: {
      start: string;
      end: string;
    };
  };
  stats: UserStats;
  
}

export enum UserActionTypes {
  FETCH_USERS_REQUEST = 'FETCH_USERS_REQUEST',
  FETCH_USERS_SUCCESS = 'FETCH_USERS_SUCCESS',
  FETCH_USERS_FAILURE = 'FETCH_USERS_FAILURE',
  FETCH_USER_STATS_REQUEST = 'FETCH_USER_STATS_REQUEST',
  FETCH_USER_STATS_SUCCESS = 'FETCH_USER_STATS_SUCCESS',
  FETCH_USER_STATS_FAILURE = 'FETCH_USER_STATS_FAILURE',
  UPDATE_USER_STATUS_REQUEST = 'UPDATE_USER_STATUS_REQUEST',
  UPDATE_USER_STATUS_SUCCESS = 'UPDATE_USER_STATUS_SUCCESS',
  UPDATE_USER_STATUS_FAILURE = 'UPDATE_USER_STATUS_FAILURE',
  SET_USER_FILTERS = 'SET_USER_FILTERS',
  WATCH_AD_REQUEST = 'WATCH_AD_REQUEST',
  WATCH_AD_SUCCESS = 'WATCH_AD_SUCCESS',
  WATCH_AD_FAILURE = 'WATCH_AD_FAILURE'
}

export type UserAction =
  | { type: UserActionTypes.FETCH_USERS_REQUEST }
  | { type: UserActionTypes.FETCH_USERS_SUCCESS; payload: { users: User[]; total: number } }
  | { type: UserActionTypes.FETCH_USERS_FAILURE; payload: string }
  | { type: UserActionTypes.FETCH_USER_STATS_REQUEST }
  | { type: UserActionTypes.FETCH_USER_STATS_SUCCESS; payload: UserStats }
  | { type: UserActionTypes.FETCH_USER_STATS_FAILURE; payload: string }
  | { type: UserActionTypes.UPDATE_USER_STATUS_REQUEST; payload: { id: string; isActive: boolean } }
  | { type: UserActionTypes.UPDATE_USER_STATUS_SUCCESS; payload: User }
  | { type: UserActionTypes.UPDATE_USER_STATUS_FAILURE; payload: string }
  | { type: UserActionTypes.SET_USER_FILTERS; payload: UserState['filters'] }
  | { type: UserActionTypes.WATCH_AD_REQUEST }
  | { type: UserActionTypes.WATCH_AD_SUCCESS; payload: any }
  | { type: UserActionTypes.WATCH_AD_FAILURE; payload: string };

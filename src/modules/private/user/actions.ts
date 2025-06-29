import { UserActionTypes, User, UserStats, UserState } from './types';

export const fetchUsers = () => ({
  type: UserActionTypes.FETCH_USERS_REQUEST
});

export const fetchUsersSuccess = (users: User[], total: number) => ({
  type: UserActionTypes.FETCH_USERS_SUCCESS,
  payload: { users, total }
});

export const fetchUsersFailure = (error: string) => ({
  type: UserActionTypes.FETCH_USERS_FAILURE,
  payload: error
});

export const fetchUserStats = () => ({
  type: UserActionTypes.FETCH_USER_STATS_REQUEST
});

export const fetchUserStatsSuccess = (stats: UserStats) => ({
  type: UserActionTypes.FETCH_USER_STATS_SUCCESS,
  payload: stats
});

export const fetchUserStatsFailure = (error: string) => ({
  type: UserActionTypes.FETCH_USER_STATS_FAILURE,
  payload: error
});

export const updateUserStatus = (id: string, isActive: boolean) => ({
  type: UserActionTypes.UPDATE_USER_STATUS_REQUEST,
  payload: { id, isActive }
});

export const updateUserStatusSuccess = (user: User) => ({
  type: UserActionTypes.UPDATE_USER_STATUS_SUCCESS,
  payload: user
});

export const updateUserStatusFailure = (error: string) => ({
  type: UserActionTypes.UPDATE_USER_STATUS_FAILURE,
  payload: error
});

export const setUserFilters = (filters: UserState['filters']) => ({
  type: UserActionTypes.SET_USER_FILTERS,
  payload: filters
});

export const watchAdRequest = () => ({
  type: UserActionTypes.WATCH_AD_REQUEST
});

export const watchAdSuccess = (data: any) => ({
  type: UserActionTypes.WATCH_AD_SUCCESS,
  payload: data
});

export const watchAdFailure = (error: string) => ({
  type: UserActionTypes.WATCH_AD_FAILURE,
  payload: error
});


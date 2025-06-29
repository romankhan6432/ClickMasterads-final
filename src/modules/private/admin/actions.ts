import { AdminActionTypes, AdminStats, RecentActivity } from './types';

export const fetchAdminStats = () => ({
  type: AdminActionTypes.FETCH_ADMIN_STATS_REQUEST
});

export const fetchAdminStatsSuccess = (stats: AdminStats) => ({
  type: AdminActionTypes.FETCH_ADMIN_STATS_SUCCESS,
  payload: stats
});

export const fetchAdminStatsFailure = (error: string) => ({
  type: AdminActionTypes.FETCH_ADMIN_STATS_FAILURE,
  payload: error
});

export const fetchRecentActivities = () => ({
  type: AdminActionTypes.FETCH_RECENT_ACTIVITIES_REQUEST
});

export const fetchRecentActivitiesSuccess = (activities: RecentActivity[]) => ({
  type: AdminActionTypes.FETCH_RECENT_ACTIVITIES_SUCCESS,
  payload: activities
});

export const fetchRecentActivitiesFailure = (error: string) => ({
  type: AdminActionTypes.FETCH_RECENT_ACTIVITIES_FAILURE,
  payload: error
});

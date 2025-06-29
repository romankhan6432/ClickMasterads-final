
import { RootState } from '@/modules/store';
import { AdminStats, RecentActivity } from './types';

// Base selector
const selectAdmin = (state: RootState) => state.private.admin;

// Stats selectors
export const selectAdminStats = (state: RootState): AdminStats => selectAdmin(state).stats;
export const selectTotalUsers = (state: RootState): number => selectAdminStats(state).totalUsers;
export const selectTotalWithdrawals = (state: RootState): number => selectAdminStats(state).totalWithdrawals;
export const selectPendingWithdrawals = (state: RootState): number => selectAdminStats(state).pendingWithdrawals;
export const selectNewUsersLast24h = (state: RootState): number => selectAdminStats(state).newUsersLast24h;

// Recent activities selectors
export const selectRecentActivities = (state: RootState): RecentActivity[] => selectAdmin(state).recentActivities;

// Loading and error selectors
export const selectAdminLoading = (state: RootState): boolean => selectAdmin(state).loading;
export const selectAdminError = (state: RootState): string | null => selectAdmin(state).error;

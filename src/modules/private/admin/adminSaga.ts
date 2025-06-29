import { call, put, takeLatest, Effect } from 'redux-saga/effects';
import { AdminActionTypes, AdminStats, RecentActivity } from './types';
import {
  fetchAdminStatsSuccess,
  fetchAdminStatsFailure,
  fetchRecentActivitiesSuccess,
  fetchRecentActivitiesFailure
} from './actions';
import { API_CALL, TypeApiPromise } from '@/lib/client';

// API response types
interface StatsResponse {
  totalUsers: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
  newUsersLast24h: number;
}

// Replace these with actual API calls
const fetchStatsFromAPI = async (): Promise<StatsResponse> => {
  const { response } : any = await API_CALL({ url : '/admin/dashboard/stats'})
  return response.stats;

};

const fetchActivitiesFromAPI = async (): Promise<RecentActivity[]> => {
  const response = await fetch('/api/admin/dashboard/activities');
  if (!response.ok) throw new Error('Failed to fetch recent activities');
  const data = await response.json();
  return data.response.activities   
};

function* fetchAdminStatsSaga(): Generator<Effect, void, unknown> {
  try {
    const response = (yield call(fetchStatsFromAPI)) as StatsResponse;
    
    const stats: AdminStats = {
      totalUsers: response.totalUsers,
      totalWithdrawals: response.totalWithdrawals,
      pendingWithdrawals: response.pendingWithdrawals,
      newUsersLast24h: response.newUsersLast24h
    };
    yield put(fetchAdminStatsSuccess(stats));
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(fetchAdminStatsFailure(error.message));
      console.error(error.message);
    } else {
      yield put(fetchAdminStatsFailure('An unknown error occurred'));
    }
  }
}

function* fetchRecentActivitiesSaga(): Generator<Effect, void, unknown> {
  try {
    const activities = (yield call(fetchActivitiesFromAPI)) as any //as RecentActivity[];
    console.log(activities.response.activities    );
    yield put(fetchRecentActivitiesSuccess(activities));
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(fetchRecentActivitiesFailure(error.message));
    } else {
      yield put(fetchRecentActivitiesFailure('An unknown error occurred'));
    }
  }
}

export function* adminSaga(): Generator<Effect, void, unknown> {
  yield takeLatest(AdminActionTypes.FETCH_ADMIN_STATS_REQUEST, fetchAdminStatsSaga);
  yield takeLatest(AdminActionTypes.FETCH_RECENT_ACTIVITIES_REQUEST, fetchRecentActivitiesSaga);
}

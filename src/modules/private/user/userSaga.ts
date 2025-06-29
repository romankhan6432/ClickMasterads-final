import { call, put, takeLatest, select, Effect } from 'redux-saga/effects';
import { UserActionTypes, User, UserStats } from './types';
import {
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchUserStatsSuccess,
  fetchUserStatsFailure,
  updateUserStatusSuccess,
  updateUserStatusFailure,
  updateUserStatus,
  watchAdSuccess,
  watchAdFailure,
  fetchUserStats
} from './actions';
import { RootState } from '../../store';
import { findUserAndUpdated } from '@/modules/public';
import { toast } from 'react-toastify';

// API response types
interface UsersResponse {
  users: User[];
  total: number;
}

// API functions
const fetchUsersFromAPI = async (page: number, filters: Record<string, unknown>): Promise<UsersResponse> => {
  const response = await fetch(`/api/admin/users?page=${page}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(filters)
  });
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
};

const fetchUserStatsFromAPI = async (): Promise<UserStats> => {
  const response = await fetch('/api/admin/users/stats');
  if (!response.ok) throw new Error('Failed to fetch user stats');
  return response.json();
};

const updateUserStatusAPI = async (id: string, isActive: boolean): Promise<User> => {
  const response = await fetch(`/api/admin/users/${id}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ isActive })
  });
  if (!response.ok) throw new Error('Failed to update user status');
  return response.json();
};

const watchAdAPI = async (): Promise<{ stats: UserStats }> => {
  
 

  const response = await fetch('/api/ads', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }
  });
  if (!response.ok) throw new Error('Failed to record ad watch');
  return response.json();
};

// Saga workers
function* fetchUsersSaga(): Generator<Effect, void, unknown> {
  try {
    const state = (yield select()) as RootState;
    const { currentPage, filters } = state.private.user;
    const response = (yield call(fetchUsersFromAPI, currentPage, filters)) as UsersResponse;
    yield put(fetchUsersSuccess(response.users, response.total));
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(fetchUsersFailure(error.message));
    } else {
      yield put(fetchUsersFailure('An unknown error occurred'));
    }
  }
}

function* fetchUserStatsSaga(): Generator<Effect, void, unknown> {
  try {
    const stats = (yield call(fetchUserStatsFromAPI)) as UserStats;
    yield put(fetchUserStatsSuccess(stats));
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(fetchUserStatsFailure(error.message));
    } else {
      yield put(fetchUserStatsFailure('An unknown error occurred'));
    }
  }
}

function* updateUserStatusSaga(action: ReturnType<typeof updateUserStatus>): Generator<Effect, void, unknown> {
  try {
    const { id, isActive } = action.payload;
    const updatedUser = (yield call(updateUserStatusAPI, id, isActive)) as User;
    yield put(updateUserStatusSuccess(updatedUser));
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(updateUserStatusFailure(error.message));
    } else {
      yield put(updateUserStatusFailure('An unknown error occurred'));
    }
  }
}

function* watchAdSaga(): Generator<Effect, void, unknown> {
  try {
    const result = (yield call(watchAdAPI)) as any
    yield put(watchAdSuccess(result));
    yield put(findUserAndUpdated(result.result))
    toast.success('Ad watched successfully');
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.error(error.message);
      yield put(watchAdFailure(error.message));
    } else {
      yield put(watchAdFailure('Failed to watch ad'));
    }
  }
}

// Root saga
export function* userSaga(): Generator<Effect, void, unknown> {
  yield takeLatest(UserActionTypes.FETCH_USERS_REQUEST, fetchUsersSaga);
  yield takeLatest(UserActionTypes.FETCH_USER_STATS_REQUEST, fetchUserStatsSaga);
  yield takeLatest(UserActionTypes.UPDATE_USER_STATUS_REQUEST, updateUserStatusSaga);
  yield takeLatest(UserActionTypes.WATCH_AD_REQUEST, watchAdSaga);
}

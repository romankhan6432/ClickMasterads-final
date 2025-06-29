"use client";

import { call, put, takeLatest, Effect, all, fork } from 'redux-saga/effects';
import { AuthActionTypes, LoginCredentials, User } from './types';
import {
  loginSuccess,
  loginFailure,
} from './actions';
import { API_CALL } from '@/lib/client';

 
interface AuthResponse {
  success: boolean;
  user: User;
}

const loginAPI = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  
  const response = await fetch(`/api/auth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials)
  });
  
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Login failed');
  return data;
};

const checkAuthAPI = async () => {
  const { response} = await API_CALL({  url : '/user/me/'});
 
  return  response?.result;
};

const logoutAPI = async (): Promise<void> => {
  
  await fetch(`api/auth`, {
    method: 'DELETE',
  });
};

function* loginSaga(action: { type: string; payload: LoginCredentials }): Generator<Effect, void, unknown> {
  try {
    const response = (yield call(loginAPI, action.payload)) as AuthResponse;
    yield put(loginSuccess(response.user));
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      yield put(loginFailure(error.message));
    } else {
      yield put(loginFailure('An unknown error occurred'));
    }
  }
}

function* checkAuthSaga(): Generator<Effect, void, unknown> {
  try {
    const response = (yield call(checkAuthAPI)) as AuthResponse;
    yield put(loginSuccess(response?.user));
  } catch (error) {
    // Silently fail as this is just a check
    console.error('Auth check failed:', error);
  }
}

function* logoutSaga(): Generator<Effect, void, unknown> {
  try {
    yield call(logoutAPI);
    yield put({ type: AuthActionTypes.LOGOUT_SUCCESS });
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

// Watcher Sagas
function* watchLogin() {
  yield takeLatest(AuthActionTypes.LOGIN_REQUEST, loginSaga);
}

function* watchLogout() {
  yield takeLatest(AuthActionTypes.LOGOUT, logoutSaga);
}

function* watchCheckAuth() {
  yield takeLatest(AuthActionTypes.CHECK_AUTH, checkAuthSaga);
}

// Root auth saga
export function* authSaga(): Generator<Effect, void, unknown> {
  yield all([
    fork(watchLogin),
    fork(watchLogout),
    fork(watchCheckAuth),
  ]);

  // Initial auth check
  yield call(checkAuthSaga);
}

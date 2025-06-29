import { call, put, takeLatest } from 'redux-saga/effects';
 
import {
  FETCH_WITHDRAWAL_DATA_REQUEST,
  FETCH_WITHDRAWAL_DATA_SUCCESS,
  FETCH_WITHDRAWAL_DATA_FAILURE
} from './constants';
import { API_CALL, TypeApiPromise } from '@/lib/client';

function* fetchWithdrawalDataSaga()   {
  try {
    const { response} : TypeApiPromise =  yield call(API_CALL, { url : '/withdrawal-methods'})
    yield put({ type: FETCH_WITHDRAWAL_DATA_SUCCESS, payload: response  });
  } catch (error: any) {
    yield put({ 
      type: FETCH_WITHDRAWAL_DATA_FAILURE, 
      payload: error?.message || 'Failed to fetch withdrawal data'
    });
  }
}

export function* withdrawal_methodsSaga() {
  yield takeLatest(FETCH_WITHDRAWAL_DATA_REQUEST, fetchWithdrawalDataSaga);
} 
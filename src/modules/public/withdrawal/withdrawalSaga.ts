import { call, put, takeLatest, all } from 'redux-saga/effects';
import { withdrawalApi } from './api';
import {
    FETCH_WITHDRAWAL_HISTORY,
    FETCH_WITHDRAWAL_TIMING,
    fetchWithdrawalHistorySuccess,
    fetchWithdrawalHistoryFailure,
    fetchWithdrawalTimingSuccess,
    fetchWithdrawalTimingFailure
} from './withdrawalActions';

function* fetchWithdrawalHistorySaga(): Generator<any, void, any> {
    try {
        const history = yield call(withdrawalApi.getWithdrawalHistory);
        yield put(fetchWithdrawalHistorySuccess(history));
    } catch (error: any) {
        yield put(fetchWithdrawalHistoryFailure(error.response?.data?.message || 'Failed to fetch withdrawal history'));
    }
}

function* fetchWithdrawalTimingSaga(): Generator<any, void, any> {
    try {
        const timing = yield call(withdrawalApi.getWithdrawalTiming);
        yield put(fetchWithdrawalTimingSuccess(timing));
    } catch (error: any) {
        yield put(fetchWithdrawalTimingFailure(error.response?.data?.message || 'Failed to fetch withdrawal timing'));
    }
}

export function* withdrawalSaga() {
    yield all([
        takeLatest(FETCH_WITHDRAWAL_HISTORY, fetchWithdrawalHistorySaga),
        takeLatest(FETCH_WITHDRAWAL_TIMING, fetchWithdrawalTimingSaga)
    ]);
}

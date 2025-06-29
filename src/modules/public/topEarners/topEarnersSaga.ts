import { call, put, takeLatest, all } from 'redux-saga/effects';
import { topEarnersApi } from './api';
import {
    FETCH_TOP_EARNERS,
    fetchTopEarnersSuccess,
    fetchTopEarnersFailure
} from './topEarnersActions';

function* fetchTopEarnersSaga(action: any): Generator<any, void, any> {
    try {
        const [todayData, allTimeData] = yield all([
            call(topEarnersApi.getTopEarners, 'today'),
            call(topEarnersApi.getTopEarners, 'all')
        ]);

        yield put(fetchTopEarnersSuccess({
            today: todayData.data.earners,
            allTime: allTimeData.data.earners
        }));
    } catch (error: any) {
        yield put(fetchTopEarnersFailure(error.response?.data?.message || 'Failed to fetch top earners'));
    }
}

export function* topEarnersSaga() {
    yield takeLatest(FETCH_TOP_EARNERS, fetchTopEarnersSaga);
}

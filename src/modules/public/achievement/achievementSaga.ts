import { call, put, takeLatest, all } from 'redux-saga/effects';
import { achievementApi } from './api';
import {
    FETCH_ACHIEVEMENTS,
    UPDATE_ACHIEVEMENT,
    fetchAchievementsSuccess,
    fetchAchievementsFailure,
    updateAchievementSuccess,
    updateAchievementFailure
} from './achievementActions';

function* fetchAchievementsSaga(): Generator<any, void, any> {
    try {
        const achievements = yield call(achievementApi.getAchievements);
        yield put(fetchAchievementsSuccess(achievements.achievements));
    } catch (error: any) {
        yield put(fetchAchievementsFailure(error.response?.data?.message || 'Failed to fetch achievements'));
    }
}

function* updateAchievementSaga(action: any): Generator<any, void, any> {
    try {
        const { type, progress } = action.payload;
        const achievements = yield call(achievementApi.updateAchievement, type, progress);
        yield put(updateAchievementSuccess(achievements));
    } catch (error: any) {
        yield put(updateAchievementFailure(error.response?.data?.message || 'Failed to update achievement'));
    }
}

export function* achievementSaga() {
    yield all([
        takeLatest(FETCH_ACHIEVEMENTS, fetchAchievementsSaga),
        takeLatest(UPDATE_ACHIEVEMENT, updateAchievementSaga)
    ]);
}

'use client';

import { call, put, takeLatest } from 'redux-saga/effects';
import {
  LOAD_SETTINGS,
  LOAD_SETTINGS_SUCCESS,
  LOAD_SETTINGS_FAILURE,
  SAVE_SETTINGS,
  SAVE_SETTINGS_SUCCESS,
  SAVE_SETTINGS_FAILURE,
} from './actions';
import { fetchSettingsAPI, saveSettingsAPI } from './api';

function* loadSettingsSaga(): Generator<any, void, any> {
  try {
    const data = yield call(fetchSettingsAPI);
    yield put({ type: LOAD_SETTINGS_SUCCESS, payload: data });
  } catch (error: any) {
    yield put({ type: LOAD_SETTINGS_FAILURE, payload: error.message });
  }
}

function* saveSettingsSaga(action: any): Generator<any, void, any> {
  try {
    const data = yield call(saveSettingsAPI, action.payload);
    yield put({ type: SAVE_SETTINGS_SUCCESS, payload: data });
  } catch (error: any) {
    yield put({ type: SAVE_SETTINGS_FAILURE, payload: error.message });
  }
}

export function* settingsSaga() {
  yield takeLatest(LOAD_SETTINGS, loadSettingsSaga);
  yield takeLatest(SAVE_SETTINGS, saveSettingsSaga);
}

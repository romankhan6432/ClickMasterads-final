import { takeLatest, put, call } from 'redux-saga/effects';
import { DirectLinksActionTypes, DirectLink } from './types';
import { 
  fetchDirectLinksSuccess, 
  fetchDirectLinksFailure,
  clickLinkSuccess,
  clickLinkFailure 
} from './actions';
import { API_CALL, TypeApiPromise } from '@/lib/client';

function* fetchDirectLinksSaga() {
  try {
    const { response } : TypeApiPromise = yield call(API_CALL, { url: '/direct-links' });
    const links = Array.isArray(response?.result) ? response.result : [];
    yield put(fetchDirectLinksSuccess(links));
  } catch (error: any) {
    yield put(fetchDirectLinksFailure(error.message || 'Failed to fetch direct links'));
  }
}

function* clickLinkSaga(action: any) {
  try {
    yield call(API_CALL, {   
      url: '/direct-links/click',
      method: 'POST',
      body: action.payload
    });
    yield put(clickLinkSuccess());
  } catch (error: any) {
    yield put(clickLinkFailure(error.message || 'Failed to record link click'));
  }
}

export function* directLinksSaga() {
  yield takeLatest(DirectLinksActionTypes.FETCH_LINKS_REQUEST, fetchDirectLinksSaga);
  yield takeLatest(DirectLinksActionTypes.CLICK_LINK_REQUEST, clickLinkSaga);
}

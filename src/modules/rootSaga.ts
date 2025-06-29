import { all, fork, Effect } from 'redux-saga/effects';

// Private sagas
import { userSaga , adminSaga , withdrawalsSaga } from './private';
  
// Public sagas
import { authSaga } from './public';
import { withdrawalSaga } from './public/withdrawal/withdrawalSaga';
import { topEarnersSaga } from './public/topEarners/topEarnersSaga';
import { achievementSaga } from './public/achievement/achievementSaga';
import { withdrawal_methodsSaga } from './public/withdrawal_methods/sagas';
import { directLinksSaga } from './public/directLinks/sagas';
import { settingsSaga } from './private/settings/sagas';
export function* rootSaga(): Generator<Effect, void, unknown> {
  yield all([
    // Private sagas
    fork(userSaga),
    fork(adminSaga),
    fork(withdrawalsSaga),
    fork(settingsSaga),
    // Public sagas
    fork(authSaga),
    fork(withdrawalSaga),
    fork(topEarnersSaga),
    fork(withdrawal_methodsSaga),
    fork(directLinksSaga)
  ]);
}

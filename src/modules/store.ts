'use client';

import { createStore, applyMiddleware, Store, combineReducers } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { composeWithDevTools } from '@redux-devtools/extension';

// Private reducers
 
import { adminReducer , userReducer } from './private';
import { withdrawalsReducer } from './private/withdrawals/withdrawalsReducer';
import { withdrawal_methodsReducer } from './public'

// Public reducers
import { authReducer } from './public/auth/authReducer';
import { directLinksReducer } from './public/directLinks/directLinksReducer';
import { withdrawalReducer } from './public/withdrawal/withdrawalReducer';
import { topEarnersReducer } from './public/topEarners/topEarnersReducer';
import { achievementReducer } from './public/achievement/achievementReducer';
import { settingsReducer } from './private/settings/reducer';
// Root saga
import { rootSaga } from './rootSaga';

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Combine private reducers
const privateReducers = combineReducers({
  user: userReducer,
  admin: adminReducer,
  withdrawals: withdrawalsReducer,
  settings : settingsReducer
  
});

// Combine public reducers
const publicReducers = combineReducers({
  auth: authReducer,
  directLinks: directLinksReducer,
  withdrawal: withdrawalReducer,
  topEarners: topEarnersReducer,
  achievement: achievementReducer,
  withdrawal_methods: withdrawal_methodsReducer
});

// Root reducer
const rootReducer = combineReducers({
  private: privateReducers,
  public: publicReducers,
});

// Define RootState type
export type RootState = ReturnType<typeof rootReducer>;

// Create store
const store = createStore(
  rootReducer as any,
  composeWithDevTools(applyMiddleware(sagaMiddleware))
);

// Define AppDispatch type
export type AppDispatch = typeof store.dispatch;

// Run saga middleware
sagaMiddleware.run(rootSaga);

export default store;

import { UserState, UserActionTypes, UserAction } from './types';

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  pageSize: 10,
  filters: {},
  stats: {
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    newUsersToday: 0,
  }
};

export const userReducer = (state = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case UserActionTypes.WATCH_AD_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    case UserActionTypes.WATCH_AD_SUCCESS:
      return {
        ...state,
        loading: false,
        stats: action.payload.stats || state.stats
      };
    case UserActionTypes.WATCH_AD_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    default:
      return state;
  }
};

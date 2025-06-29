import { AdminState, AdminAction, AdminActionTypes } from './types';

const initialState: AdminState = {
  stats: {
    totalUsers: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0,
    newUsersLast24h: 0
  },
  recentActivities: [],
  loading: false,
  error: null
};

export const adminReducer = (state = initialState, action: AdminAction): AdminState => {
  switch (action.type) {
    case AdminActionTypes.FETCH_ADMIN_STATS_REQUEST:
    case AdminActionTypes.FETCH_RECENT_ACTIVITIES_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case AdminActionTypes.FETCH_ADMIN_STATS_SUCCESS:
      return {
        ...state,
        loading: false,
        stats: action.payload
      };

    case AdminActionTypes.FETCH_RECENT_ACTIVITIES_SUCCESS:
      return {
        ...state,
        loading: false,
        recentActivities: action.payload
      };

    case AdminActionTypes.FETCH_ADMIN_STATS_FAILURE:
    case AdminActionTypes.FETCH_RECENT_ACTIVITIES_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};

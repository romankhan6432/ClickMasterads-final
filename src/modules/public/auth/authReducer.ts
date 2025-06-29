'use client';
import { AuthState, AuthAction, AuthActionTypes } from './types';


const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  telegramInitData: null,
  success: null
};

export const authReducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionTypes.LOGIN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
        error: null,
  
      };

    case AuthActionTypes.FIND_USER_AND_UPDATED:
      const { _id, adsWatched , newBalance } : any= action.payload;                
      
       
    return { ...state , user: { ...state.user, adsWatched, balance: newBalance , id: _id } } as any

    case AuthActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false
      };

    case AuthActionTypes.LOGOUT:
    case AuthActionTypes.LOGOUT_SUCCESS:
      return {
        ...initialState
      };

    default:
      return state;
  }
};

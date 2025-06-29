import { 
  AuthActionTypes, 
  User
} from './types';

// Action creators for synchronous actions
export const loginSuccess = (user: User) => ({
  type: AuthActionTypes.LOGIN_SUCCESS,
  payload: { user }
});

export const loginFailure = (error: string) => ({
  type: AuthActionTypes.LOGIN_FAILURE,
  payload: error
});

export const logout = () => ({
  type: AuthActionTypes.LOGOUT
});

export const logoutSuccess = () => ({
  type: AuthActionTypes.LOGOUT_SUCCESS
});

export const checkAuth = () => ({
  type: AuthActionTypes.CHECK_AUTH
});



export const findUserAndUpdated = (payload : any) => ({
  type: AuthActionTypes.FIND_USER_AND_UPDATED,
  payload
});
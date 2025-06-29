 // User data types
export interface User {
  _id: string;
  telegramId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  email?: string;
  balance: number;
  totalEarned: number;
  adsWatched: number;
  lastWatchTime?: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  level?: number;
  rank?: string;
  role ? : string;
  referredUsers : any[]
}



export interface TelegramInitData {
  query_id?: string;
  user?: {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    language_code?: string;
  };
  auth_date?: string;
  hash?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  telegramInitData: TelegramInitData | null;
  success: string | null;
}

export enum AuthActionTypes {
  LOGIN_REQUEST = 'LOGIN_REQUEST',
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILURE = 'LOGIN_FAILURE',
  LOGOUT = 'LOGOUT',
  LOGOUT_SUCCESS = 'LOGOUT_SUCCESS',
  CHECK_AUTH = 'CHECK_AUTH',
  FIND_USER_AND_UPDATED = 'FIND_USER_AND_UPDATED'
}

export interface LoginCredentials {
  telegramId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
}



export interface FindUserAndUpdatedPayload {
  _id: string;
  newBalance: number;
  adsWatched: number;
}

export type AuthAction =
  | { type: AuthActionTypes.LOGIN_REQUEST; payload: LoginCredentials }
  | { type: AuthActionTypes.LOGIN_SUCCESS; payload: { user: User } }
  | { type: AuthActionTypes.LOGIN_FAILURE; payload: string }
  | { type: AuthActionTypes.LOGOUT }
  | { type: AuthActionTypes.LOGOUT_SUCCESS }
  | { type: AuthActionTypes.FIND_USER_AND_UPDATED; payload: FindUserAndUpdatedPayload }
  | { type: AuthActionTypes.CHECK_AUTH }; 

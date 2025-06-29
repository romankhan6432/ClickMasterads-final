import { WithdrawalMethod, Coin } from './types';
import {
  FETCH_WITHDRAWAL_DATA_REQUEST,
  FETCH_WITHDRAWAL_DATA_SUCCESS,
  FETCH_WITHDRAWAL_DATA_FAILURE,
  SET_SELECTED_METHOD,
  SET_SELECTED_COIN,
  RESET_WITHDRAWAL
} from './constants';

interface WithdrawalState {
  methods: WithdrawalMethod[];
  coins: Coin[];
  selectedMethod: WithdrawalMethod | null;
  selectedCoin: Coin | null;
  loading: boolean;
  error: string | null;
}

const initialState: WithdrawalState = {
  methods: [],
  coins: [],
  selectedMethod: null,
  selectedCoin: null,
  loading: false,
  error: null,
};

 
export const withdrawal_methodsReducer = (state = initialState, action: any): WithdrawalState =>{
  switch (action.type) {
    case FETCH_WITHDRAWAL_DATA_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_WITHDRAWAL_DATA_SUCCESS:
      return {
        ...state,
        loading: false,
        methods: action.payload.methods,
        coins: action.payload.coins,
        error: null
      };
    case FETCH_WITHDRAWAL_DATA_FAILURE:
      return { 
        ...state, 
        loading: false, 
        error: action.payload,
        methods: [],
        coins: []
      };
    case SET_SELECTED_METHOD:
      return {
        ...state,
        selectedMethod: action.payload,
        selectedCoin: null,
      };
    case SET_SELECTED_COIN:
      return { ...state, selectedCoin: action.payload };
    case RESET_WITHDRAWAL:
      return {
        ...state,
        selectedMethod: null,
        selectedCoin: null,
      };
    default:
      return state;
  }
} 
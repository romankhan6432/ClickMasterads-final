import { createSelector } from 'reselect';
import { RootState } from '@/modules/store';
import { WithdrawalMethod, Coin } from './types';

// Base selector
const getWithdrawalState = (state: RootState) => state.public.withdrawal_methods;

// Memoized selectors
export const getWithdrawalMethods = createSelector(
  [getWithdrawalState],
  (withdrawal) => withdrawal.methods
);

export const getWithdrawalCoins = createSelector(
  [getWithdrawalState],
  (withdrawal) => withdrawal.coins
);

export const getSelectedMethod = createSelector(
  [getWithdrawalState],
  (withdrawal) => withdrawal.selectedMethod
);

export const getSelectedCoin = createSelector(
  [getWithdrawalState],
  (withdrawal) => withdrawal.selectedCoin
);

export const getIsLoading = createSelector(
  [getWithdrawalState],
  (withdrawal) => withdrawal.loading
);

export const getError = createSelector(
  [getWithdrawalState],
  (withdrawal) => withdrawal.error
);

// Combined selectors
export const getSupportedCoins = createSelector(
  [getWithdrawalCoins, getSelectedMethod],
  (coins, selectedMethod): Coin[] => {
    if (!selectedMethod) return [];
    return coins.filter(coin => 
      selectedMethod.supportedCoins.includes(coin.symbol)
    );
  }
);

export const getCanSubmit = createSelector(
  [getSelectedMethod, getSelectedCoin],
  (method, coin): boolean => {
    return !!(method && coin);
  }
); 
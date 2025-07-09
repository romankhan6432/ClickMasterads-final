//  withdrawal amounts
export const MIN_CRYPTO_AMOUNT = 900; // Minimum USDT withdrawal
export const MAX_CRYPTO_AMOUNT = 50;
export const MIN_BDT_AMOUNT = 100; // Minimum BDT withdrawal (৳100)
export const MAX_BDT_AMOUNT = 400000000000000; // Maximum BDT withdrawal (৳5000)

// Conversion rates
export const USD_TO_BDT_RATE = 100; // $1 = ৳100

// Processing times
export const CRYPTO_PROCESSING_TIME = '10-30 minutes';
export const BDT_PROCESSING_TIME = '24-48 hours';

// Network fees
export const NETWORK_FEE_MESSAGE = 'Varies by network';

// Validation messages
export const VALIDATION_MESSAGES = {
  INSUFFICIENT_BALANCE: 'Insufficient Balance',
  INVALID_MOBILE: 'Please enter a valid mobile number',
  MIN_CRYPTO: `Minimum withdrawal amount is $${MIN_CRYPTO_AMOUNT}`,
  MIN_BDT: `Minimum withdrawal amount is ৳${MIN_BDT_AMOUNT}`,
  MAX_BDT: `Maximum withdrawal amount is ৳${MAX_BDT_AMOUNT}`,
  MEMO_REQUIRED: 'Memo is required for BEP2 network',
  WALLET_REQUIRED: 'Please enter a valid wallet address',
} as const;
'use client';

import { Controller } from 'react-hook-form';
import { styles } from '../styles/withdrawal';

interface AmountInputProps {
  control: any;
  isDisabled: boolean;
  isCryptoPayment: boolean;
  balance: number;
  validateAmount: (value: string) => boolean | string;
  setMaxAmount: () => void;
  minAmount: number;
}

export function AmountInput({ 
  control, 
  isDisabled, 
  isCryptoPayment, 
  balance, 
  validateAmount,
  setMaxAmount,
  minAmount 
}: AmountInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-300">Amount</label>
        <div className="text-xs text-gray-400">
          Available: <span className="text-white">${balance.toFixed(3)} USDT</span>
        </div>
      </div>
      <Controller
        name="amount"
        control={control}
        rules={{
          required: 'Amount is required',
          validate: validateAmount
        }}
        render={({ field, fieldState: { error } }) => (
          <div className="relative">
            <input
              {...field}
              type="number"
              inputMode="decimal"
              step={isCryptoPayment ? '0.001' : '1'}
              className={`w-full ${styles.sectionBg} rounded-lg p-3 pr-20 border ${error ? 'border-red-500' : 'border-[#2B3139]'} focus:border-[#F0B90B] focus:outline-none focus:ring-1 focus:ring-[#F0B90B]/20 transition-all duration-200 placeholder:text-gray-500 ${styles.text.primary}`}
              placeholder="0.00"
              disabled={isDisabled}
              min={minAmount}
              max={isCryptoPayment ? balance : undefined}
            />
            <button
              type="button"
              onClick={setMaxAmount}
              disabled={isDisabled}
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1 ${styles.sectionBg} ${styles.text.accent} text-sm font-medium rounded hover:opacity-80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              MAX
            </button>
            {error && (
              <p className="mt-1 text-sm text-red-500">{error.message}</p>
            )}
          </div>
        )}
      />
    </div>
  );
}

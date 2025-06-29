'use client';

import { Controller } from 'react-hook-form';
import { styles } from '../styles/withdrawal';
import { NetworkType } from '../types/withdrawal';

interface RecipientInputProps {
  control: any;
  isDisabled: boolean;
  isCryptoPayment: boolean;
  validateRecipient: (value: string) => boolean | string;
  selectedNetwork?: NetworkType;
}

export function RecipientInput({ control, isDisabled, isCryptoPayment, validateRecipient, selectedNetwork }: RecipientInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-300">
          {isCryptoPayment ? 'Wallet Address' : 'Mobile Number'}
        </label>
        <span className="text-xs text-gray-400">
          {isCryptoPayment ? 'Enter your wallet address' : 'Enter your mobile number'}
        </span>
      </div>
      <Controller
        name="recipient"
        control={control}
        rules={{
          required: 'This field is required',
          validate: validateRecipient
        }}
        render={({ field, fieldState: { error } }) => (
          <div>
            <div className="relative">
              <input
                {...field}
                type={isCryptoPayment ? "text" : "tel"}
                inputMode={isCryptoPayment ? "text" : "numeric"}
                pattern={isCryptoPayment ? undefined : "[0-9]*"}
                className={`w-full ${styles.sectionBg} rounded-lg p-3 pr-10 border ${error ? 'border-red-500' : 'border-[#2B3139]'} focus:border-[#F0B90B] focus:outline-none focus:ring-1 focus:ring-[#F0B90B]/20 transition-all duration-200 placeholder:text-gray-500 ${styles.text.primary}`}
                placeholder={isCryptoPayment ? `Enter your ${selectedNetwork?.toUpperCase()} address` : 'Enter your mobile number'}
                disabled={isDisabled}
                onChange={(e) => {
                  if (!isCryptoPayment) {
                    const value = e.target.value.replace(/\\D/g, '');
                    field.onChange(value);
                  } else {
                    field.onChange(e.target.value.trim());
                  }
                }}
              />
              {field.value && (
                <button
                  type="button"
                  onClick={() => field.onChange('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-500">{error.message}</p>
            )}
          </div>
        )}
      />
    </div>
  );
}

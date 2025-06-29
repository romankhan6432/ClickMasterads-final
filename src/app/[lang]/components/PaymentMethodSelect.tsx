'use client';

import Image from 'next/image';
import { Controller } from 'react-hook-form';
import { CustomSelect } from './CustomSelect';
import { PaymentMethod } from '../types/withdrawal';

interface PaymentMethodSelectProps {
  control: any;
  isDisabled: boolean;
  paymentMethodOptions: Array<{
    value: PaymentMethod;
    label: string;
    icon: string;
    description: string;
  }>;
}

export function PaymentMethodSelect({ control, isDisabled, paymentMethodOptions }: PaymentMethodSelectProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-300">Coin</label>
        <span className="text-xs text-gray-400">Select withdrawal method</span>
      </div>
      <Controller
        name="method"
        control={control}
        render={({ field }) => (
          <CustomSelect
            {...field}
            disabled={isDisabled}
            className="w-full"
            style={{ height: '60px' }}
            options={paymentMethodOptions.map(option => ({
              ...option,
              label: (
                <div className="flex items-center gap-3 py-1.5">
                  <div className="w-6 h-6 relative flex-shrink-0">
                    <Image
                      src={option.icon}
                      alt={option.label}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <div className="font-medium text-white">{option.label}</div>
                    <div className="text-xs text-gray-400">{option.description}</div>
                  </div>
                </div>
              )
            }))}
          />
        )}
      />
    </div>
  );
}

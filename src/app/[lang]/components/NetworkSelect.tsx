'use client';

import { Controller } from 'react-hook-form';
import { CustomSelect } from './CustomSelect';
import { NetworkType, PaymentMethod } from '../types/withdrawal';

interface NetworkSelectProps {
  control: any;
  isDisabled: boolean;
  selectedMethod: PaymentMethod;
  networkOptions: Record<PaymentMethod, Array<{
    value: NetworkType;
    label: string;
    memo?: boolean;
    fee?: string;
    processingTime?: string;
  }>>;
}

export function NetworkSelect({ control, isDisabled, selectedMethod, networkOptions }: NetworkSelectProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-300">Network</label>
        <span className="text-xs text-gray-400">Select the network type</span>
      </div>
      <Controller
        name="network"
        control={control}
        rules={{ required: 'Please select a network' }}
        render={({ field, fieldState: { error } }) => (
          <>
            <CustomSelect
              {...field as any}
              disabled={isDisabled}
              className="w-full"
              style={{ height: '40px' }}
              options={networkOptions[selectedMethod].map(network => ({
                value: network.value,
                label: (
                  <div className="flex flex-col py-1.5">
                    <div className="font-medium text-white">{network.label}</div>
                    <div className="flex items-center text-xs text-gray-400 mt-1">
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none">
                          <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        {network.processingTime}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none">
                          <path d="M12 2v6m0 8v6M4.93 10H2m20 0h-2.93M19.07 14H22m-20 0h2.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        Fee: {network.fee}
                      </span>
                    </div>
                  </div>
                )
              }))}
            />
            {error && (
              <p className="mt-1 text-sm text-red-500">{error.message}</p>
            )}
          </>
        )}
      />
    </div>
  );
}

'use client';

import { styles } from '../styles/withdrawal';
import { PaymentMethod } from '../types/withdrawal';

interface WarningBoxProps {
  selectedMethod: PaymentMethod;
}

export function WarningBox({ selectedMethod }: WarningBoxProps) {
  return (
    <div className="bg-[#F0B90B]/5 rounded-lg p-4">
      <div className="flex items-start space-x-3">
        <svg className={`w-5 h-5 ${styles.text.accent} mt-0.5 flex-shrink-0`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <div className="text-sm">
          <p className={`font-medium mb-1 ${styles.text.accent}`}>Important</p>
          <ul className="list-disc list-inside space-y-1 text-[#B7BDC6]">
            <li>Please ensure you've selected the correct network</li>
            <li>Double check the withdrawal address</li>
            {selectedMethod === PaymentMethod.BINANCE && (
              <>
                <li>Ensure your Binance account has 2FA enabled</li>
                <li>Address must be whitelisted on Binance</li>
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

'use client';

import { styles } from '../styles/withdrawal';
import { NetworkType, PaymentMethod } from '../types/withdrawal';

interface TransactionDetailsProps {
  selectedNetwork?: NetworkType;
  selectedMethod: PaymentMethod;
  networkOptions: Record<PaymentMethod, Array<{
    value: NetworkType;
    label: string;
    memo?: boolean;
    fee?: string;
    processingTime?: string;
  }>>;
  defaultProcessingTime: string;
  defaultFeeMessage: string;
}

export function TransactionDetails({
  selectedNetwork,
  selectedMethod,
  networkOptions,
  defaultProcessingTime,
  defaultFeeMessage
}: TransactionDetailsProps) {
  const selectedNetworkDetails = selectedMethod === PaymentMethod.BINANCE && selectedNetwork
    ? networkOptions[PaymentMethod.BINANCE].find(n => n.value === selectedNetwork)
    : null;

  return (
    <div className={`${styles.sectionBg} rounded-lg p-4 space-y-3`}>
      <h3 className={`text-sm font-medium ${styles.text.primary}`}>Transaction Details</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between py-1 border-b border-[#2B3139]">
          <span className={styles.text.secondary}>Network</span>
          <span className={`${styles.text.primary} font-medium`}>
            {selectedNetwork?.toUpperCase() || '-'}
          </span>
        </div>
        <div className="flex justify-between py-1 border-b border-[#2B3139]">
          <span className={styles.text.secondary}>Estimated Arrival</span>
          <span className={`${styles.text.primary} font-medium`}>
            {selectedNetworkDetails?.processingTime || defaultProcessingTime}
          </span>
        </div>
        <div className="flex justify-between py-1">
          <span className={styles.text.secondary}>Network Fee</span>
          <span className={`${styles.text.primary} font-medium`}>
            {selectedNetworkDetails?.fee || defaultFeeMessage}
          </span>
        </div>
      </div>
    </div>
  );
}

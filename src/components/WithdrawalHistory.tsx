"use client"
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { 
  XMarkIcon, 
  ArrowLeftIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

import { fetchWithdrawalHistory } from '@/modules/public/withdrawal/withdrawalActions';
import { RootState } from '@/modules/store';
import { WithdrawalDetails } from '@/app/[lang]/components/WithdrawalDetails';

interface WithdrawalHistoryProps {
  isOpen: boolean;
  onClose: () => void;
}

interface WithdrawalRecord {
  id: string;
  createdAt: string;
  amount: number;
  bdtAmount: number;
  method: string;
  status: 'pending' | 'approved' | 'failed';
  metadata?: {
    network?: string;
    address?: string;
    txId?: string;
    fee?: number;
    originalAmount : number;
    amountAfterFee : number;
  };
}



export default function WithdrawalHistory({ isOpen, onClose }: WithdrawalHistoryProps) {
  const dispatch = useDispatch();
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRecord | null>(null);
  
  const { withdrawalHistory, loading, error } = useSelector((state: RootState) => state.public.withdrawal);

  const handleRefresh = () => {
    dispatch(fetchWithdrawalHistory());
  };

  useEffect(() => {
    if (isOpen) {
      handleRefresh();
    }
  }, [isOpen]);

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/80" />
          </Transition.Child>

          <div className="fixed inset-0">
            <div className="min-h-screen w-screen flex items-center justify-center sm:p-4 p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-full sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="w-screen h-screen sm:h-auto sm:w-full sm:max-w-2xl transform overflow-hidden bg-[#0B0E11] sm:border sm:border-[#2E353F] sm:rounded-lg transition-all">
                  {/* Header */}
                  <div className="sticky top-0 z-10 border-b border-[#2E353F] bg-[#0B0E11] p-4 sm:p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={onClose}
                          className="rounded-lg p-1.5 text-[#1E2329] bg-[#F0B90B] hover:bg-[#F0B90B]/80 focus:outline-none sm:hidden transition-all"
                        >
                          <ArrowLeftIcon className="h-5 w-5" />
                        </button>
                        <Dialog.Title as="h3" className="text-xl font-semibold text-white flex items-center gap-2">
                          Withdrawal History
                          <button
                            onClick={handleRefresh}
                            className="p-1 rounded-lg text-[#1E2329] bg-[#F0B90B] hover:bg-[#F0B90B]/80 focus:outline-none transition-all"
                          >
                            <ArrowPathIcon className="h-4 w-4" />
                          </button>
                        </Dialog.Title>
                      </div>
                      <button
                        type="button"
                        onClick={onClose}
                        className="rounded-lg p-1.5 text-[#1E2329] bg-[#F0B90B] hover:bg-[#F0B90B]/80 focus:outline-none hidden sm:block transition-all"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="h-[calc(100vh-70px)] sm:h-[600px] overflow-y-auto p-4 sm:p-6 bg-[#0B0E11]">
                    {loading ? (
                      <div className="flex items-center justify-center h-full">
                        <ArrowPathIcon className="h-8 w-8 text-[#F0B90B] animate-spin" />
                      </div>
                    ) : error ? (
                      <div className="flex items-center justify-center h-full text-[#CD6D6D]">
                        {error}
                      </div>
                    ) : withdrawalHistory?.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-[#848E9C]">
                        <ClockIcon className="h-12 w-12 mb-4" />
                        <p>No withdrawal history</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {withdrawalHistory?.map((withdrawal: WithdrawalRecord) => (
                          <button
                            key={withdrawal.id}
                            onClick={() => setSelectedWithdrawal(withdrawal)}
                            className="w-full bg-[#1E2329] rounded-lg p-4 border border-[#2E353F] hover:border-[#3E454F] transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${
                                  withdrawal.status === 'approved' ? 'bg-[#02C076]/10' :
                                  withdrawal.status === 'failed' ? 'bg-[#CD6D6D]/10' :
                                  'bg-[#F0B90B]/10'
                                }`}>
                                  {withdrawal.status === 'approved' ? (
                                    <CheckCircleIcon className="h-5 w-5 text-[#02C076]" />
                                  ) : withdrawal.status === 'failed' ? (
                                    <XCircleIcon className="h-5 w-5 text-[#CD6D6D]" />
                                  ) : (
                                    <ClockIcon className="h-5 w-5 text-[#F0B90B]" />
                                  )}
                                </div>
                                <div className="text-left">
                                  <div className="text-[#EAECEF] font-medium">
                                    { withdrawal.method === 'bkash' ?  withdrawal?.metadata?.originalAmount : withdrawal.amount } {withdrawal.method === 'bkash' ? 'BDT' : 'USDT'}
                                    
                                  </div>
                                  <div className="text-sm text-[#848E9C]">
                                    {new Date(withdrawal.createdAt).toLocaleString()}
                                  </div>
                                </div>
                              </div>
                              <div className={`text-sm ${
                                withdrawal.status === 'approved' ? 'text-[#02C076]' :
                                withdrawal.status === 'failed' ? 'text-[#CD6D6D]' :
                                'text-[#F0B90B]'
                              }`}>
                                {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {selectedWithdrawal && (
        <WithdrawalDetails
          isOpen={!!selectedWithdrawal}
          onClose={() => setSelectedWithdrawal(null)}
          withdrawal={selectedWithdrawal}
        />
      )}
    </>
  );
} 
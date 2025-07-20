 "use client"
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
 

import { 
    XMarkIcon, 
    ArrowLeftIcon,
    ClockIcon,
    CheckCircleIcon,
    XCircleIcon,
  
    InformationCircleIcon
  } from '@heroicons/react/24/outline';
import axios from 'axios';

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

interface WithdrawalDetailsProps {
    isOpen: boolean;
    onClose: () => void;
    withdrawal: WithdrawalRecord;
  }


  async function convertUSDTtoBDT(amount : number) {
     
    const result = 1 * 100

    return result
  }

  
export const WithdrawalDetails = ({ isOpen, onClose, withdrawal }: WithdrawalDetailsProps) => {
  const isCryptoPayment = ['bitget', 'binance'].includes(withdrawal.method);
  const displayAmount = isCryptoPayment ? withdrawal.amount : withdrawal.metadata?.originalAmount;
  const currency = isCryptoPayment ? 'USDT' : 'BDT';

  
   
  const getReceivedAmount = () => {
    const fee = isCryptoPayment ? Number(withdrawal.metadata?.fee) : Number(withdrawal.metadata?.fee) * 100
    return isCryptoPayment ? withdrawal.amount : Number(withdrawal?.metadata?.originalAmount) - fee
  };
      
    return (
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-[60]" onClose={onClose}>
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
                <Dialog.Panel className="w-screen h-screen sm:h-auto sm:w-full sm:max-w-lg transform overflow-hidden bg-[#0B0E11] sm:border sm:border-[#2E353F] sm:rounded-lg transition-all">
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
                        <Dialog.Title as="h3" className="text-xl font-semibold text-white">
                          Withdrawal Details
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
                  <div className="h-[calc(100vh-70px)] sm:h-auto overflow-y-auto p-4 sm:p-6 bg-[#0B0E11] space-y-6">
                    {/* Status Card */}
                    <div className="bg-[#1E2329] rounded-lg p-4 border border-[#2E353F]">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${
                            withdrawal.status === 'approved' ? 'bg-[#02C076]/10' :
                            withdrawal.status === 'failed' ? 'bg-[#CD6D6D]/10' :
                            'bg-[#F0B90B]/10'
                          }`}>
                            {withdrawal.status === 'approved' ? (
                              <CheckCircleIcon className="h-6 w-6 text-[#02C076]" />
                            ) : withdrawal.status === 'failed' ? (
                              <XCircleIcon className="h-6 w-6 text-[#CD6D6D]" />
                            ) : (
                              <ClockIcon className="h-6 w-6 text-[#F0B90B]" />
                            )}
                          </div>
                          <div>
                            <div className="text-[#EAECEF] font-medium">
                              {withdrawal.status === 'approved' ? 'Approved' :
                               withdrawal.status === 'failed' ? 'Failed' :
                               'Processing'}
                            </div>
                            <div className="text-sm text-[#848E9C]">
                              {new Date(withdrawal.createdAt).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[#EAECEF] font-medium">
                            {displayAmount} {currency}
                          </div>
                          {withdrawal.status === 'approved' && (
                            <div className="text-sm text-[#02C076]">
                              Successful
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
  
                    {/* Network Details */}
                    <div className="space-y-4 bg-[#1E2329] rounded-lg p-4 border border-[#2E353F]">
                      <div>
                        <div className="text-sm text-[#848E9C] mb-1">Network</div>
                        <div className="text-white font-medium">{withdrawal.metadata?.network || '-'}</div>
                      </div>
                      <div>
                        <div className="text-sm text-[#848E9C] mb-1">Address</div>
                        <div className="text-white font-mono break-all">{withdrawal.metadata?.address || '-'}</div>
                      </div>
                      {withdrawal.metadata?.txId && (
                        <div>
                          <div className="text-sm text-[#848E9C] mb-1">Transaction ID</div>
                          <div className="text-white font-mono break-all">{withdrawal.metadata.txId}</div>
                        </div>
                      )}
                      
                      {/* Financial Details */}
                      <div className="pt-4 border-t border-[#2E353F] space-y-3">
                        <div className="flex justify-between">
                          <div className="text-sm text-[#848E9C]">Amount</div>
                          <div className="text-white font-medium">{displayAmount} {currency}</div>
                        </div>
                        <div className="flex justify-between">
                          <div className="text-sm text-[#848E9C]">Network Fee</div>
                          <div className="text-white">{ isCryptoPayment ? Number(withdrawal.metadata?.fee) : Number(withdrawal.metadata?.fee) * 100} {currency}</div>
                        </div>
                        <div className="flex justify-between pt-3 border-t border-[#2E353F]">
                          <div className="text-sm text-[#848E9C]">You Will Receive</div>
                          <div className="text-white font-medium">{getReceivedAmount()} {currency}</div>
                        </div>
                      </div>
                    </div>
  
                    {/* Estimated Time Info */}
                    {withdrawal.status === 'pending' && (
                      <div className="bg-[#1E2329] rounded-lg p-4 border border-[#2E353F]">
                        <div className="flex items-start space-x-3">
                          <InformationCircleIcon className="h-5 w-5 text-[#F0B90B] flex-shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <div className="text-sm text-[#EAECEF] font-medium">Estimated Processing Time</div>
                            <div className="text-sm text-[#848E9C] mt-1">
                              Your withdrawal is being processed. This usually takes 5-30 minutes.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    );
  };
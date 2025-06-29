'use client';

import { create } from 'zustand';

type ModalType = 'withdrawal' | 'deposit' | 'history' | 'topEarners' | 'about' | 'liveSupport';

interface ModalsState {
  isWithdrawalModalOpen: boolean;
  isHistoryModalOpen: boolean;
  isTopEarnersModalOpen: boolean;
  isAboutModalOpen: boolean;
  isLiveSupportModalOpen: boolean;
  setIsWithdrawalModalOpen: (isOpen: boolean) => void;
  setIsHistoryModalOpen: (isOpen: boolean) => void;
  setIsTopEarnersModalOpen: (isOpen: boolean) => void;
  setIsAboutModalOpen: (isOpen: boolean) => void;
  setIsLiveSupportModalOpen: (isOpen: boolean) => void;
}

export const useModals = create<ModalsState>((set) => ({
  isWithdrawalModalOpen: false,
  isHistoryModalOpen: false,
  isTopEarnersModalOpen: false,
  isAboutModalOpen: false,
  isLiveSupportModalOpen: false,
  setIsWithdrawalModalOpen: (isOpen) => set({ isWithdrawalModalOpen: isOpen }),
  setIsHistoryModalOpen: (isOpen) => set({ isHistoryModalOpen: isOpen }),
  setIsTopEarnersModalOpen: (isOpen) => set({ isTopEarnersModalOpen: isOpen }),
  setIsAboutModalOpen: (isOpen) => set({ isAboutModalOpen: isOpen }),
  setIsLiveSupportModalOpen: (isOpen) => set({ isLiveSupportModalOpen: isOpen })
})); 
import { useState } from 'react';

export const useModals = () => {
  const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isTopEarnersModalOpen, setIsTopEarnersModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isLiveSupportModalOpen, setIsLiveSupportModalOpen] = useState(false);

  return {
    isWithdrawalModalOpen,
    isHistoryModalOpen,
    isTopEarnersModalOpen,
    isRulesModalOpen, 
    isAboutModalOpen,
    isLiveSupportModalOpen,
    setIsWithdrawalModalOpen,
    setIsHistoryModalOpen,
    setIsTopEarnersModalOpen,
    setIsRulesModalOpen,
    setIsAboutModalOpen,
    setIsLiveSupportModalOpen
  };
}; 
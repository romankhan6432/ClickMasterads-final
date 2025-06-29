import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { XMarkIcon, ChevronDownIcon, ClockIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Image } from 'antd-mobile';
import { toast } from 'react-toastify';
import { withdrawalApi } from '@/modules/public/withdrawal/api';
import { useSelector } from 'react-redux';
import { selectUserBalance } from '@/store/selectors/userSelectors';
import { HistoryOutlined } from '@ant-design/icons';
import WithdrawalHistory from './WithdrawalHistory';

interface PaymentMethod {
  id: string;
  name: string;
  image: string;
  color: string;
  status: 'active' | 'suspended' | 'disabled';
  message?: string;
}

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance?: number;

}

const WithdrawalModal = ({ isOpen, onClose }: WithdrawalModalProps) => {
  const { t } = useTranslation();
  const [selectedMethod, setSelectedMethod] = useState('bkash');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [isMethodsOpen, setIsMethodsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // NEW: for submit button state
 
  // Use Redux selector if prop not provided
  const userBalance = useSelector(selectUserBalance);
  

  useEffect(() => {
    if (isOpen) {
      // Only set bKash as default if it's active
      const activeMethod = paymentMethods.find(m => m.status === 'active');
      setSelectedMethod(activeMethod?.id || '');
      setPhoneNumber('');
      setAmount('');
    }
  }, [isOpen]);

  const withdrawalFee = Number(amount) * 0.1;
  const receiveAmount = Number(amount) - withdrawalFee;

  const USD_TO_BDT_RATE = 100;
  const convertUSDTtoBDT = (usdtAmount: number): number => usdtAmount * USD_TO_BDT_RATE;
  const [ isOpenHistoryModal , setIsOpenHistoryModal ] = useState(false);

  const usdtEquivalent = convertUSDTtoBDT(userBalance);


  const handleMaxClick = () => {
    setAmount(usdtEquivalent.toString());
  };


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'bkash',
      name: 'bKash',
      image: 'https://www.logo.wine/a/logo/BKash/BKash-Icon-Logo.wine.svg',
      color: 'rgb(220, 53, 69)',
      status: 'active',
    },
    {
      id: 'nagad',
      name: 'Nagad',
      image: 'https://download.logo.wine/logo/Nagad/Nagad-Logo.wine.png',
      color: 'rgb(255, 103, 30)',
      status: 'active',
      message: 'Temporarily unavailable due to maintenance',
    },
    {
      id: 'rocket',
      name: 'Rocket',
      image: 'https://images.seeklogo.com/logo-png/31/1/dutch-bangla-rocket-logo-png_seeklogo-317692.png',
      color: 'rgb(82, 43, 131)',
      status: 'active',
      message: 'Service currently not available',
    },
  ];

  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedMethod);

  const getStatusColor = (status: PaymentMethod['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'suspended':
        return 'text-yellow-500';
      case 'disabled':
        return 'text-red-500';
      default:
        return 'text-gray-400';
    }
  };
    


  
  const getStatusText = (status: PaymentMethod['status']) => {
    switch (status) {
      case 'active':
        return t('withdrawal.status.active', 'Active');
      case 'suspended':
        return t('withdrawal.status.suspended', 'Suspended');
      case 'disabled':
        return t('withdrawal.status.disabled', 'Disabled');
      default:
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent double submit
    setIsSubmitting(true);
    try {
      // Show loading toast
      const loadingToast = toast.loading('Processing withdrawal request...');
      // Call the withdrawal API
      const data = {
        method: selectedMethod as 'bkash' | 'nagad',
        amount: Number(amount),
        recipient: phoneNumber.replace(/\s/g, ''), // Remove spaces from phone number
      };
      const result = await withdrawalApi.createWithdrawal(data);
      if(result?.error){
        toast.error(result.error);
        setIsSubmitting(false);
        return;
      }
      // Success! Update the loading toast
      toast.update(loadingToast, {
        render: `Withdrawal request of ${amount} BDT submitted successfully to ${selectedPaymentMethod?.name}!`,
        type: 'success',
        isLoading: false,
        autoClose: 3000,
      });
      // Close the modal
      onClose();
      // Reset form
      setPhoneNumber('');
      setAmount('');
    } catch (error: any) {
      // Show error toast with the server error message if available
      toast.error(error.response?.data?.message || 'Failed to process withdrawal. Please try again.', { autoClose: 3000 });
    } finally {
      setIsSubmitting(false);
    }
  };


  // Format phone number as user types
  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove all non-numeric characters
    value = value.replace(/\D/g, '');

    // Handle Bangladesh number format
    if (value.startsWith('880')) {
      value = value.slice(3); // Remove 880 if user entered it
    }
    if (value.startsWith('0')) {
      value = value.slice(1); // Remove leading 0 if present
    }

    // Ensure it starts with valid BD operator codes
    if (value.length > 0 && !['1', '3', '4', '5', '6', '7', '8', '9'].includes(value[0])) {
      return; // Don't update if doesn't start with valid operator code
    }

    // Limit to 10 digits (operator code + number)
    value = value.slice(0, 10);

    // Format the number for display
    if (value.length > 0) {
      const parts = [
        '880', // Country code
        value.slice(0, 1), // Operator code
        value.slice(1, 5), // Middle part
        value.slice(5) // Last part
      ].filter(Boolean);
      
      value = parts.join(' ');
    }

    setPhoneNumber(value);
  };

  // Validate phone number
  const isValidPhoneNumber = (number: string) => {
    const digits = number.replace(/\D/g, '');
    if (digits.length !== 13) return false;
    if (!digits.startsWith('880')) return false;
    
    // Check if the number starts with valid BD operator codes after 880
    const operatorCode = digits.slice(3, 4);
    const validOperatorCodes = ['1', '3', '4', '5', '6', '7', '8', '9'];
    
    return validOperatorCodes.includes(operatorCode);
  };

  const getPhoneNumberError = (number: string) => {
    if (!number) return '';
    const digits = number.replace(/\D/g, '');
    
    if (!digits.startsWith('880')) {
      return t('withdrawal.invalidPhone.countryCode', 'Number must start with Bangladesh country code (+880)');
    }
    
    const operatorCode = digits.slice(3, 4);
    if (!['1', '3', '4', '5', '6', '7', '8', '9'].includes(operatorCode)) {
      return t('withdrawal.invalidPhone.operatorCode', 'Invalid operator code');
    }
    
    if (digits.length !== 13) {
      return t('withdrawal.invalidPhone.length', 'Phone number must be 10 digits after country code');
    }
    
    return '';
  };

  // Update the payment method selection button to show status
  const renderPaymentMethodButton = (method: PaymentMethod) => {
    const isDisabled = method.status !== 'active';
    return (
      <button
        key={method.id}
        type="button"
        onClick={() => {
          if (!isDisabled) {
            setSelectedMethod(method.id);
            setIsMethodsOpen(false);
          }
        }}
        disabled={isDisabled}
        className={`w-full px-4 py-3 flex items-center justify-between group transition-colors first:rounded-t-lg last:rounded-b-lg ${
          isDisabled 
            ? 'opacity-50 cursor-not-allowed bg-gray-800/30' 
            : 'hover:bg-gray-700/50 cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 relative w-8 h-8">
            <Image
              src={method.image}
              alt={method.name}
              className={`object-contain ${isDisabled ? 'grayscale' : ''}`}
            />
          </div>
          <div className="flex-1 text-left">
            <div className="flex items-center justify-between gap-3">
              <span className={`text-white ${isDisabled ? 'text-gray-400' : ''}`}>
                {method.name}
              </span>
              <span className={`text-xs ${getStatusColor(method.status)}`}>
                {getStatusText(method.status)}
              </span>
            </div>
            {method.status !== 'active' && method.message && (
              <p className="text-xs text-gray-400 mt-0.5">
                {method.message}
              </p>
            )}
          </div>
        </div>
      </button>
    );
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog 
        as="div" 
        className={`relative z-50 ${isMobile ? 'h-screen' : ''}`} 
        onClose={onClose}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-90" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className={`flex min-h-full ${isMobile ? 'items-start' : 'items-center'} justify-center p-0`}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom={isMobile ? "translate-y-full" : "opacity-0 scale-95"}
              enterTo={isMobile ? "translate-y-0" : "opacity-100 scale-100"}
              leave="ease-in duration-200"
              leaveFrom={isMobile ? "translate-y-0" : "opacity-100 scale-100"}
              leaveTo={isMobile ? "translate-y-full" : "opacity-0 scale-95"}
            >
              <Dialog.Panel className={`w-full transform overflow-hidden bg-[#0B0E11] text-left align-middle shadow-xl transition-all ${isMobile ? 'min-h-screen' : 'max-w-md rounded-2xl m-4'} flex flex-col`}>
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
                  <div className="flex items-center gap-4">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white">
                      {t('withdrawal.title', 'Withdraw Funds')}
                    </Dialog.Title>
                  
                  
                     <HistoryOutlined className="p-2 rounded-lg bg-white text-black hover:bg-gray-200 transition-colors cursor-pointer" onClick={() => setIsOpenHistoryModal(true)}/>
                    
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                </div>

                {/* Content or Form */}
                {paymentMethods.every(method => method.status !== 'active') ? (
                  <div className="p-6">
                    <div className="flex flex-col items-center justify-center text-center space-y-4 py-8">
                      <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500" />
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium text-white">
                          {t('withdrawal.disabled.title', 'Withdrawals Temporarily Disabled')}
                        </h3>
                        <p className="text-gray-400 max-w-sm">
                          {t('withdrawal.disabled.message', 'Withdrawals are currently disabled. Please try again later or contact support for assistance.')}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-6">
                    <form id="withdrawForm" onSubmit={handleSubmit} className="space-y-6 pb-28"> {/* Add padding bottom for footer */}
                      <div className="space-y-4">
                        <label className="block text-sm font-medium text-gray-400">
                          {t('withdrawal.selectMethod', 'Payment Method')}
                        </label>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setIsMethodsOpen(!isMethodsOpen)}
                            className={`w-full px-4 py-3 flex items-center justify-between rounded-lg border transition-colors ${
                              selectedMethod 
                                ? 'border-gray-700 hover:border-gray-600 bg-gray-800/50' 
                                : 'border-gray-800 bg-gray-800/30'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {selectedPaymentMethod ? (
                                <>
                                  <div className="relative w-8 h-8">
                                    <Image
                                      src={selectedPaymentMethod.image}
                                      alt={selectedPaymentMethod.name}
                                      className="object-contain"
                                    />
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-white">{selectedPaymentMethod.name}</span>
                                    <span className={`text-xs ${getStatusColor(selectedPaymentMethod.status)}`}>
                                      {getStatusText(selectedPaymentMethod.status)}
                                    </span>
                                  </div>
                                </>
                              ) : (
                                <span className="text-gray-400">Select payment method</span>
                              )}
                            </div>
                            <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                          </button>

                          {/* Dropdown */}
                          {isMethodsOpen && (
                            <div className="absolute z-10 mt-2 w-full rounded-lg border border-gray-700 bg-gray-800 shadow-lg divide-y divide-gray-700">
                              {paymentMethods.map(renderPaymentMethodButton)}
                            </div>
                          )}
                        </div>     
                      </div>

                      <div className="space-y-4">
                        <div className="relative">
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-400">
                              {t('withdrawal.phoneNumber', 'Phone Number')}
                            </label>
                            <span className="text-xs text-gray-400">
                              {t('withdrawal.phoneFormat', 'Format: +880 1XX XXX XXXX')}
                            </span>
                          </div>
                          <div className={`relative rounded-lg border transition-colors ${
                            selectedMethod ? 'border-gray-700 focus-within:border-yellow-500' : 'border-gray-800 bg-gray-800/30'
                          }`}>
                            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                              <span className="text-gray-400">+</span>
                            </div>
                            <input
                              type="tel"
                              value={phoneNumber}
                              onChange={handlePhoneNumberChange}
                              onKeyPress={(e) => {
                                // Allow only numbers
                                if (!/[0-9]/.test(e.key)) {
                                  e.preventDefault();
                                }
                              }}
                              className="w-full pl-7 pr-12 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none disabled:cursor-not-allowed"
                              placeholder={selectedMethod ? "880 1XX XXX XXXX" : "Select payment method first"}
                              required
                              disabled={!selectedMethod}
                            />
                            {selectedPaymentMethod && (
                              <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                <div className="relative w-6 h-6">
                                  <Image
                                    src={selectedPaymentMethod.image}
                                    alt={selectedPaymentMethod.name}
                                    className="object-contain opacity-50"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                          {phoneNumber && getPhoneNumberError(phoneNumber) && (
                            <p className="mt-1 text-xs text-red-500">
                              {getPhoneNumberError(phoneNumber)}
                            </p>
                          )}
                        </div>

                        <div className="relative">
                          <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-gray-400">
                              {t('withdrawal.amount', 'Amount')}
                            </label>
                            <div className="text-sm text-gray-400">
                              {t('withdrawal.available', 'Available')}: <span className="text-white">{usdtEquivalent.toLocaleString()} BDT</span>
                            </div>
                          </div>
                          <div className={`relative rounded-lg border transition-colors ${
                            selectedMethod ? 'border-gray-700 focus-within:border-yellow-500' : 'border-gray-800 bg-gray-800/30'
                          }`}>
                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              value={amount}
                              onChange={(e) => {
                                // Only allow numbers
                                const val = e.target.value.replace(/[^0-9]/g, '');
                                setAmount(val);
                              }}
                              className="w-full px-4 py-3 bg-transparent text-white placeholder-gray-500 focus:outline-none disabled:cursor-not-allowed"
                              placeholder={selectedMethod ? "Enter amount" : "Select payment method first"}
                              min="50"
                              max={userBalance}
                              disabled={!selectedMethod}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-4">
                              {selectedMethod && (
                                <button
                                  type="button"
                                  onClick={handleMaxClick}
                                  className="px-2 py-1 text-xs font-medium text-yellow-500 hover:text-yellow-400 transition-colors"
                                >
                                  MAX
                                </button>
                              )}
                              <span className="text-sm text-gray-400">BDT</span>
                            </div>
                          </div>
                          {amount && (
                            <div className="mt-2 space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">{t('withdrawal.fee', 'Fee')}:</span>
                                <span className="text-red-500">-{withdrawalFee.toLocaleString()} BDT (10%)</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">{t('withdrawal.receive', 'You will receive')}:</span>
                                <span className="text-green-500">{receiveAmount.toLocaleString()} BDT</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-400">{t('withdrawal.usdtEquivalent', 'Equivalent in USDT')}:</span>
                                <span className="text-blue-400">{usdtEquivalent} BDT</span>
                              </div>
                             
                            </div>
                          )}
                        </div>
                        
                      </div>
                      <div className="text-green-500 font-medium my-2">withdraw now off for 30 Day</div>

                    </form>
                  </div>
                )}
 




                {/* Fixed Bottom Footer Buttons */}
                {paymentMethods.some(method => method.status === 'active') && (
                  <div className={`absolute bottom-0 left-0 w-full bg-[#0B0E11] border-t border-gray-800 px-6 py-4 flex gap-4 z-20 ${isMobile ? '' : 'rounded-b-2xl'}`} style={{boxShadow: '0 -2px 16px 0 rgba(0,0,0,0.6)'}}>
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 py-3 rounded-lg bg-gray-800 text-gray-200 hover:bg-gray-700 transition-colors font-medium disabled:opacity-60"
                      disabled={isSubmitting}
                    >    
                      {t('withdrawal.cancel', 'Cancel')}
                    </button>
                    <button
                      type="submit"
                      form="withdrawForm"
                      className="flex-1 py-3 rounded-lg bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition-colors disabled:opacity-60"
                      disabled={
                        isSubmitting ||
                        !selectedMethod ||
                        !amount ||
                        !phoneNumber ||
                        !!getPhoneNumberError(phoneNumber) ||
                        Number(amount) <100 ||
                        Number(amount) > usdtEquivalent
                      }
                    >
                      {isSubmitting ? t('withdrawal.processing', 'Processing...') : t('withdrawal.submit', 'Withdraw')}
                    </button>
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>

        <WithdrawalHistory isOpen={isOpenHistoryModal} onClose={()=> setIsOpenHistoryModal(false)} />
      </Dialog>
    </Transition>
  );
};

  

export default WithdrawalModal; 
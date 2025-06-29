"use client";

import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { toast } from "react-toastify";
import { useSession } from "next-auth/react";
import { IWallet, CryptoBalance } from "../models/Wallet";

import { NetworkType } from "../app/[lang]/types/withdrawal";
import { QRCode, Tooltip } from "antd";
import { CopyOutlined, QrcodeOutlined, ArrowDownOutlined, ArrowUpOutlined, WalletOutlined, DollarOutlined, HistoryOutlined } from '@ant-design/icons';
import Link from 'next/link';

// Move mock data outside component
const mockWallet = {
  _id: "1",
  userId: "user1",
  address: "0x1234567890abcdef",
  balances: [
    { symbol: "BTC", amount: 0.5, usdValue: 25000 },
    { symbol: "ETH", amount: 2.0, usdValue: 4000 },
    { symbol: "USDT", amount: 1000, usdValue: 1000 },
  ],
  totalUsdValue: 30000,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export default function WalletComponent() {
  const [wallet, setWallet] = useState<IWallet | null>(null);
  const [showQRCode, setShowQRCode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();
  const { t } = useTranslation();

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    const timer = setTimeout(() => {
      setWallet(mockWallet as any);
      setIsLoading(false);
    }, 1000);

    // Cleanup timeout on unmount
    return () => clearTimeout(timer);
  }, []); // Empty dependency array since mockWallet is now static

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success(t('wallet.addressCopied', 'Address copied to clipboard'));
  };

  const formatBalance = (balance: CryptoBalance) => {
    return (
      <div key={balance.symbol} className="flex justify-between items-center p-4 bg-gradient-to-r from-[#2B3139] to-[#1E2026] rounded-xl mb-3 border border-[#3B4149]/30 hover:border-[#FCD535]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#FCD535]/5 transform hover:scale-[1.02]">
        <div className="flex items-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1E2026] to-[#0C0D0F] flex items-center justify-center mr-4 shadow-md">
            <span className={`text-xl font-bold ${
              balance.symbol === 'BTC' ? 'text-[#F7931A]' : 
              balance.symbol === 'ETH' ? 'text-[#627EEA]' : 
              balance.symbol === 'USDT' ? 'text-[#26A17B]' : 'text-[#FCD535]'
            }`}>{balance.symbol.charAt(0)}</span>
          </div>
          <div>
            <div className="text-white font-semibold text-lg">{balance.symbol}</div>
            <div className="text-[#A6ADBA] text-sm font-mono">{balance.amount.toFixed(8)}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white font-semibold text-lg">${balance.usdValue.toLocaleString()}</div>
          <div className="text-[#A6ADBA] text-sm">USD Value</div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0C0D0F] p-4 md:p-8">
      <div className="w-full max-w-2xl mx-auto space-y-6">
        {/* Total Balance Card */}
        <div className="bg-gradient-to-br from-[#1E2026] to-[#171A1F] rounded-xl p-6 shadow-xl border border-[#3B4149]/30 hover:border-[#FCD535]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#FCD535]/5">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <DollarOutlined className="text-[#FCD535] mr-2 text-xl" />
              <div className="text-[#A6ADBA] text-sm">Total Balance (USD)</div>
            </div>
            {isLoading ? (
              <div className="h-12 bg-[#2B3139] rounded-lg animate-pulse"></div>
            ) : (
              <div className="text-white text-4xl font-bold bg-gradient-to-r from-[#FCD535] to-[#F0B90B] bg-clip-text   mb-1">
                ${wallet?.totalUsdValue.toLocaleString() || "0.00"}
              </div>
            )}
            <div className="text-[#A6ADBA] text-sm">Last updated: {wallet ? new Date(wallet.updatedAt).toLocaleString() : '-'}</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4">
          <Tooltip title={t('wallet.depositTooltip', 'Add funds to your wallet')}>
            <button className="px-6 py-3 bg-[#FCD535] text-[#0C0D0F] rounded-lg font-medium hover:bg-[#F0B90B] transition-all duration-300 flex items-center transform hover:scale-105 hover:shadow-lg hover:shadow-[#FCD535]/20">
              <ArrowDownOutlined className="mr-2" />
              {t('wallet.deposit', 'Deposit')}
            </button>
          </Tooltip>
          <Tooltip title={t('wallet.withdrawTooltip', 'Withdraw funds from your wallet')}>
            <button className="px-6 py-3 bg-[#2B3139] text-white rounded-lg font-medium border border-[#3B4149] hover:bg-[#3B4149] transition-all duration-300 flex items-center transform hover:scale-105 hover:shadow-lg">
              <ArrowUpOutlined className="mr-2" />
              {t('wallet.withdraw', 'Withdraw')}
            </button>
          </Tooltip>
        </div>

        {/* Assets Section */}
        <div className="bg-gradient-to-br from-[#1E2026] to-[#171A1F] rounded-xl p-6 shadow-xl border border-[#3B4149]/30 hover:border-[#FCD535]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#FCD535]/5">
          <div className="flex items-center justify-between mb-5 border-b border-[#3B4149]/30 pb-3">
            <div className="flex items-center">
              <WalletOutlined className="text-[#FCD535] mr-2 text-xl" />
              <h3 className="text-xl text-white font-medium">Your Assets</h3>
            </div>
            <Link href="/transactions" className="flex items-center text-[#FCD535] hover:text-[#F0B90B] transition-colors">
              <HistoryOutlined className="mr-1" />
              <span className="text-sm">{t('wallet.viewTransactions', 'View Transactions')}</span>
            </Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-20 bg-[#2B3139] rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : wallet?.balances.length ? (
            <div className="space-y-1">
              {wallet.balances.map(formatBalance)}
            </div>
          ) : (
            <div className="text-center py-8 bg-[#2B3139]/30 rounded-lg border border-dashed border-[#3B4149]">
              <div className="text-4xl mb-3">💰</div>
              <div className="text-white font-medium">No assets yet</div>
              <p className="text-[#A6ADBA] text-sm mt-2">Your crypto assets will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
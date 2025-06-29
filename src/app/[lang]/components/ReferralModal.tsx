'use client';

import { RootState } from "@/modules/store";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import crypto from 'crypto';

// Add date formatting helper
const formatDate = (dateString: string | Date | undefined) => {
    if (!dateString) return '-';
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '-';
        return date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    } catch (error) {
        return '-';
    }
};

interface ReferralModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ReferralHistory {
    _id: string;
    fullName: string;
    telegramId: string;
    joinedAt: string;
    totalEarnings: number;
    commission: number;
}

interface UserWithReferral {
    telegramId?: number;
    username?: string;
    referralCount?: number;
    referralEarnings?: number;
    referralCode?: string;
    referralTier?: string;
    referredUsers?: ReferralHistory[];
}

export default function ReferralModal({ isOpen, onClose }: ReferralModalProps) {
    const { user } = useSelector((state: RootState) => state.public.auth);
    const { t } = useTranslation();
    const [copied, setCopied] = useState(false);
    const [activeTab, setActiveTab] = useState<'overview' | 'history'>('overview');
    const referralHistory = user?.referredUsers || [];
    const [isLoading, setIsLoading] = useState(false);

    // Calculate total earnings from referrals
    const totalCommissionEarnings = referralHistory.reduce((total, referral) => total + (referral.commission || 0), 0);

    // Create referral link using the user's referral code
    const referralLink = (user as UserWithReferral)?.referralCode
        ? `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}?startapp=${(user as UserWithReferral).referralCode}`
        : `https://t.me/${process.env.NEXT_PUBLIC_BOT_USERNAME}`;

    // Get tier color based on referral tier
    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'Diamond': return 'from-blue-500 to-cyan-500';
            case 'Platinum': return 'from-purple-500 to-pink-500';
            case 'Gold': return 'from-yellow-500 to-amber-500';
            case 'Silver': return 'from-gray-300 to-gray-400';
            default: return 'from-amber-700 to-yellow-900'; // Bronze
        }
    };

  
    
     const referralBonus = 5; // 5% bonus

    const copyToClipboard = async (text: string, type: 'link' | 'code') => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            toast.success(type === 'link' ? t('referral.linkCopied') : t('referral.codeCopied'));
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            toast.error(type === 'link' ? t('referral.copyFailed') : t('referral.codeCopyFailed'));
        }
    };

    const shareToSocial = (platform: 'telegram' | 'whatsapp' | 'twitter') => {
        let url = '';
        const text = t('referral.shareText', { link: referralLink });
        
        switch (platform) {
            case 'telegram':
                url = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`;
                break;
            case 'whatsapp':
                url = `https://wa.me/?text=${encodeURIComponent(text + ' ' + referralLink)}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralLink)}`;
                break;
        }
        
        if (typeof window !== 'undefined') {
            window.open(url, '_blank');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 bg-gray-900 md:bg-black/50 md:backdrop-blur-sm md:p-4 md:flex md:items-center md:justify-center">
            <div className="relative h-full md:h-auto w-full md:max-w-md md:rounded-2xl md:border md:border-gray-800 bg-gray-900 shadow-xl overflow-hidden">
                {/* Header - Telegram Mini App style */}
                <div className="sticky top-0 z-10 p-4 border-b border-gray-800 bg-gradient-to-r from-blue-500 to-blue-600">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">{t('referral.title')}</h2>
                        <button 
                            onClick={onClose}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-black/20 text-white/80 hover:text-white transition-all hover:bg-black/30 active:scale-95"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Tabs - Telegram Mini App style */}
                <div className="flex border-b border-gray-800">
                    <button 
                        onClick={() => setActiveTab('overview')}
                        className={`flex-1 py-3 text-center font-medium transition-colors ${
                            activeTab === 'overview' 
                                ? 'text-white border-b-2 border-blue-500' 
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        {t('referral.overview')}
                    </button>
                    <button 
                        onClick={() => setActiveTab('history')}
                        className={`flex-1 py-3 text-center font-medium transition-colors ${
                            activeTab === 'history' 
                                ? 'text-white border-b-2 border-blue-500' 
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        {t('referral.history')}
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)] md:max-h-[70vh]">
                    {activeTab === 'overview' ? (
                        <>
                            {/* Referral Stats - Telegram Mini App style */}
                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <div className="text-sm text-gray-400">{t('referral.totalReferrals')}</div>
                                        <div className="text-lg font-bold text-white">
                                            {(user as UserWithReferral)?.referralCount || 0}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-400">{t('referral.totalEarned')}</div>
                                        <div className="text-lg font-bold text-white">
                                            ${((user as UserWithReferral)?.referralEarnings || 0).toFixed(2)}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Referral Tier - Telegram Mini App style */}
                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                <h3 className="text-lg font-semibold text-white mb-3">{t('referral.referralTier')}</h3>
                                <div className="flex items-center gap-4">
                                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${getTierColor((user as UserWithReferral)?.referralTier || 'Bronze')} flex items-center justify-center`}>
                                        <span className="text-2xl">
                                            {(user as UserWithReferral)?.referralTier === 'Diamond' ? '💎' :
                                             (user as UserWithReferral)?.referralTier === 'Platinum' ? '🌟' :
                                             (user as UserWithReferral)?.referralTier === 'Gold' ? '🏆' :
                                             (user as UserWithReferral)?.referralTier === 'Silver' ? '🥈' : '🥉'}
                                        </span>
                                    </div>
                                    <div>
                                        <div className="text-xl font-bold text-white">
                                            {(user as UserWithReferral)?.referralTier || 'Bronze'}
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {t('referral.referralTierDesc', { bonus: referralBonus })}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Referral Code - Telegram Mini App style */}
                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                <h3 className="text-lg font-semibold text-white mb-3">{t('referral.yourCode')}</h3>
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-gray-700/50 text-white px-3 py-2 rounded-lg text-sm font-mono text-center">
                                        {(user as UserWithReferral)?.referralCode}
                                    </div>
                                    <button
                                        onClick={() => copyToClipboard((user as UserWithReferral)?.referralCode || '', 'code')}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all active:scale-95"
                                    >
                                        {copied ? t('referral.copied') : t('referral.copy')}
                                    </button>
                                </div>
                            </div>

                            {/* Referral Link - Telegram Mini App style */}
                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                <h3 className="text-lg font-semibold text-white mb-3">{t('referral.yourLink')}</h3>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={referralLink}
                                        readOnly
                                        className="flex-1 bg-gray-700/50 text-white px-3 py-2 rounded-lg text-sm"
                                    />
                                    <button
                                        onClick={() => copyToClipboard(referralLink, 'link')}
                                        className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all active:scale-95"
                                    >
                                        {copied ? t('referral.copied') : t('referral.copy')}
                                    </button>
                                </div>
                            </div>

                            {/* Share Buttons - Telegram Mini App style */}
                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                <h3 className="text-lg font-semibold text-white mb-3">{t('referral.share')}</h3>
                                <div className="flex justify-center gap-4">
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => shareToSocial('telegram')}
                                        className="w-12 h-12 rounded-full bg-[#0088cc] flex items-center justify-center text-white shadow-lg"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161l-1.97 9.335c-.146.658-.537.818-1.084.51l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.534-.196 1.006.128.832.941z"/>
                                        </svg>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => shareToSocial('whatsapp')}
                                        className="w-12 h-12 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-lg"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm6.508 16.255c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86s.274.072.376-.043c.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.129.332.202.043.073.043.423-.101.828z"/>
                                        </svg>
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => shareToSocial('twitter')}
                                        className="w-12 h-12 rounded-full bg-[#1DA1F2] flex items-center justify-center text-white shadow-lg"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l.01.475c0 4.85-3.692 10.43-10.43 10.43-1.984 0-3.83-.58-5.35-1.574.275.032.542.048.824.048 1.61 0 3.092-.548 4.27-1.47-1.504-.028-2.774-1.02-3.21-2.38.21.036.42.06.645.06.312 0 .614-.042.9-.116-1.53-1.574-.028-2.774-1.704-2.758-3.37v-.042c.464.258.995.42 1.56.43-.922-.616-1.53-1.666-1.53-2.855 0-.63.17-1.22.466-1.74 1.695 2.08 4.23 3.446 7.087 3.59-.06-.252-.09-.516-.09-.783 0-1.9 1.54-3.44 3.44-3.44.99 0 1.885.42 2.513 1.09.784-.154 1.52-.44 2.184-.834-.258.805-.805 1.48-1.518 1.79z"/>
                                        </svg>
                                    </motion.button>
                                </div>
                            </div>

                            {/* How it works - Telegram Mini App style */}
                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                <h3 className="text-lg font-semibold text-white mb-3">{t('referral.howItWorks')}</h3>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">
                                            1
                                        </div>
                                        <div>
                                            <div className="text-sm text-white">{t('referral.step1')}</div>
                                            <div className="text-xs text-gray-400">{t('referral.step1Desc')}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">
                                            2
                                        </div>
                                        <div>
                                            <div className="text-sm text-white">{t('referral.step2')}</div>
                                            <div className="text-xs text-gray-400">{t('referral.step2Desc', { bonus: referralBonus })}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white text-sm flex-shrink-0 mt-1">
                                            3
                                        </div>
                                        <div>
                                            <div className="text-sm text-white">{t('referral.step3')}</div>
                                            <div className="text-xs text-gray-400">{t('referral.step3Desc')}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-4">
                            {/* Total Commission Earnings Card */}
                            <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                                <div className="flex justify-between items-center">
                                    <div className="text-white">
                                        <div className="text-sm text-gray-400">{t('referral.totalCommission')}</div>
                                        <div className="text-xl font-bold">${totalCommissionEarnings.toFixed(2)}</div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm3 1h6v2H7V5zm8 5.5a.5.5 0 01-.5.5h-7a.5.5 0 010-1h7a.5.5 0 01.5.5zM7 12h6v2H7v-2z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="text-center py-8">
                                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                </div>
                            ) : referralHistory.length > 0 ? (
                                referralHistory.map((referral) => (
                                    <motion.div
                                        key={referral._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white">
                                                    {referral.fullName.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <div className="text-white font-medium">{referral.fullName}</div>
                                                    <div className="text-sm text-gray-400">@{referral.telegramId}</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-white font-medium">
                                                    ${(referral.commission || 0).toFixed(2)}
                                                </div>
                                                <div className="text-sm text-gray-400">
                                                    {formatDate(referral.joinedAt)}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 pt-2 border-t border-gray-700/30">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">{t('referral.totalEarned')}:</span>
                                                <span className="text-white">${(referral.totalEarnings || 0).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-400">{t('referral.yourCommission')}:</span>
                                                <span className="text-green-400">${(referral.commission || 0).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-400">
                                    {t('referral.noHistory')}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 
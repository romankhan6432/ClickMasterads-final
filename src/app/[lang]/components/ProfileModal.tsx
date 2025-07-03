'use client';

import { RootState } from "@/modules/store";
import { signOut } from "next-auth/react";

import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";

import { useTranslation } from "react-i18next";
import { User } from "@/modules/public/auth/types";

interface ExtendedUser extends User {
    totalEarnings?: number;
    todayEarnings?: number;
    referralTier?: 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Diamond';
    referralCount?: number;
    referralEarnings?: number;
}

interface Withdrawal {
    _id: string;
    method: 'bkash' | 'nagad' | 'bitget' | 'binance';
    amount: number;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: string;
    currency: 'USDT' | 'BDT';
}

interface ProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
    const { user } = useSelector((state: RootState) => state.public.auth) as { user: ExtendedUser | null };
    const { withdrawalHistory, timing, loading, error } = useSelector((state: RootState) => state.public.withdrawal);
    const achievements : any[] = useSelector((state: RootState) => state.public.achievement.achievements);

    const dispatch = useDispatch();
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (

        
        <div className="fixed inset-0 z-50 bg-gray-900 md:bg-black/50 md:backdrop-blur-sm md:p-4 md:flex md:items-center md:justify-center">
            <div className="relative h-full md:h-auto w-full md:max-w-sm md:rounded-2xl md:border md:border-gray-800 bg-gray-900 shadow-xl overflow-hidden">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white">
                                <span className="text-xl">👤</span>
                            </div>
                            <div>
                                <h2 className="text-lg font-semibold text-white">{ user?.fullName }</h2>
                                <p className="text-sm text-gray-400">ID: { user?.telegramId }</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm text-gray-400">{ t('balance') }</p>
                                <p className="text-lg font-bold text-white">${user?.balance.toFixed(2)}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>



 {/* Logout Button */}
 <div className="mt-4 flex justify-center">
                        <button
                            onClick={() => signOut()}
                            className="py-2 px-3 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors flex items-center justify-center gap-2 font-medium text-lg"
                            style={{ width: '200px' }}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            { t('logout') || "Log Out" }
                        </button>
                    </div>   


                    

                {/* Join Date */}
                {/* Profile Content */}
                <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)] md:max-h-[80vh]">
                   

                    {/* Level and Rank */}
                    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <div className="text-sm text-gray-400">{ t('level') }</div>
                                <div className="text-lg font-bold text-white">Level {user?.level || 1}</div>
                            </div>
                            <div className="text-right">
                                <div className="text-sm text-gray-400">{  t('rank') }</div>
                                <div className="text-lg font-bold text-white">{user?.rank || 'Beginner'}</div>
                            </div>
                        </div>
                        {/* Progress bar */}
                        <div className="h-2 bg-gray-700/50 rounded-full mt-2 overflow-hidden">
                            <div 
                                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500" 
                                style={{ width: `${((user?.adsWatched || 0) % 100)}%` }}
                            />
                        </div>
                        <div className="text-xs text-gray-400 mt-2 text-center">
                            {100 - ((user?.adsWatched || 0) % 100)} ads until next level
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* Total Earnings */}
                        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                            <div className="text-sm text-gray-400 mb-1">{t('totalEarnings')}</div>
                            <div className="text-lg font-bold text-white">
                                ${user?.totalEarnings?.toFixed(2) || '0.00'}
                            </div>
                            <div className="text-xs text-emerald-400 mt-1">
                                ৳{((user?.totalEarnings || 0) * 100).toFixed(2)}
                            </div>
                        </div>

                        {/* Today's Earnings */}
                        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                            <div className="text-sm text-gray-400 mb-1">{t('todayEarnings')}</div>
                            <div className="text-lg font-bold text-white">
                                ${user?.todayEarnings?.toFixed(2) || '0.00'}
                            </div>
                            <div className="text-xs text-emerald-400 mt-1">
                                ৳{((user?.todayEarnings || 0) * 100).toFixed(2)}
                            </div>
                        </div>
                    </div>

                    {/* Referral Stats */}
                    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-lg font-semibold text-white">{t('referral.title')}</h3>
                            <div className={`text-sm px-2 py-1 rounded-full bg-gradient-to-r ${
                                user?.referralTier === 'Diamond' ? 'from-blue-500 to-cyan-500' :
                                user?.referralTier === 'Platinum' ? 'from-purple-500 to-pink-500' :
                                user?.referralTier === 'Gold' ? 'from-yellow-500 to-amber-500' :
                                user?.referralTier === 'Silver' ? 'from-gray-300 to-gray-400' :
                                'from-amber-700 to-yellow-900'
                            }`}>
                                {user?.referralTier || 'Bronze'}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-sm text-gray-400">{t('referral.totalReferrals')}</div>
                                <div className="text-lg font-bold text-white">{user?.referralCount || 0}</div>
                            </div>
                            <div>
                                <div className="text-sm text-gray-400">{t('referral.totalEarned')}</div>
                                <div className="text-lg font-bold text-white">
                                    ${(user?.referralEarnings || 0).toFixed(2)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Achievements */}
                    <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700/50">
                        <h3 className="text-lg font-semibold text-white mb-3">{  t('achievements')}</h3>
                        <div className="space-y-3">
                            {achievements.map((achievement, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                        achievement.completed ? 
                                        'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 
                                        'bg-gray-700/50 text-gray-400'
                                    }`}>
                                        {achievement.completed ? '✓' : '○'}
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium text-white">{achievement.name}</div>
                                        <div className="text-xs text-gray-400">{achievement.description}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="text-center text-sm text-gray-500">
                        {t('joinDate')}: {user?.createdAt}
                    </div>

                   



                    
                </div>
            </div>
        </div>  
    );
}

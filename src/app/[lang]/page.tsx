'use client';

import { useEffect, useState } from 'react';
import { API_CALL, TypeApiPromise } from '@/lib/client';
import TopEarnersModal from './components/TopEarnersModal';

import AboutModal from './components/AboutModal';
import ProfileModal from './components/ProfileModal';
import UserStats from './components/UserStats';
import DailyProgress from './components/DailyProgress';
import BottomNavigation from './components/BottomNavigation';
import MaintenanceModel from '@/components/Maintenance.Model';
import NoticeModal from './components/NoticeModal';

import ReferralModal from './components/ReferralModal';

import { useDispatch, useSelector } from 'react-redux';
import { fetchUserStats, watchAdRequest } from '@/modules/private/user/actions';

import { useModals } from './hooks/useModals';
import { toast } from 'react-toastify';
import { useRouter, useParams } from 'next/navigation'

import LanguageSwitcher from '@/components/LanguageSwitcher';
import DirectLinks from './components/DirectLinks';
import { useTranslation } from 'react-i18next';
import { useSession } from 'next-auth/react';

import { RootState } from '@/modules/store';
import WithdrawalModal from '@/components/WithdrawalModal';
import { loadSettings  } from '@/modules/private/settings'

// Client component
export default function Home() {
    const dispatch = useDispatch()
    const router = useRouter();
    const params = useParams();



///DailyProgress  api/ads/route.ts

    const { t } = useTranslation();
    const { data: session, status } : any = useSession();
    const { user } = useSelector((state : RootState) => state.public.auth)
    const DAILY_AD_LIMIT = 300;





    useEffect(() =>{
        dispatch(loadSettings())
   }, [dispatch])


    if (status === 'unauthenticated') {
        router.push('/auth');
    }
    

 

    // Modal states
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [autoShowAds, setAutoShowAds] = useState(false);
    const [countdown, setCountdown] = useState(5);

    const {
        isWithdrawalModalOpen,
        isTopEarnersModalOpen,
        isAboutModalOpen,
        setIsWithdrawalModalOpen,
        setIsTopEarnersModalOpen,
        setIsAboutModalOpen,
    } = useModals();
    
    const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (autoShowAds && !isLoading) {
            if (Number(user?.adsWatched) >= DAILY_AD_LIMIT) {
                setAutoShowAds(false);
                return;
            }
            if (countdown > 0) {
                timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
            } else {
                const showAd = async () => {
                    try {
                        setIsLoading(true);
                        await window.show_9103912?.();
                        dispatch(watchAdRequest());
                        dispatch(fetchUserStats());
                        setCountdown(5); // Reset countdown after successful ad view
                        setIsLoading(false);
                    } catch (err) {
                        setIsLoading(false);
                        setAutoShowAds(false);
                        console.error('Error watching ad:', err);
                        toast.error(err instanceof Error ? err.message : 'Failed to watch ad');
                    }
                };

                showAd();
            }
        }

        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [autoShowAds, countdown, isLoading, dispatch, user?.adsWatched]);

   


    const handleWatchAd = async () => {
        try {
            setIsLoading(true);
            // Check if the ad script is loaded
            if (typeof window.show_9103912 === 'undefined') {
                throw new Error('Ad system not initialized');
            }

            await window.show_9103912();
            dispatch(watchAdRequest());

        } catch (err) { 
            console.error('Error watching ad:', err);
            toast.error(err instanceof Error ? err.message : 'Failed to watch ad');
        } finally {
            setIsLoading(false);
        }
    };

 
    const maintenanceData = useSelector((state : RootState) => state.private.settings.maintenance )
   
 

   

    

    return (
        <div className="min-h-screen bg-gray-900 text-white">
              <MaintenanceModel   />
              

            {/* Mobile Header with Profile and Language */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800/50 shadow-lg md:hidden">
                <div className="flex items-center justify-between px-4 py-2">
                    {/* Profile Avatar */}
                    <button
                        className="flex items-center gap-2"
                        onClick={() => setIsProfileModalOpen(true)}
                    >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-indigo-500 flex items-center justify-center text-white shadow-md ring-2 ring-purple-400/20">
                            <span className="text-base">👤</span>
                        </div>
                    </button>

                    <LanguageSwitcher />

                </div>
            </header>


            {/* Profile Modal */}
            <ProfileModal
                isOpen={isProfileModalOpen}
                onClose={() => setIsProfileModalOpen(false)}
            />

 
            {/* Referral Modal */}
            <ReferralModal
                isOpen={isReferralModalOpen}
                onClose={() => setIsReferralModalOpen(false)}
            />
            
            {/* Main Content */}
            <main className="container mx-auto px-2 pt-16 pb-20 sm:px-4 sm:py-20 max-w-4xl">
                <div className="bg-gray-800/95 backdrop-blur-md border-0 sm:border sm:border-gray-700 sm:rounded-2xl shadow-xl p-3 sm:p-6 space-y-4 sm:space-y-6">
                    <h1 className="text-2xl sm:text-3xl font-bold text-white rgb-animate py-3 sm:py-4 px-4 sm:px-6 rounded-xl shadow-lg text-center leading-tight">
                        {t('welcome')}
                    </h1>
                    <UserStats />

                    <DailyProgress />

                    {/* Watch Ads Button */}
                    <div className="flex flex-col items-center gap-4">
                        <button
                            onClick={handleWatchAd}
                             disabled={ Number(user?.adsWatched) >= DAILY_AD_LIMIT}
                            className="relative overflow-hidden group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-all duration-300"></div>
                            <div className="flex items-center space-x-2">
                                <span className="text-xl">🎥</span>
                                <span className="text-lg">
                                    {t('navigation.watchAd')}
                                </span>
                            </div>
                        </button>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => {
                                    setAutoShowAds(!autoShowAds);
                                    setCountdown(5);
                                    

                                }}
                                className={`px-4 py-2 rounded-lg font-medium ${autoShowAds
                                    ? 'bg-red-500 hover:bg-red-600'
                                    : 'bg-green-500 hover:bg-green-600'
                                    } transition-colors duration-300`}
                                    disabled={ Number(user?.adsWatched) >= DAILY_AD_LIMIT}
                            >
                                {autoShowAds ? t('navigation.stopAutoAds') : t('navigation.startAutoAds')}
                            </button>
                            {autoShowAds && (
                                <span className="text-sm text-gray-300">
                                    {t('navigation.nextAdIn')} {countdown} {t('navigation.seconds')}
                                </span>
                            )}
                        </div>
                    </div>

                    <DirectLinks   />
                </div>
            </main>
           
            {/* Bottom Navigation */}
            <BottomNavigation
                onWithdraw={() => setIsWithdrawalModalOpen(true)}
                onTopEarners={() => setIsTopEarnersModalOpen(true)}
                onAbout={() => setIsAboutModalOpen(true)}
                onSupport={() => setIsReferralModalOpen(true)}
                onNotice={() => setIsNoticeModalOpen(true)}
            />

            {/* Modals */}
            <TopEarnersModal
                isOpen={isTopEarnersModalOpen}
                onClose={() => setIsTopEarnersModalOpen(false)}

            />
            

            <AboutModal
                isOpen={isAboutModalOpen}
                onClose={() => setIsAboutModalOpen(false)}
                dictionary={{
                    about: 'About ClickMaster',
                    close: 'Close',
                    welcome: 'Welcome to ClickMaster',
                    description: 'Your trusted platform for earning rewards by watching ads',
                    features: 'Features',
                    howItWorks: 'How It Works',
                    support: 'Support',
                    version: 'Version',
                    rules: 'Rules & Guidelines',
                    general: 'General Rules',
                    earnings: 'Earnings',
                    withdrawals: 'Withdrawals',
                    safety: 'Safety & Security'
                }}
            />

            {/* Withdrawal Modal */}
            <WithdrawalModal
                isOpen={isWithdrawalModalOpen}
                onClose={() => setIsWithdrawalModalOpen(false)}
            />
            
            {/* Notice Modal */}
            <NoticeModal
                isOpen={isNoticeModalOpen}
                onClose={() => setIsNoticeModalOpen(false)}
            />

 

        </div>
    );
}

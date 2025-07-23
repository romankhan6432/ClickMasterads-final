'use client';
import { API_CALL } from '@/lib/client';
import { RootState } from '@/modules/store';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

interface TimeUnit {
    value: number;
    label: string;
}

export default function DailyProgress() {
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const { user } = useSelector((state: RootState) => state.public.auth);
    const adsWatched = user?.adsWatched || 0;
    const DAILY_AD_LIMIT = 300;
    const progress = Math.min((adsWatched / DAILY_AD_LIMIT) * 100, 100);
    const { t } = useTranslation();
    const LAST_RESET_KEY = 'lastResetDate';

    const getUtcDateString = () => {
        const now = new Date();
        return now.toISOString().split('T')[0]; // Format: 'YYYY-MM-DD'
    };



    const handleReset = async () => {

        localStorage.setItem(LAST_RESET_KEY, getUtcDateString());
        try {
            const res = await API_CALL({ url: 'reset-daily', method: 'POST' })

            console.log('Reset API response:', res.response?.message);
            toast.success(res.response?.message as string)
            // Optionally, refresh Redux state or UI
            // dispatch(fetchUserData());

        } catch (error) {
            console.error('Error calling reset API:', error);
        }
    };


    const checkAndReset = () => {
        const storedResetDate = localStorage.getItem(LAST_RESET_KEY);
        const currentDate = getUtcDateString();

        if (storedResetDate !== currentDate) {
            const now = new Date();
            const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
            const utcHour = utcNow.getUTCHours();
            console.log(utcHour)






            //  Set target to 12 AM UTC
            
            if (utcHour === 12) {
                // It's 12:00 AM UTC and not reset yet today
                handleReset();
            }
        }
    };

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
            const target = new Date(utcNow);

            target.setUTCHours(12, 0, 0, 0); //
            //  Set target to 12 AM UTC










            if (utcNow.getTime() > target.getTime()) {
                target.setDate(target.getDate() + 1);
            }

            const diff = target.getTime() - utcNow.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setCountdown(prev => {
                if (
                    prev.days === 0 &&
                    prev.hours === 0 &&
                    prev.minutes === 0 &&
                    prev.seconds === 1 &&
                    seconds === 0
                ) {
                    handleReset(); // Trigger API when countdown reaches 0
                }
                return { days, hours, minutes, seconds };
            });
        };

        const interval = setInterval(updateCountdown, 1000);
        updateCountdown();
        checkAndReset(); // Check once on load
        return () => clearInterval(interval);
    }, []);

    const timeUnits: TimeUnit[] = [
        { value: countdown.days, label: 'days' },
        { value: countdown.hours, label: 'hours' },
        { value: countdown.minutes, label: 'minutes' },
        { value: countdown.seconds, label: 'seconds' }
    ];

    return (
        <div className="bg-gray-900/50 rounded-xl p-4">
            <div className="flex justify-between items-center mb-2">
                <div className="text-sm text-gray-400">{t('navigation.dailyProgress')}</div>
                <div className="text-sm text-emerald-400">
                    {adsWatched}/{DAILY_AD_LIMIT} {t('navigation.ads')}
                </div>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
                <div
                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
            <div className="text-center">
                {adsWatched >= DAILY_AD_LIMIT && (
                    <div className="text-red-400 font-bold mb-2 animate-pulse">
                        Daily Limit Reached!
                    </div>
                )}
                <div className="flex justify-center gap-2 mt-5">
                    {timeUnits.map((unit, index) => (
                        <div
                            key={unit.label}
                            className="flex flex-col items-center bg-gray-800/50 rounded-lg p-2 min-w-[60px]"
                        >
                            <div className="text-lg font-bold text-amber-400">
                                {unit.value.toString().padStart(2, '0')}
                            </div>
                            <div className="text-xs text-gray-400">{t('navigation.' + unit.label)}</div>
                        </div>
                    ))}
                </div>
                <div className="text-xs text-gray-400 mt-2">
                    {t('navigation.untilNextReset')}
                </div>
            </div>
        </div>
    );
}

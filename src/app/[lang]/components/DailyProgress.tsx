'use client';
import { RootState } from '@/modules/store';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

interface DailyProgressProps {
    adsWatched: number;
    maxAds?: number;
}

interface TimeUnit {
    value: number;
    label: string;
}

export default function DailyProgress() {
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const { user } = useSelector((state: RootState) => state.public.auth);
    const adsWatched = user?.adsWatched || 0
    const DAILY_AD_LIMIT = 300;
    const progress = Math.min((adsWatched / DAILY_AD_LIMIT) * 100, 100);
    const { t } = useTranslation();

    useEffect(() => {
        const updateCountdown = () => {
            const now = new Date();
            const utcNow = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
            const target = new Date(utcNow);
            target.setUTCHours(17, 0, 0, 0); // Set to 5 PM UTC

            // If current time is past 5 PM UTC, set target to next day
            if (utcNow.getTime() > target.getTime()) {
                target.setDate(target.getDate() + 1);
            }

            const diff = target.getTime() - utcNow.getTime();
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setCountdown({ days, hours, minutes, seconds });
        };

        updateCountdown();
        const interval = setInterval(updateCountdown, 1000); // Update every second
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
                <div className="text-sm text-gray-400">  {t('navigation.dailyProgress')} </div>
                <div className="text-sm text-emerald-400">
                    {adsWatched}/{DAILY_AD_LIMIT}  {t('navigation.ads')}
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
                <div className="flex justify-center gap-2  mt-5">
                    {timeUnits.map((unit, index) => (
                        <div
                            key={unit.label}
                            className="flex flex-col items-center bg-gray-800/50 rounded-lg p-2 min-w-[60px]"
                        >
                            <div className="text-lg font-bold text-amber-400">
                                {unit.value.toString().padStart(2, '0')}
                            </div>
                            <div className="text-xs text-gray-400"> {t('navigation.'+unit.label)}</div>
                            {index < timeUnits.length - 1 && (
                                <div className="absolute -right-1 top-1/2 -translate-y-1/2 text-gray-500">:</div>
                            )}
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

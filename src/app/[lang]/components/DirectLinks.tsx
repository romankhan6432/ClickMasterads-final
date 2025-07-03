'use client';

import { Empty } from "antd";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { RootState } from "@/modules/store";
import { useEffect, useMemo, useCallback, useState, useRef } from "react";
import { fetchDirectLinks, clickLink } from "@/modules/public/directLinks/actions";

interface DirectLink {
    _id: string;
    title: string;
    url: string;
    icon: string;
}

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

// RGB Animation keyframes
const rgbAnimation = `
@keyframes rgbBorder {
    0% { border-color: rgb(255, 0, 0); box-shadow: 0 0 15px rgba(255, 0, 0, 0.5); }
    33% { border-color: rgb(0, 255, 0); box-shadow: 0 0 15px rgba(0, 255, 0, 0.5); }
    66% { border-color: rgb(0, 0, 255); box-shadow: 0 0 15px rgba(0, 0, 255, 0.5); }
    100% { border-color: rgb(255, 0, 0); box-shadow: 0 0 15px rgba(255, 0, 0, 0.5); }
}
@keyframes rgbText {
    0% { color: rgb(255, 0, 0); }
    33% { color: rgb(0, 255, 0); }
    66% { color: rgb(0, 0, 255); }
    100% { color: rgb(255, 0, 0); }
}
.rgb-border-animation {
    animation: rgbBorder 4s linear infinite;
    border: 2px solid;
}
.rgb-text-animation {
    animation: rgbText 4s linear infinite;
}
`;

 

export default function DirectLinks() {
    // State for lockout per link
    const [lockedButtons, setLockedButtons] = useState<{ [id: string]: number }>({});
    const timerRefs = useRef<{ [id: string]: NodeJS.Timeout }>({});
    const links = useSelector((state: RootState) => state.public.directLinks?.items || []);
    const user = useSelector((state: RootState) => state.public.auth.user);
    const telegramInitData = useSelector((state: RootState) => state.public.auth.telegramInitData);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const DAILY_AD_LIMIT = 300;


    
    // Function to generate hash matching backend logic
    function generateHash(id: string, timestamp: number) {
        const secret = 'secret'; // Must match process.env.HASH_SECRET on backend!
        const str = `${id}_${timestamp}_${secret}`;
        return btoa(str).replace(/[^a-zA-Z0-9]/g, '');
    }

    // Memoized click handler for link clicks
    const handleClick = useCallback((link: DirectLink) => {
        if (!user) return;
        if (lockedButtons[link._id]) return; // Already locked
        const now = Date.now();
        const hash = generateHash(link._id, now);
        const payload = {
            id: link._id,
            userId: user._id,
            hash,
            timestamp: now
        };
        dispatch(clickLink(payload));
        window.open(link.url, '_blank');
        // Start lockout
        setLockedButtons(prev => ({ ...prev, [link._id]: 30 }));
    }, [dispatch, user, lockedButtons]);

    // Countdown effect for locked buttons
    useEffect(() => {
        Object.keys(lockedButtons).forEach((id) => {
            if (lockedButtons[id] > 0 && !timerRefs.current[id]) {
                timerRefs.current[id] = setInterval(() => {
                    setLockedButtons(prev => {
                        if (prev[id] > 1) {
                            return { ...prev, [id]: prev[id] - 1 };
                        } else {
                            // Unlock
                            const { [id]: _, ...rest } = prev;
                            clearInterval(timerRefs.current[id]);
                            delete timerRefs.current[id];
                            return rest;
                        }
                    });
                }, 1000);
            }
        });
        // Cleanup on unmount
        return () => {
            Object.values(timerRefs.current).forEach(clearInterval);
            timerRefs.current = {};
        };
    }, [lockedButtons]);

    

    // Add RGB animation styles
    useEffect(() => {
        const style = document.createElement('style');
        style.textContent = rgbAnimation;
        document.head.appendChild(style);
     
        return () => {
            document.head.removeChild(style);
        };

    }, [  ]);

    useEffect(() => {
        dispatch(fetchDirectLinks());
    }, [ dispatch ]);



    const linkButtons = useMemo(() => {
        const dailyLimitReached = Number(user?.adsWatched) >= DAILY_AD_LIMIT;
        return links.map(link => {
            const isLocked = lockedButtons[link._id] !== undefined;
            const countdown = lockedButtons[link._id];
            return (
                <motion.button
                    key={link._id}
                    variants={item}
                    onClick={() => handleClick(link)}
                    className={`group relative flex items-center justify-center w-full h-16 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${(isLocked || dailyLimitReached) ? 'opacity-60 cursor-not-allowed' : ''}`}
                    style={{
                        background: `linear-gradient(to right, var(--tw-gradient-from- , var(--tw-gradient-to- ))`
                    }}
                    disabled={isLocked || dailyLimitReached}
                >
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    <div className="flex items-center space-x-2 relative z-10">
                        <span className={`text-2xl`}>
                            {link.icon}
                        </span>
                        <span className="text-sm sm:text-base font-bold text-white group-hover:text-opacity-90">
                            {isLocked ? `Locked: ${countdown}s` : dailyLimitReached ? 'Daily Limit Reached' : link.title}
                        </span>
                    </div>
                </motion.button>
            );
        });
    }, [links, handleClick, lockedButtons, user?.adsWatched]);

 
    return (
        <div className="w-full max-w-4xl mx-auto mb-6 p-6 bg-gradient-to-r from-red-900/50 to-pink-900/50 rounded-2xl border border-red-500/20 backdrop-blur-sm shadow-xl">
            <div className="flex flex-col items-center space-y-4">
                <div className="text-center space-y-2 mb-4">
                    <h3 className="text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-pink-400">
                        {t('navigation.watchAds.age')}
                    </h3>
                    <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                        {t('navigation.watchAds.description')}
                    </p>
                </div>
 

                {links.length === 0 ? (
                    <div className="w-full py-8">
                        <Empty
                            description={
                                <span className="text-gray-400">{t('navigation.watchAds.noLinks')}</span>
                            }
                            className="text-gray-400"
                        />
                    </div>
                ) : (
                    <motion.div
                        variants={container}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 w-full my-6"
                    >
                        {linkButtons}
                    </motion.div>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="w-full max-w-lg mx-auto"
                >
                    <p className="text-white py-4 px-6 rounded-xl shadow-lg bg-gradient-to-r from-amber-600 to-orange-800 text-sm sm:text-base text-center font-medium">
                        {t('navigation.watchAds.title')}
                    </p>
                </motion.div>

             
            </div>
        </div>
    );
}

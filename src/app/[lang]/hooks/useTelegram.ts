import { useDispatch, useSelector } from 'react-redux';
 
import { useEffect } from 'react';
import { RootState } from '@/modules/store';
 

interface TelegramUser {
    id: number;
    username?: string;
    first_name?: string;
    last_name?: string;
}

export const useTelegram = () => {
    const dispatch = useDispatch();
    const {   error } = useSelector((state: RootState) => state.private.user);

    const setUser = (telegramUser: TelegramUser) => {
       // dispatch(setTelegramUser(telegramUser));
    };

    const clearUser = () => {
        //dispatch(clearTelegramUser());
    };

    const setError = (errorMessage: string) => {
        //dispatch(setTelegramError(errorMessage));
    };

    useEffect(() => {
        const isTelegramMiniApp = window.Telegram?.WebApp;

        if (isTelegramMiniApp) {
            const tgUser = window.Telegram.WebApp.initDataUnsafe.user;
            if (tgUser) {
                /* dispatch(setTelegramUser({
                    id: tgUser.id,
                    username: tgUser.username,
                    first_name: tgUser.first_name,
                    last_name: tgUser.last_name
                })); */
                return;
            }
        }
        //setUser({ username: 'demo', 'id': 709148502 })
    }, [])


    return {
         
        error,
        setUser,
        clearUser,
        setError,
       /*  isTelegramUser: !!user */
    };
};
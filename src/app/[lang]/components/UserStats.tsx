'use client';

import { Tooltip } from 'antd';
import { 
    DollarCircleOutlined, 
    PlayCircleOutlined, 
    ClockCircleOutlined 
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { RootState } from '@/modules/store';
import { useTranslation } from 'react-i18next';

export default function UserStats() {
    const {  loading , user } =  useSelector((state : RootState) => state.public.auth);
    
     const { t } = useTranslation();

    if (loading) {
        return (
            <div className="grid grid-cols-2 gap-4 mb-6 animate-pulse">
                <div className="text-center space-y-2">
                    <div className="h-8 bg-gray-700/50 rounded"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-2/3 mx-auto"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-1/2 mx-auto"></div>
                </div>
                <div className="text-center space-y-2">
                    <div className="h-8 bg-gray-700/50 rounded"></div>
                    <div className="h-4 bg-gray-700/50 rounded w-2/3 mx-auto"></div>
                </div>
            </div>
        );
    }

    

    return (
        <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-gray-800/70 hover:scale-[1.02] cursor-help">
                <Tooltip title={t('navigation.balance')} placement="top">
                    <div className="text-center space-y-2">
                        <div className="flex items-center justify-center text-yellow-400 mb-1">
                            <DollarCircleOutlined className="text-xl mr-2" />
                            <span className="text-2xl font-bold animate-pulse">
                                ${ user?.balance.toFixed(4)}
                            </span>
                        </div>
                        <div className="text-sm text-gray-400">{t('navigation.available.balance')}</div>
                        <div className="text-sm text-emerald-400">
                            ৳{Number ( (user?.balance || 0) * 100).toFixed(4)}
                        </div>
                         
                    </div>
                </Tooltip>
            </div>

            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 transition-all duration-300 hover:bg-gray-800/70 hover:scale-[1.02] cursor-help">
                <Tooltip title="Number of ads you've watched today" placement="top">
                    <div className="text-center space-y-2">
                        <div className="flex items-center justify-center text-emerald-400 mb-1">
                            <PlayCircleOutlined className="text-xl mr-2" />
                            <span className="text-2xl font-bold">
                                {  user?.adsWatched || 0}
                            </span>
                        </div>
                        <div className="text-sm text-gray-400"> {t('navigation.ads')}</div>
                       
                    </div>
                </Tooltip>
            </div>
        </div>
    );
}

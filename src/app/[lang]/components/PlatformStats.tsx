'use client';

interface PlatformStatsProps {
    totalUsers: number;
    activeUsers: number;
    newUsersToday: number;
    inactiveUsers: number;
}

export default function PlatformStats({ 
    totalUsers, 
    activeUsers, 
    newUsersToday, 
    inactiveUsers 
}: PlatformStatsProps) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-900/50 rounded-xl p-3">
                <div className="text-lg font-bold text-violet-400">{totalUsers}</div>
                <div className="text-xs text-gray-400">Total Users</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-3">
                <div className="text-lg font-bold text-emerald-400">{activeUsers}</div>
                <div className="text-xs text-gray-400">Active Users</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-3">
                <div className="text-lg font-bold text-yellow-400">{newUsersToday}</div>
                <div className="text-xs text-gray-400">New Today</div>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-3">
                <div className="text-lg font-bold text-red-400">{inactiveUsers}</div>
                <div className="text-xs text-gray-400">Inactive</div>
            </div>
        </div>
    );
}

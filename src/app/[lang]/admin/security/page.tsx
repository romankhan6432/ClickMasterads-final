'use client';

import React from 'react';
 
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import SecurityHistoryPanel from '../../components/SecurityHistoryPanel';

const AdminSecurityPage = () => {
    const { data: session, status } : any= useSession();
    const router = useRouter();

    // Check if user is authenticated and is an admin
    React.useEffect(() => {
        if (status === 'loading') return;
        
        if (!session?.user || session.user.role !== 'admin') {
           /// router.push('/');
        }
    }, [session, status, router]);

    /* if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
            </div>
        );
    } */

   /*  if (!session?.user || session.user.role !== 'admin') {
        return null;
    } */
 
    return (
        <div className="min-h-screen bg-gray-900">
            <nav className="bg-gray-800 border-b border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <a href="/admin" className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                                        Overview
                                    </a>
                                    <a href="/admin/security" className="bg-gray-900 text-white px-3 py-2 rounded-md text-sm font-medium">
                                        Security
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-300 text-sm mr-4">
                                {session?.user?.email}
                            </span>
                        </div>
                    </div>
                </div>
            </nav>

            <main>
                <SecurityHistoryPanel />
            </main>
        </div>
    );
};

export default AdminSecurityPage;

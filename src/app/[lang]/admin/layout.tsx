'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import {
  DashboardOutlined,
  UserOutlined,
  WalletOutlined,
  CreditCardOutlined,
  BellOutlined,
  SettingOutlined,
  HistoryOutlined,
  AppstoreOutlined,
  LinkOutlined,
  NotificationOutlined,
} from '@ant-design/icons';
import { useSession } from "next-auth/react"
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: 'Users'
    },
    {
      key: '/admin/withdrawals',
      icon: <WalletOutlined />,
      label: 'Withdrawals'
    },
    {
      key: '/admin/payment-methods',
      icon: <CreditCardOutlined />,
      label: 'Payment Methods'
    },
    {
      key: '/admin/notifications',
      icon: <BellOutlined />,
      label: 'Notifications'
    },
    {
      key: '/admin/notices',
      icon: <NotificationOutlined />,
      label: 'Notices'
    },
    {
      key: '/admin/wallet',
      icon: <WalletOutlined />,
      label: 'Hot Wallet'
    },
    {
      key: '/admin/ads-config',
      icon: <AppstoreOutlined />,
      label: 'Ads Config'
    },
    {
      key: '/admin/direct-link',
      icon: <LinkOutlined />,
      label: 'Direct Links'
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: 'Settings'
    }
  ];

  const { data: session, status } = useSession()
 
   
  
  return (
    <div className='bg-[#0B1120]  ' >
      <div className="min-h-screen">
        <div className="min-h-screen text-gray-100 flex ">
        <aside className="fixed inset-y-0 left-0 bg-gray-900 w-64 border-r border-gray-700 shadow-lg transition-colors duration-300">
            <nav className="mt-8 px-4">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => router.push(item.key)}
                  className={`w-full flex items-center px-4 py-3 mb-2 rounded-xl text-left transition-all duration-300 ease-in-out
                    ${pathname === item.key
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-300 hover:bg-gray-800'}`}
                >
                  <span className={`text-xl mr-4 ${pathname === item.key ? 'text-white' : 'text-blue-400'}`}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </button>
              ))}
            </nav>
          </aside>

          <main className="ml-[8%] w-full bg-[#0B1120]">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}

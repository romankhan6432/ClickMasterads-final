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
import { Layout, Menu } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, MenuOutlined } from '@ant-design/icons';
import { useState } from 'react';

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
  const [collapsed, setCollapsed] = useState(false);
   
  
  return (
    <div className='bg-[#0B1120]'>
      <div className="min-h-screen">
        <Layout style={{ minHeight: '100vh' }}>
          {/* Top navigation bar with hamburger button */}
          <div className="w-full flex items-center h-14 px-4 bg-[#111827] border-b border-gray-800 sticky top-0 z-40">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-300 hover:text-white bg-gray-800 p-2 rounded-md shadow-md focus:outline-none"
              aria-label="Toggle menu"
            >




              <MenuOutlined style={{ fontSize: 24, color: 'rgb(12, 243, 12)' }} />
            </button>
            <span className="ml-4 text-xl font-bold" style={{ color: 'rgb(0, 123, 255)' }}>Admin Panel</span>
          </div>
          <div className="flex">
            {/* Fixed Sider */}
            <div
              style={{
                position: 'fixed',
                top: '56px', // height of the top nav bar (h-14 = 56px)
                left: 0,
                height: 'calc(100vh - 56px)',
                zIndex: 30,
                width: collapsed ? 0 : 220,
                transition: 'width 0.2s',
                overflow: 'hidden',
                background: '#111827',
                borderRight: '1px solid #374151',
                display: collapsed ? 'none' : 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                overflowY: 'auto',
              }}
            >
              <div style={{ width: 220 }}>
                <div className="flex items-center justify-between px-4 py-3">
                  <span className={`text-lg font-bold text-white transition-all duration-300 ${collapsed ? 'hidden' : ''}`}>Admin</span>
                </div>
                <Menu
                  theme="dark"
                  mode="inline"
                  selectedKeys={[pathname]}
                  style={{ background: '#111827', border: 'none' }}
                  items={menuItems.map(item => ({
                    key: item.key,
                    icon: item.icon,
                    label: item.label,
                    onClick: () => router.push(item.key),
                  }))}
                />
              </div>
            </div>
            {/* Main Content with left margin for Sider */}
            <div style={{ marginLeft: collapsed ? 0 : 220, width: '100%' }}>
              <main className="p-4 md:p-8">
                {children}
              </main>
            </div>
          </div>
        </Layout>
      </div>
    </div>
  );
}

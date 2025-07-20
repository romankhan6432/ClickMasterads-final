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
  RedoOutlined,
} from '@ant-design/icons';
import { useSession } from "next-auth/react"
import { Layout, Menu } from 'antd';
import { MenuUnfoldOutlined, MenuFoldOutlined, MenuOutlined } from '@ant-design/icons';
import { useState, useEffect, useRef } from 'react';

// Add CSS for mobile viewport handling
const mobileStyles = `
  @media (max-width: 768px) {
    .admin-layout-container {
      height: 100vh;
      height: 100dvh;
      overflow: hidden;
    }
    
    .admin-sidebar {
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
    }
    
    .admin-main-content {
      -webkit-overflow-scrolling: touch;
      scroll-behavior: smooth;
    }
  }
  
  @supports (height: 100dvh) {
    .admin-layout-container {
      height: 100dvh;
    }
  }
`;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [viewportHeight, setViewportHeight] = useState('100vh');

  // Inject mobile styles
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.textContent = mobileStyles;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Check if device is mobile and handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      const tablet = window.innerWidth >= 768 && window.innerWidth < 1024;
      
      setIsMobile(mobile);
      setIsTablet(tablet);
      
      // Auto-collapse sidebar on mobile and tablet
      if (mobile) {
        setCollapsed(true);
      }
      
      // On larger screens, keep sidebar open by default
      if (window.innerWidth >= 1024 && !mobile) {
        setCollapsed(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle viewport height for mobile browsers (address bar)
  useEffect(() => {
    const updateViewportHeight = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
      setViewportHeight(`${window.innerHeight}px`);
    };

    updateViewportHeight();
    window.addEventListener('resize', updateViewportHeight);
    window.addEventListener('orientationchange', updateViewportHeight);
    
    // Handle mobile browser address bar behavior
    if (isMobile) {
      let timeoutId: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(updateViewportHeight, 100);
      };
      
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('resize', updateViewportHeight);
        window.removeEventListener('orientationchange', updateViewportHeight);
        clearTimeout(timeoutId);
      };
    }
    
    return () => {
      window.removeEventListener('resize', updateViewportHeight);
      window.removeEventListener('orientationchange', updateViewportHeight);
    };
  }, [isMobile]);

  // Handle scroll indicators
  useEffect(() => {
    const handleScroll = () => {
      if (sidebarRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = sidebarRef.current;
        setCanScrollUp(scrollTop > 0);
        setCanScrollDown(scrollTop < scrollHeight - clientHeight - 1);
      }
    };

    const sidebar = sidebarRef.current;
    if (sidebar) {
      sidebar.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
    }

    return () => {
      if (sidebar) {
        sidebar.removeEventListener('scroll', handleScroll);
      }
    };
  }, [collapsed]);

  // Auto-scroll to selected item when sidebar opens
  useEffect(() => {
    if (!collapsed && sidebarRef.current) {
      const selectedItem = sidebarRef.current.querySelector('.ant-menu-item-selected') as HTMLElement;
      if (selectedItem) {
        setTimeout(() => {
          selectedItem.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 300); // Wait for sidebar animation to complete
      }
    }
  }, [collapsed, pathname]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!collapsed && sidebarRef.current) {
        switch (e.key) {
          case 'Home':
            e.preventDefault();
            scrollToTop();
            break;
          case 'End':
            e.preventDefault();
            scrollToBottom();
            break;
          case 'PageUp':
            e.preventDefault();
            scrollByAmount(-200);
            break;
          case 'PageDown':
            e.preventDefault();
            scrollByAmount(200);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [collapsed]);

  // Handle menu item click - navigate without auto-closing sidebar
  const handleMenuClick = (key: string) => {
    router.push(key);
    // Only auto-close on mobile when clicking menu items
    if (isMobile) {
      setCollapsed(true);
    }
    // On desktop/tablet, keep sidebar open after navigation
  };

  // Scroll functions
  const scrollToTop = () => {
    if (sidebarRef.current) {
      setIsScrolling(true);
      sidebarRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      setTimeout(() => setIsScrolling(false), 500);
    }
  };

  const scrollToBottom = () => {
    if (sidebarRef.current) {
      setIsScrolling(true);
      sidebarRef.current.scrollTo({
        top: sidebarRef.current.scrollHeight,
        behavior: 'smooth'
      });
      setTimeout(() => setIsScrolling(false), 500);
    }
  };

  const scrollByAmount = (amount: number) => {
    if (sidebarRef.current) {
      setIsScrolling(true);
      sidebarRef.current.scrollBy({
        top: amount,
        behavior: 'smooth'
      });
      setTimeout(() => setIsScrolling(false), 500);
    }
  };

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
    <div 
      className='relative overflow-hidden admin-layout-container'
      style={{ 
        height: viewportHeight,
        minHeight: '100vh'
      }}
    >
      {/* Content overlay */}
      <div 
        className="relative z-10 bg-[#0B1120]/80 backdrop-blur-sm"
        style={{ 
          height: viewportHeight,
          minHeight: '100vh'
        }}
      >
        <Layout style={{ 
          height: viewportHeight,
          minHeight: '100vh'
        }}>
          {/* Top navigation bar with hamburger button and refresh */}
          <div className="w-full flex items-center justify-between h-14 px-4 bg-[#111827] border-b border-gray-800 sticky top-0 z-40">
            <div className="flex items-center">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="text-gray-300 hover:text-white bg-gray-800 p-2 rounded-md shadow-md focus:outline-none transition-all duration-200 hover:bg-gray-700 hover:scale-105 active:scale-95"
                aria-label="Toggle sidebar"
                title={collapsed ? "Show sidebar" : "Hide sidebar"}
              >
                {collapsed ? (
                  <MenuOutlined style={{ fontSize: 20, color: 'rgb(12, 243, 12)' }} className="transition-transform duration-200" />
                ) : (
                  <MenuFoldOutlined style={{ fontSize: 20, color: 'rgb(12, 243, 12)' }} className="transition-transform duration-200" />
                )}
              </button>
              <div className="ml-4">
                <span className="text-lg sm:text-xl font-bold" style={{ color: 'rgb(0, 123, 255)' }}>Admin Panel</span>
                <div className="text-xs text-gray-400 mt-1">
                 
                </div>
              </div>
            </div>
            
            {/* Refresh button on the right */}
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 px-3 py-2 bg-[#2563eb] hover:bg-[#3b82f6] text-white rounded-lg font-semibold shadow transition-all duration-200 border border-[#2563eb] text-sm"
              aria-label="Refresh page"
            >
              <RedoOutlined style={{ fontSize: 16 }} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
          
          <div className="flex flex-1 overflow-hidden">
            {/* Fixed Sider - Responsive behavior */}
            <div
              className={`fixed top-14 left-0 transition-all duration-300 ease-in-out z-30 bg-[#111827] border-r border-gray-700 overflow-hidden ${
                collapsed 
                  ? '-translate-x-full' 
                  : 'translate-x-0'
              } w-64 md:w-72 lg:w-80`}
              style={{
                height: `calc(${viewportHeight} - 56px)`,
                minHeight: 'calc(100vh - 56px)',
                boxShadow: collapsed ? 'none' : '2px 0 8px rgba(0, 0, 0, 0.3)',
              }}
              ref={sidebarRef}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 flex-shrink-0">
                  <span className="text-lg items-center font-bold text-lime-600">Nur Islam Roman</span>
                  <div className="flex items-center gap-1">
                    {/* Scroll navigation buttons */}
                    {!isMobile && (
                      <>
                        <button
                          onClick={scrollToTop}
                          disabled={!canScrollUp}
                          className={`p-1 rounded transition-colors duration-200 ${
                            canScrollUp 
                              ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                              : 'text-gray-600 cursor-not-allowed'
                          }`}
                          title="Scroll to top"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </button>
                        <button
                          onClick={scrollToBottom}
                          disabled={!canScrollDown}
                          className={`p-1 rounded transition-colors duration-200 ${
                            canScrollDown 
                              ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                              : 'text-gray-600 cursor-not-allowed'
                          }`}
                          title="Scroll to bottom"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => setCollapsed(true)}
                      className="text-gray-400 hover:text-white p-1 rounded transition-colors duration-200 lg:hidden"
                      aria-label="Close menu"
                    >
                      <MenuFoldOutlined style={{ fontSize: 16 }} />
                    </button>
                  </div>
                </div>
                <div className={`flex-1 overflow-y-auto admin-sidebar scroll-smooth ${
                  canScrollUp ? 'can-scroll-up' : ''
                } ${canScrollDown ? 'can-scroll-down' : ''} ${
                  isScrolling ? 'scrolling' : ''
                }`}>
                  <div className="py-2">
                    <Menu
                      theme="dark"
                      mode="inline"
                      selectedKeys={[pathname]}
                      style={{ 
                        background: '#111827', 
                        border: 'none',
                        fontSize: '14px'
                      }}
                      items={menuItems.map(item => ({
                        key: item.key,
                        icon: item.icon,
                        label: item.label,
                        onClick: () => handleMenuClick(item.key),
                        style: {
                          margin: '2px 8px',
                          borderRadius: '8px',
                          transition: 'all 0.2s ease'
                        }
                      }))}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            {/* Overlay for mobile - shows when sidebar is open */}
            {!collapsed && (isMobile || isTablet) && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-20"
                onClick={() => setCollapsed(true)}
                style={{ 
                  top: '56px', 
                  height: `calc(${viewportHeight} - 56px)`,
                  minHeight: 'calc(100vh - 56px)'
                }}
              />
            )}
            
            {/* Main Content - responsive margin */}
            <div 
              className={`transition-all duration-300 ease-in-out flex-1 overflow-hidden ${
                !collapsed && !isMobile && !isTablet
                  ? 'ml-64 md:ml-72 lg:ml-80' 
                  : 'ml-0'
              }`}
            >
            
              
              <main 
                className="p-4 md:p-6 lg:p-8 overflow-y-auto admin-main-content"
                style={{
                  height: `calc(${viewportHeight} - 56px - 60px)`, // Subtract header and page header
                  minHeight: 'calc(100vh - 56px - 60px)'
                }}
              >
                {children}
              </main>
            </div>
          </div>
        </Layout>
      </div>
    </div>
  );
}

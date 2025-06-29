'use client';

import { useEffect, useRef } from 'react';

interface Tab {
  key: string;
  label: React.ReactNode;
  children: React.ReactNode;
}

interface TabsProps {
  items: Tab[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
}

export default function Tabs({ items, activeKey, onChange, className = '' }: TabsProps) {
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeTabRef.current && tabsRef.current) {
      const tabsRect = tabsRef.current.getBoundingClientRect();
      const activeTabRect = activeTabRef.current.getBoundingClientRect();
      const scrollLeft = activeTabRect.left - tabsRect.left + tabsRef.current.scrollLeft - 16;
      tabsRef.current.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    }
  }, [activeKey]);

  return (
    <div className={className}>
      <div className="relative">
        <div 
          ref={tabsRef}
          className="flex space-x-2 border-b border-gray-700/50 mb-6 overflow-x-auto scrollbar-none scroll-smooth pb-1"
        >
          {items.map((tab) => (
            <button
              key={tab.key}
              ref={tab.key === activeKey ? activeTabRef : null}
              onClick={() => onChange(tab.key)}
              className={`group px-6 py-3 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out whitespace-nowrap
                ${activeKey === tab.key
                  ? 'text-white bg-gray-800/80 shadow-lg shadow-gray-900/20'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-900
              `}
            >
              <div className="relative">
                {tab.label}
                <div className={`absolute -bottom-4 left-0 right-0 h-0.5 transition-all duration-300 transform origin-left
                  ${activeKey === tab.key ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'}
                `}>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-400 rounded-full glow-tab" />
                </div>
              </div>
            </button>
          ))}
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none" />
      </div>
      <div className="mt-6">
        {items.map((tab) => (
          <div
            key={tab.key}
            className={`transition-all duration-300 ease-in-out transform perspective-1000
              ${activeKey === tab.key
                ? 'opacity-100 translate-y-0 rotate-x-0'
                : 'opacity-0 -translate-y-4 rotate-x-10 hidden'
              }
            `}
          >
            {tab.children}
          </div>
        ))}
      </div>
    </div>
  );
} 
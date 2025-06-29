'use client';

import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

import { useState, useEffect, useRef } from 'react';

const getFlagEmoji = (locale: string) => {
  const flags: { [key: string]: string } = {
    en: '🇺🇸',
    bn: '🇧🇩',
    hi: '🇮🇳',
    es: '🇪🇸'
  };
  return flags[locale] || '🌐';
};

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (locale: string) => {
    // Get the current path without the locale prefix
    const pathWithoutLocale = pathname.split('/').slice(2).join('/');
    // Navigate to the new locale path
    router.push(`/${locale}/${pathWithoutLocale}`);
    setIsOpen(false);
  };

  const currentLocale = pathname.split('/')[1] || 'en';

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-[#162036] text-white rounded-lg hover:bg-[#1E2A45] transition-all duration-200 border border-[#1B2B4B] shadow-sm"
      >
        <span className="text-xl">{getFlagEmoji(currentLocale)}</span>
        <span className="font-medium">{currentLocale.toUpperCase()}</span>
        <span className="ml-1">
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span> 
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg bg-[#162036] border border-[#1B2B4B] ring-1 ring-black ring-opacity-5 transform opacity-100 scale-100 transition-all duration-200 z-50">
          <div className="py-1" role="menu" aria-orientation="vertical">
            {['en', 'bn', 'hi', 'es'].map((locale) => (
              <button
                key={locale}
                onClick={() => handleLanguageChange(locale)}
                className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#1E2A45] transition-all duration-200 ${currentLocale === locale ? 'bg-[#1E2A45] text-white' : 'text-gray-300'}`}
                role="menuitem"
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getFlagEmoji(locale)}</span>
                  <span className="font-medium">{locale === 'en' ? 'English' :
                    locale === 'bn' ? 'Bengali' :
                      locale === 'hi' ? 'Hindi' :
                        locale === 'es' ? 'Spanish' : locale.toUpperCase()}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

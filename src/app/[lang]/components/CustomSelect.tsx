'use client';

import { useState } from 'react';
import { styles } from '../styles/withdrawal';

interface SelectOption {
  value: string;
  label: string | React.ReactNode;
  icon?: string;
  description?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function CustomSelect({ options, value, onChange, disabled, className, style }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className="relative" style={style}>
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full text-left ${styles.sectionBg} border rounded-lg p-3 ${styles.text.primary} focus:outline-none focus:border-[#F0B90B] transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-[#F0B90B]/50'} ${className}`}
      >
        {selectedOption?.label}
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''} ${styles.text.secondary}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      
      {isOpen && !disabled && (
        <div className={`absolute z-50 w-full mt-1 ${styles.sectionBg} border rounded-lg shadow-lg max-h-60 overflow-auto`}>
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`w-full text-left p-3 hover:bg-[#2B3139] transition-colors ${value === option.value ? 'bg-[#2B3139]' : ''} ${styles.text.primary}`}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

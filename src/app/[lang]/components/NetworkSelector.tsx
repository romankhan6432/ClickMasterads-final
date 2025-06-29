'use client';

import { useState, useEffect, useRef } from 'react';

interface Network {
    id: string;
    name: string;
    icon: string;
    disabled?: boolean;
}

interface NetworkSelectorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
}

const networks: Network[] = [
    {
        id: 'bitget',
        name: 'Bitget USDT',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24">
            <circle cx="16" cy="16" r="16" fill="#F8D12F"/>
            <path d="M23.5 16.5h-4.14l-3.3 3.3-3.31-3.3H8.5v4.18l3.3 3.3-3.3 3.31v4.14h4.18l3.3-3.3 3.31 3.3h4.14v-4.18l-3.3-3.3 3.3-3.31z" fill="#1D2127"/>
        </svg>`
    },
    {
        id: 'binance',
        name: 'Binance USDT (BEP20)',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24">
            <circle cx="16" cy="16" r="16" fill="#F3BA2F"/>
            <path d="M12.116 14.404L16 10.52l3.886 3.886 2.26-2.26L16 6l-6.144 6.144 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.116 1.596L16 21.48l3.886-3.886 2.26 2.259L16 26l-6.144-6.144-.003-.003 2.263-2.257zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.188-.002h.002V16L16 18.294l-2.291-2.29-.004-.004.004-.003.401-.402.195-.195L16 13.706l2.293 2.293z" fill="#fff"/>
        </svg>`
    },
    {
        id: 'ethereum',
        name: 'Ethereum USDT (ERC20)',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24">
            <circle cx="16" cy="16" r="16" fill="#627EEA"/>
            <path d="M16.498 4v8.87l7.497 3.35L16.498 4z" fill="#fff" fillOpacity=".602"/>
            <path d="M16.498 4L9 16.22l7.498-3.35V4z" fill="#fff"/>
            <path d="M16.498 21.968v6.027L24 17.616l-7.502 4.352z" fill="#fff" fillOpacity=".602"/>
            <path d="M16.498 27.995v-6.028L9 17.616l7.498 10.379z" fill="#fff"/>
            <path d="M16.498 20.573l7.497-4.353-7.497-3.348v7.701z" fill="#fff" fillOpacity=".2"/>
            <path d="M9 16.22l7.498 4.353v-7.701L9 16.22z" fill="#fff" fillOpacity=".602"/>
        </svg>`
    },
    {
        id: 'polygon',
        name: 'Polygon USDT',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24">
            <circle cx="16" cy="16" r="16" fill="#8247E5"/>
            <path d="M21.092 12.693c-.369-.215-.848-.215-1.254 0l-2.879 1.654-1.955 1.078-2.879 1.653c-.369.216-.848.216-1.254 0l-2.288-1.294c-.369-.215-.627-.61-.627-1.042V12.19c0-.431.221-.826.627-1.042l2.25-1.258c.37-.216.85-.216 1.256 0l2.25 1.258c.37.216.628.611.628 1.042v1.654l1.955-1.115v-1.653c0-.432-.222-.827-.628-1.043l-4.167-2.372c-.369-.215-.848-.215-1.254 0L8.75 9.961c-.813.468-1.318 1.327-1.318 2.264v4.707c0 .432.222.827.627 1.043l4.205 2.372c.369.215.848.215 1.254 0l2.879-1.654 1.955-1.077 2.879-1.654c.369-.216.848-.216 1.254 0l2.251 1.258c.369.216.627.611.627 1.042v2.552c0 .431-.221.826-.627 1.042l-2.25 1.294c-.37.216-.85.216-1.256 0l-2.25-1.258c-.37-.216-.628-.611-.628-1.042v-1.654l-1.955 1.115v1.653c0 .432.222.827.628 1.043l4.204 2.372c.369.215.848.215 1.254 0l4.204-2.372c.369-.216.627-.611.627-1.043v-4.707c0-.432-.221-.827-.627-1.043l-4.204-2.372z" fill="#fff"/>
        </svg>`
    },
    {
        id: 'tron',
        name: 'Tron USDT (TRC20)',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24">
            <circle cx="16" cy="16" r="16" fill="#EF0027"/>
            <path d="M21.932 9.913L7.5 7.257l7.595 19.112 10.583-12.894-3.746-3.562zm-.232 1.17l2.284 2.174-6.24 7.61L8.744 8.83l12.956 2.253zm-7.043 8.602l7.05-8.58-11.11-1.937 4.06 10.517z" fill="#fff"/>
        </svg>`
    },
    {
        id: 'solana',
        name: 'Solana USDT (SPL)',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="24" height="24">
            <circle cx="16" cy="16" r="16" fill="#000"/>
            <path d="M11.524 21.096l2.09-2.064c.128-.126.291-.208.468-.234.177-.027.358-.004.524.066l3.873 1.62c.203.085.378.226.5.404.12.178.184.388.184.603v3.074c0 .155-.033.309-.098.45-.064.142-.158.268-.275.37-.117.101-.255.174-.404.213-.15.039-.306.044-.457.015l-3.84-.74c-.296-.057-.547-.24-.68-.495l-1.885-3.282zm0-10.192l2.09 2.064c.128.126.291.208.468.234.177.027.358.004.524-.066l3.873-1.62c.203-.085.378-.226.5-.404.12-.178.184-.388.184-.603V7.445c0-.155-.033-.309-.098-.45-.064-.142-.158-.268-.275-.37-.117-.101-.255-.174-.404-.213-.15-.039-.306-.044-.457-.015l-3.84.74c-.296.057-.547.24-.68.495l-1.885 3.282zm12.585 3.095l-2.09-2.064c-.128-.126-.291-.208-.468-.234-.177-.027-.358-.004-.524.066l-3.873 1.62c-.203.085-.378.226-.5.404-.12.178-.184.388-.184.603v3.074c0 .155.033.309.098.45.064.142.158.268.275.37.117.101.255.174.404.213.15.039.306.044.457.015l3.84-.74c.296-.057.547-.24.68-.495l1.885-3.282z" fill="#00FFA3"/>
        </svg>`
    }
];

export default function NetworkSelector({ value, onChange, disabled = false }: NetworkSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const selectedNetwork = networks.find(network => network.id === value);

    const filteredNetworks = networks.filter(network =>
        network.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            {isOpen && !disabled && (
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-10" onClick={() => setIsOpen(false)} />
            )}
            <div className="relative" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between bg-gray-700 text-white rounded-xl p-3 border border-gray-600 focus:border-purple-500 focus:outline-none ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-purple-400'}`}
            >
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6" dangerouslySetInnerHTML={{ __html: selectedNetwork?.icon || '' }} />
                    <span className="text-sm sm:text-base">{selectedNetwork?.name}</span>
                </div>
                <svg
                    className={`w-5 h-5 transition-transform ${isOpen ? 'transform rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && !disabled && (
                <div className="absolute z-10 w-full mt-1 bg-gray-800 border border-gray-700 rounded-xl shadow-lg overflow-hidden">
                    <div className="p-2">
                        <input
                            type="text"
                            placeholder="Search networks..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-gray-700 text-white rounded-lg p-2 text-sm border border-gray-600 focus:border-purple-500 focus:outline-none"
                        />
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {filteredNetworks.map((network) => (
                            <button
                                key={network.id}
                                onClick={() => {
                                    onChange(network.id);
                                    setIsOpen(false);
                                    setSearchTerm('');
                                }}
                                className={`w-full flex items-center gap-2 p-3 hover:bg-gray-700 transition-colors ${value === network.id ? 'bg-gray-700' : ''}`}
                            >
                                <div className="w-6 h-6" dangerouslySetInnerHTML={{ __html: network.icon }} />
                                <span className="text-sm sm:text-base">{network.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
        </>
    );
}
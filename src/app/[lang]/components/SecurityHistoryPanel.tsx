import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';

interface SecurityViolation {
    userId: string;
    type: 'AUTO_CLICKER' | 'SCRIPT' | 'RAPID_CLICKING';
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    details: {
        clickInterval: number;
        patternMatch: number;
        clickCount: number;
        timestamp: string;
    }[];
    createdAt: string;
    updatedAt: string;
}

const SecurityHistoryPanel: React.FC = () => {
    const [violations, setViolations] = useState<SecurityViolation[]>([]);
    const [loading, setLoading] = useState(true);
    const [timeframe, setTimeframe] = useState('7'); // Default 7 days

    const fetchViolations = React.useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetch(`/api/security?days=${timeframe}`);
            if (!response.ok) throw new Error('Failed to fetch violations');
            const data = await response.json();
            setViolations(data);
        } catch (error) {
            console.error('Error fetching security violations:', error);
        } finally {
            setLoading(false);
        }
    }, [timeframe, setLoading, setViolations]);

    useEffect(() => {
        fetchViolations();
        // Refresh data every minute
        const interval = setInterval(fetchViolations, 60000);
        return () => clearInterval(interval);
    }, [timeframe, fetchViolations]);

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'HIGH': return 'bg-red-500';
            case 'MEDIUM': return 'bg-yellow-500';
            case 'LOW': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };

    const getViolationIcon = (type: string) => {
        switch (type) {
            case 'AUTO_CLICKER':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                    </svg>
                );
            case 'SCRIPT':
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Security Violations History</h1>
                    <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm"
                    >
                        <option value="1">Last 24 Hours</option>
                        <option value="7">Last 7 Days</option>
                        <option value="30">Last 30 Days</option>
                    </select>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {violations.map((violation, index) => (
                            <div key={index} className="bg-gray-800 rounded-lg p-6 shadow-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className={`p-2 rounded-lg ${violation.type === 'AUTO_CLICKER' ? 'bg-red-500/10' : 'bg-yellow-500/10'}`}>
                                            {getViolationIcon(violation.type)}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-lg">{violation.type.replace('_', ' ')}</h3>
                                            <p className="text-sm text-gray-400">
                                                {format(new Date(violation.createdAt), 'PPpp')}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(violation.severity)}/10 text-${getSeverityColor(violation.severity).split('-')[1]}-500`}>
                                        {violation.severity}
                                    </span>
                                </div>

                                <div className="grid grid-cols-3 gap-4 mt-4">
                                    {violation.details.map((detail, idx) => (
                                        <div key={idx} className="bg-gray-900/50 rounded-lg p-4">
                                            <div className="text-sm text-gray-400">Click Pattern</div>
                                            <div className="mt-1 font-medium">
                                                <div className="flex justify-between items-center">
                                                    <span>Interval:</span>
                                                    <span className="text-red-400">{detail.clickInterval}ms</span>
                                                </div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span>Match:</span>
                                                    <span className="text-yellow-400">{detail.patternMatch}%</span>
                                                </div>
                                                <div className="flex justify-between items-center mt-1">
                                                    <span>Count:</span>
                                                    <span className="text-blue-400">{detail.clickCount}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-4 text-sm text-gray-500">
                                    User ID: {violation.userId}
                                </div>
                            </div>
                        ))}

                        {violations.length === 0 && (
                            <div className="text-center py-12 bg-gray-800 rounded-lg">
                                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <h3 className="mt-2 text-sm font-medium text-gray-400">No violations found</h3>
                                <p className="mt-1 text-sm text-gray-500">No security violations have been detected in the selected timeframe.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SecurityHistoryPanel;

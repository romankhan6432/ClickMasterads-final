'use client';

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX, FiCreditCard, FiGlobe, FiSettings } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface Network {
    id: string;
    name: string;
    symbol: string;
    icon: string;
    fee: number;
    minWithdraw: number;
    maxWithdraw: number;
}

interface PaymentMethod {
    _id?: string;
    id: string;
    symbol: string;
    name: string;
    icon: string;
    networks: Network[];
    status: 'active' | 'inactive';
}

export default function AdminPaymentMethods() {
    const { t } = useTranslation();
    const [methods, setMethods] = useState<PaymentMethod[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showNetworkModal, setShowNetworkModal] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [newNetwork, setNewNetwork] = useState<Network>({
        id: '',
        name: '',
        symbol: '',
        icon: '',
        fee: 0,
        minWithdraw: 0,
        maxWithdraw: 0
    });
    const [newMethod, setNewMethod] = useState<PaymentMethod>({
        id: '',
        symbol: '',
        name: '',
        icon: '',
        networks: [],
        status: 'active'
    });

    // Fetch payment methods
    useEffect(() => {
        const fetchMethods = async () => {
            try {
                const response = await fetch('/api/admin/payment-methods');
                if (!response.ok) throw new Error('Failed to fetch');
                const data = await response.json();
                setMethods(data);
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to fetch payment methods');
            } finally {
                setLoading(false);
            }
        };

        fetchMethods();
    }, []);

    const handleAddMethod = async () => {
        try {
            const response = await fetch('/api/admin/payment-methods', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newMethod)
            });

            if (!response.ok) throw new Error('Failed to add');
            const data = await response.json();
            
            setMethods([...methods, data]);
            setShowAddForm(false);
            setNewMethod({
                id: '',
                symbol: '',
                name: '',
                icon: '',
                networks: [],
                status: 'active'
            });
            toast.success('Payment method added successfully');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to add payment method');
        }
    };

    const handleUpdateMethod = async (method: PaymentMethod) => {
        try {
            const response = await fetch(`/api/admin/payment-methods/${method._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(method)
            });

            if (!response.ok) throw new Error('Failed to update');
            const data = await response.json();
            
            setMethods(methods.map(m => m._id === method._id ? data : m));
            setEditingMethod(null);
            toast.success('Payment method updated successfully');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to update payment method');
        }
    };

    const handleDeleteMethod = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this payment method?')) return;

        try {
            const response = await fetch(`/api/admin/payment-methods/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete');
            
            setMethods(methods.filter(m => m._id !== id));
            toast.success('Payment method deleted successfully');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to delete payment method');
        }
    };

    const handleAddNetwork = async (methodId: string) => {
        try {
            const response = await fetch(`/api/admin/payment-methods/${methodId}/networks`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newNetwork)
            });

            if (!response.ok) throw new Error('Failed to add network');
            const updatedMethod = await response.json();
            
            setMethods(methods.map(m => m._id === methodId ? updatedMethod : m));
            setShowNetworkModal(false);
            setNewNetwork({
                id: '',
                name: '',
                symbol: '',
                icon: '',
                fee: 0,
                minWithdraw: 0,
                maxWithdraw: 0
            });
            toast.success('Network added successfully');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Failed to add network');
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-gray-800 rounded-lg p-6 border border-gray-700 animate-pulse">
                            <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
                            <div className="h-4 bg-gray-700 rounded w-1/2 mb-6"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-700 rounded w-1/4"></div>
                                <div className="h-4 bg-gray-700 rounded w-2/3"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Payment Methods</h1>
                    <p className="text-gray-400">Manage your available payment options</p>
                </div>
                <button
                    onClick={() => setShowAddForm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 shadow-lg"
                >
                    <FiPlus className="w-5 h-5" />
                    Add Method
                </button>
            </div>

            {methods.length === 0 ? (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center justify-center p-12 bg-gray-800 rounded-xl border-2 border-dashed border-gray-700"
                >
                    <div className="w-20 h-20 bg-gray-700/50 rounded-full flex items-center justify-center mb-6">
                        <FiCreditCard className="w-10 h-10 text-gray-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">No Payment Methods Yet</h3>
                    <p className="text-gray-400 text-center mb-8 max-w-md">
                        Get started by adding your first payment method. This will allow users to make transactions on your platform.
                    </p>
                    <button
                        onClick={() => setShowAddForm(true)}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 shadow-lg group"
                    >
                        <FiPlus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
                        Add Your First Method
                    </button>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence>
                    {methods.map(method => (
                        <motion.div
                            key={method._id}
                            layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="bg-gray-800 rounded-lg p-6 border border-gray-700 hover:border-blue-500/50 transition-all shadow-xl"
                        >
                            {editingMethod?._id === method._id ? (
                                // Edit Form
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="space-y-6"
                                    >
                                        <div className="border-b border-gray-700 pb-4 mb-6">
                                            <h3 className="text-lg font-semibold text-white mb-1">Edit Payment Method</h3>
                                            <p className="text-sm text-gray-400">Update the details of this payment method</p>
                                        </div>
                                        
                                <div className="space-y-4">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-400">Method Name</label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={editingMethod?.name || ''}
                                                        onChange={e => setEditingMethod(prev => prev ? { ...prev, name: e.target.value } : null)}
                                                        className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all border border-gray-600 focus:border-blue-500"
                                                        placeholder="Enter method name"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-400">Symbol</label>
                                                <div className="relative">
                                    <input
                                        type="text"
                                                        value={editingMethod?.symbol || ''}
                                                        onChange={e => setEditingMethod(prev => prev ? { ...prev, symbol: e.target.value } : null)}
                                                        className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all border border-gray-600 focus:border-blue-500"
                                                        placeholder="Enter symbol (e.g. BTC)"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-400">Icon URL</label>
                                                <div className="relative">
                                    <input
                                        type="text"
                                                        value={editingMethod?.icon || ''}
                                                        onChange={e => setEditingMethod(prev => prev ? { ...prev, icon: e.target.value } : null)}
                                                        className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all border border-gray-600 focus:border-blue-500"
                                                        placeholder="Enter icon URL"
                                                    />
                                                    {editingMethod?.icon && (
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                            <img 
                                                                src={editingMethod.icon} 
                                                                alt="Icon preview" 
                                                                className="w-6 h-6 rounded"
                                                                onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-400">Status</label>
                                                <div className="relative">
                                    <select
                                                        value={editingMethod?.status || 'active'}
                                                        onChange={e => setEditingMethod(prev => prev ? { ...prev, status: e.target.value as 'active' | 'inactive' } : null)}
                                                        className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all border border-gray-600 focus:border-blue-500 appearance-none"
                                    >
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                        </svg>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between pt-6 border-t border-gray-700">
                                        <button
                                            onClick={() => setEditingMethod(null)}
                                                className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors"
                                        >
                                            <FiX className="w-4 h-4" />
                                            Cancel
                                            </button>
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => editingMethod && handleUpdateMethod(editingMethod)}
                                                    className="flex items-center gap-2 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                                    disabled={!editingMethod?.name || !editingMethod?.symbol}
                                                >
                                                    <FiSave className="w-4 h-4" />
                                                    Save Changes
                                        </button>
                                    </div>
                                </div>
                                    </motion.div>
                            ) : (
                                // View Mode
                                <>
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <div className="flex items-center gap-3 mb-2">
                                                    {method.icon && (
                                                        <img 
                                                            src={method.icon} 
                                                            alt={method.name} 
                                                            className="w-8 h-8 rounded-full"
                                                        />
                                                    )}
                                        <div>
                                                        <h3 className="text-xl font-bold text-white">{method.name}</h3>
                                                        <p className="text-gray-400 text-sm">{method.symbol}</p>
                                                    </div>
                                                </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => setEditingMethod(method)}
                                                    className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors"
                                            >
                                                <FiEdit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMethod(method._id!)}
                                                    className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <FiTrash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                        <div className="space-y-4">
                                            <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                                                method.status === 'active' 
                                                    ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                            }`}>
                                                <span className={`w-2 h-2 rounded-full mr-2 ${
                                                    method.status === 'active' ? 'bg-green-400' : 'bg-red-400'
                                                }`}></span>
                                                {method.status.charAt(0).toUpperCase() + method.status.slice(1)}
                                            </div>
                                            <div className="bg-gray-700/50 rounded-lg p-4">
                                                <div className="flex items-center justify-between mb-2">
                                                    <h4 className="text-sm font-medium text-gray-400">Networks</h4>
                                                    <button
                                                        onClick={() => {
                                                            setSelectedMethod(method);
                                                            setShowNetworkModal(true);
                                                        }}
                                                        className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                                                    >
                                                        <FiPlus className="w-3 h-3" />
                                                        Add Network
                                                    </button>
                                                </div>
                                                {method.networks.length > 0 ? (
                                    <div className="space-y-2">
                                                        {method.networks.map((network, idx) => (
                                                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors group">
                                                                <div className="flex items-center gap-3">
                                                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                                                        <FiGlobe className="w-4 h-4 text-gray-400" />
                                                                    </div>
                                                                    <div>
                                                                        <span className="text-white text-sm font-medium">{network.name}</span>
                                                                        <div className="flex items-center gap-2 text-xs text-gray-400">
                                                                            <span>{network.symbol}</span>
                                                                            <span>•</span>
                                                                            <span>Fee: {network.fee}%</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setSelectedMethod(method);
                                                                        setNewNetwork(network);
                                                                        setShowNetworkModal(true);
                                                                    }}
                                                                    className="p-1.5 text-gray-400 hover:text-blue-400 opacity-0 group-hover:opacity-100 transition-all"
                                                                >
                                                                    <FiSettings className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <motion.div 
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        className="flex flex-col items-center justify-center py-6 px-4"
                                                    >
                                                        <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center mb-3">
                                                            <FiGlobe className="w-6 h-6 text-gray-500" />
                                                        </div>
                                                        <p className="text-sm text-gray-400 text-center mb-3">
                                                            No networks have been configured for this payment method
                                                        </p>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedMethod(method);
                                                                setShowNetworkModal(true);
                                                            }}
                                                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-blue-400 rounded-lg hover:bg-gray-800/80 transition-colors text-sm"
                                                        >
                                                            <FiPlus className="w-4 h-4" />
                                                            Configure Network
                                                        </button>
                                                    </motion.div>
                                                )}
                                        </div>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            )}

            {/* Add Method Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm z-50">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-gray-800 rounded-xl p-8 w-full max-w-md shadow-2xl border border-gray-700"
                    >
                        <h2 className="text-2xl font-bold text-white mb-6">Add Payment Method</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Name</label>
                            <input
                                type="text"
                                value={newMethod.name}
                                onChange={e => setNewMethod({ ...newMethod, name: e.target.value })}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. Bitcoin"
                            />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Symbol</label>
                            <input
                                type="text"
                                value={newMethod.symbol}
                                onChange={e => setNewMethod({ ...newMethod, symbol: e.target.value })}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="e.g. BTC"
                            />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">ID</label>
                            <input
                                type="text"
                                value={newMethod.id}
                                onChange={e => setNewMethod({ ...newMethod, id: e.target.value })}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Unique identifier"
                            />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Icon URL</label>
                            <input
                                type="text"
                                value={newMethod.icon}
                                onChange={e => setNewMethod({ ...newMethod, icon: e.target.value })}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="https://example.com/icon.png"
                            />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-gray-400">Status</label>
                            <select
                                value={newMethod.status}
                                onChange={e => setNewMethod({ ...newMethod, status: e.target.value as 'active' | 'inactive' })}
                                    className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            </div>
                            <div className="flex justify-end gap-3 pt-6">
                                <button
                                    onClick={() => setShowAddForm(false)}
                                    className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAddMethod}
                                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Add Method
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}

            {/* Network Configuration Modal */}
            {showNetworkModal && selectedMethod && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-gray-800 rounded-xl p-8 w-full max-w-md shadow-2xl border border-gray-700"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Add Network</h2>
                                <p className="text-sm text-gray-400">Configure a new network for {selectedMethod.name}</p>
                            </div>
                            <button
                                onClick={() => setShowNetworkModal(false)}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <FiX className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Network Name</label>
                                <input
                                    type="text"
                                    value={newNetwork.name}
                                    onChange={e => setNewNetwork({ ...newNetwork, name: e.target.value })}
                                    className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all border border-gray-600 focus:border-blue-500"
                                    placeholder="e.g. Ethereum Mainnet"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Symbol</label>
                                <input
                                    type="text"
                                    value={newNetwork.symbol}
                                    onChange={e => setNewNetwork({ ...newNetwork, symbol: e.target.value })}
                                    className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all border border-gray-600 focus:border-blue-500"
                                    placeholder="e.g. ETH"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Network ID</label>
                                <input
                                    type="text"
                                    value={newNetwork.id}
                                    onChange={e => setNewNetwork({ ...newNetwork, id: e.target.value })}
                                    className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all border border-gray-600 focus:border-blue-500"
                                    placeholder="Unique network identifier"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Fee (%)</label>
                                    <input
                                        type="number"
                                        value={newNetwork.fee}
                                        onChange={e => setNewNetwork({ ...newNetwork, fee: parseFloat(e.target.value) })}
                                        className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all border border-gray-600 focus:border-blue-500"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.01"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Icon URL</label>
                                    <input
                                        type="text"
                                        value={newNetwork.icon}
                                        onChange={e => setNewNetwork({ ...newNetwork, icon: e.target.value })}
                                        className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all border border-gray-600 focus:border-blue-500"
                                        placeholder="Icon URL"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Min Withdraw</label>
                                    <input
                                        type="number"
                                        value={newNetwork.minWithdraw}
                                        onChange={e => setNewNetwork({ ...newNetwork, minWithdraw: parseFloat(e.target.value) })}
                                        className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all border border-gray-600 focus:border-blue-500"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.000001"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Max Withdraw</label>
                                    <input
                                        type="number"
                                        value={newNetwork.maxWithdraw}
                                        onChange={e => setNewNetwork({ ...newNetwork, maxWithdraw: parseFloat(e.target.value) })}
                                        className="w-full bg-gray-700/50 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all border border-gray-600 focus:border-blue-500"
                                        placeholder="0.00"
                                        min="0"
                                        step="0.000001"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            <button
                                onClick={() => setShowNetworkModal(false)}
                                className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => selectedMethod._id && handleAddNetwork(selectedMethod._id)}
                                className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                disabled={!newNetwork.name || !newNetwork.symbol || !newNetwork.id}
                            >
                                <FiPlus className="w-4 h-4" />
                                Add Network
                            </button>
                    </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
} 
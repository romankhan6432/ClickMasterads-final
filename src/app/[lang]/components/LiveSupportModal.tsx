'use client';

import { useState, useRef, useEffect } from 'react';
 

interface LiveSupportModalProps {
    isOpen: boolean;
    onClose: () => void;
    userId: string;
    userName: string;
}

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'support';
    userId: string;
    userName: string;
    timestamp: string;
    status: 'sent' | 'delivered' | 'read';
}

export default function LiveSupportModal({ isOpen, onClose, userId, userName }: LiveSupportModalProps) {
    const [isFullScreen, setIsFullScreen] = useState(true);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (!isOpen) return;

        // Load chat history
        const loadChatHistory = async () => {
            try {
                const response = await fetch(`/api/chat?userId=${userId}`);
                if (!response.ok) {
                    throw new Error('Failed to load chat history');
                }

                const data = await response.json();
                if (data.success) {
                    setMessages(data.data);
                }
            } catch (error) {
                console.error('Error loading chat history:', error);
            }
        };

        loadChatHistory();
        setIsTyping(false);
    }, [isOpen, userId]);

    const handleSendMessage = async () => {
        if (!message.trim()) return;

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: message.trim(),
                    userId,
                    userName,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            const data = await response.json();
            if (data.success && data.messages) {
                // Add user message immediately
                setMessages(prev => [...prev, data.messages[0]]);
                setMessage('');

                // Show typing indicator
                setIsTyping(true);

                // Add support message after delay
                setTimeout(() => {
                    setIsTyping(false);
                    setMessages(prev => [...prev, data.messages[1]]);
                }, 2000);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (!isOpen) return null;

    const modalClasses = `fixed inset-0 bg-black bg-opacity-50 flex items-${isFullScreen ? 'start' : 'center'} justify-center z-50 ${isFullScreen ? 'p-0' : 'p-4'}`;
    const contentClasses = `bg-gray-800 rounded-${isFullScreen ? '0' : '2xl'} ${isFullScreen ? 'w-full h-full' : 'max-w-2xl w-full mx-4'} border border-gray-700 shadow-xl overflow-hidden transition-all duration-300`;

    return (
        <div className={modalClasses}>
            <div className={contentClasses}>
                <div className="sticky top-0 bg-gray-800 border-b border-gray-700 p-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                                    <span className="text-xl">💬</span>
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-gray-800"></div>
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Live Support</h2>
                                <p className="text-xs text-green-400">Online - Typically replies in 5 minutes</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setIsFullScreen(!isFullScreen)}
                                className="p-2 hover:bg-gray-700 rounded-xl transition-colors duration-200"
                            >
                                <span className="text-gray-400 hover:text-white text-xl">
                                    {isFullScreen ? '⊙' : '⤢'}
                                </span>
                            </button>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-700 rounded-xl transition-colors duration-200"
                            >
                                <span className="text-gray-400 hover:text-white">✕</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div 
                    ref={chatContainerRef}
                    className={`${isFullScreen ? 'h-[calc(100vh-250px)]' : 'h-[400px]'} overflow-y-auto p-6 space-y-4`}
                >
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div
                                className={`max-w-[70%] ${
                                    msg.sender === 'user'
                                        ? 'bg-purple-600 text-white rounded-l-xl rounded-tr-xl'
                                        : 'bg-gray-700 text-white rounded-r-xl rounded-tl-xl'
                                } p-4 space-y-1`}
                            >
                                <p>{msg.text}</p>
                                <div className={`flex items-center space-x-2 text-xs ${
                                    msg.sender === 'user' ? 'text-purple-200' : 'text-gray-400'
                                }`}>
                                    <span>{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-700 text-white rounded-r-xl rounded-tl-xl p-4">
                                <div className="flex space-x-2">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <div className="sticky bottom-0 bg-gray-800 border-t border-gray-700 p-6">
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Type your message..."
                                className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        </div>
                        <button
                            onClick={handleSendMessage}
                            disabled={!message.trim()}
                            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors duration-200"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

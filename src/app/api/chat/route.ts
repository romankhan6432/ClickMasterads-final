import { NextResponse } from 'next/server';
import axios from 'axios';
import { Message, IMessage } from '@/models/Message';
import connectDB from '@/lib/db';
import OpenAI from "openai";

const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/chat/completions';
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY;

const systemPrompt = `You are a helpful customer support agent for ClickMasterAds, a digital advertising platform. 
Be professional, friendly, and concise in your responses. If you don't know something specific about the platform, 
be honest and offer to connect the user with a human agent.`;

export async function POST(req: Request) {
    try {
        await connectDB();
        const { message, userId, userName } = await req.json();

        // Create and save user message
        const userMessage = await Message.create({
            text: message,
            sender: 'user',
            userId: '709148502',
            userName,
            timestamp: new Date(),
            status: 'sent'
        });

        // Get chat history for context
        const chatHistory = await Message.find({
            userId,
            timestamp: { $gte: new Date(Date.now() - 30 * 60 * 1000) } // Last 30 minutes
        }).sort({ timestamp: 1 }).limit(10).lean();

        // Prepare messages for DeepSeek
        const messages = [
            { role: 'system', content: systemPrompt },
            ...chatHistory.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            })),
            { role: 'user', content: message }
        ];

        const openai = new OpenAI({
            baseURL: 'https://api.deepseek.com',
            apiKey:  DEEPSEEK_API_KEY
    });
 
    

         

        // Create and save AI response
        const supportMessage = await Message.create({
            text: 'aiResponse',
            sender: 'support',
            userId: 'support',
            userName: 'AI Support Agent',
            timestamp: new Date(),
            status: 'sent'
        });

        return NextResponse.json({ 
            success: true, 
            messages: [
                {
                    id: userMessage._id.toString(),
                    text: userMessage.text,
                    sender: userMessage.sender,
                    userId: userMessage.userId,
                    userName: userMessage.userName,
                    timestamp: userMessage.timestamp.toISOString(),
                    status: userMessage.status
                },
                {
                    id: supportMessage._id.toString(),
                    text: supportMessage.text,
                    sender: supportMessage.sender,
                    userId: supportMessage.userId,
                    userName: supportMessage.userName,
                    timestamp: supportMessage.timestamp.toISOString(),
                    status: supportMessage.status
                }
            ]
        });
    } catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        await connectDB();
        const url = new URL(req.url);
        const userId = url.searchParams.get('userId');
        
        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        // Get user's chat history, sorted by timestamp
        const messages = await Message.find({
            $or: [
                { userId },
                { sender: 'support' }
            ]
        })
        .sort({ timestamp: 1 })
        .lean()
        .exec();

        return NextResponse.json({
            success: true,
            data: messages.map(msg => ({
                id: (msg as any)._id.toString(),
                text: msg.text,
                sender: msg.sender,
                userId: msg.userId,
                userName: msg.userName,
                timestamp: new Date(msg.timestamp).toISOString(),
                status: msg.status
            }))
        });
    } catch (error) {
        console.error('Error fetching chat history:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

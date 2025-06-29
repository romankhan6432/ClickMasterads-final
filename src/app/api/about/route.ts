import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db';
import { About, IAbout } from '@/models/About';

interface Feature {
    id: string;
    title: string;
    description: string;
    icon: string;
}

interface Stat {
    label: string;
    value: string;
    icon: string;
}

interface AboutData {
    features: Feature[];
    stats: Stat[];
    platformInfo: {
        title: string;
        description: string;
        bannerImage: string;
        ctaTitle: string;
        ctaDescription: string;
    };
    contact: {
        telegram: string;
        email: string;
    };
}

const defaultAboutData: Omit<IAbout, 'lastUpdated'> = {
    features: [
        {
            id: '1',
            title: 'Watch & Earn',
            description: 'Watch ads and earn USDT. Simple, transparent, and reliable.',
            icon: '📺'
        },
        {
            id: '2',
            title: 'Instant Rewards',
            description: 'Earnings are credited instantly after watching each ad.',
            icon: '⚡'
        },
        {
            id: '3',
            title: 'Multiple Payment Options',
            description: 'Withdraw using bKash, Nagad, or cryptocurrency (USDT).',
            icon: '💳'
        },
        {
            id: '4',
            title: 'Security First',
            description: 'Your account is protected with Telegram verification.',
            icon: '🔒'
        }
    ],
    stats: [
        {
            label: 'Total Users',
            value: '0+',
            icon: '👥'
        },
        {
            label: 'Paid Out',
            value: '$0+',
            icon: '💰'
        },
        {
            label: 'Daily Ads',
            value: '0+',
            icon: '📊'
        }
    ],
    platformInfo: {
        title: 'Welcome to ClickMasterAds',
        description: 'Your trusted platform for earning through ad engagement',
        bannerImage: '/images/platform-banner.jpg',
        ctaTitle: 'Ready to Start Earning?',
        ctaDescription: 'Join thousands of users who are already earning with ClickMasterAds!'
    },
    contact: {
        telegram: 'https://t.me/clickmasterads',
        email: 'support@clickmasterads.com'
    }
};

type MongoAboutData = IAbout & {
    _id: mongoose.Types.ObjectId;
    __v: number;
};

export async function GET() {
    try {
        await connectDB();

        // Try to get existing about data, or create with defaults if none exists
        let aboutData = await About.findOne().lean() as MongoAboutData | null;
        
        if (!aboutData) {
            const newAboutData = await About.create({
                ...defaultAboutData,
                lastUpdated: new Date()
            });
            aboutData = newAboutData.toObject();
        }

        if (!aboutData) {
            throw new Error('Failed to create or fetch about data');
        }




       




        return NextResponse.json({ 
            success: true, 
            data: {
                ...aboutData,
                _id: aboutData._id.toString(),
                lastUpdated: aboutData.lastUpdated.toISOString()
            }
        });
    } catch (error) {
        console.error('Error fetching about data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        await connectDB();
        const updates = await req.json();

        const aboutData = await About.findOneAndUpdate(
            {},
            { 
                ...updates,
                lastUpdated: new Date()
            },
            { 
                new: true, 
                upsert: true,
                runValidators: true
            }
        ).lean() as MongoAboutData;

        if (!aboutData) {
            throw new Error('Failed to update about data');
        }

        return NextResponse.json({ 
            success: true, 
            data: {
                ...aboutData,
                _id: aboutData._id.toString(),
                lastUpdated: aboutData.lastUpdated.toISOString()
            }
        });
    } catch (error) {
        console.error('Error updating about data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

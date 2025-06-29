import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { handleApiError } from '@/lib/errorHandler';
import { DirectLink } from '@/models/DirectLink';

 

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const telegramId = searchParams.get('telegramId');

        await connectDB();
        
        
        const user = await User.findOne({ telegramId: telegramId || process.env.DEMO_USER_ID });
         

        if (!user) {
            const errorResponse = { error: 'User not found', status: 404 };
            handleApiError(errorResponse);
            return NextResponse.json(errorResponse, { status: 404 });
        }

        const now = new Date();
        const timeRemaining = user.lastWatchTime 
            ? Math.max(0, 15 - Math.floor((now.getTime() - user.lastWatchTime.getTime()) / 1000))
            : 0;

            const directLinks = await DirectLink.find({}).sort({ createdAt: -1 });

        return NextResponse.json({
            success: true,
            balance: user.balance,
            adsWatched: user.adsWatched,
            timeRemaining,
            directLinks
        });
    } catch (error) {
        const errorResponse = { error:  error instanceof Error ? error.message : 'Internal Server Error', status: 500 };
        handleApiError(errorResponse);
        return NextResponse.json(errorResponse, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { telegramId , action } = await request.json();

        if (!telegramId || !action) {
            const errorResponse = { error: 'User ID and action are required', status: 400 };
            handleApiError(errorResponse);
            return NextResponse.json(errorResponse, { status: 400 });
        }
         
        await connectDB();

        const user = await User.findOne({ telegramId : telegramId || process.env.DEMO_USER_ID });
        if (!user) {
            const errorResponse = { error: 'User not found', status: 404 };
            handleApiError(errorResponse);
            return NextResponse.json(errorResponse, { status: 404 });
        }

        // Update user based on action
        if (action === 'watch_ad') {
            const now = new Date();
            const lastWatchTime = user.lastWatchTime;
            
            // Check if enough time has passed (15 seconds)
            if (lastWatchTime && (now.getTime() - lastWatchTime.getTime()) < 15000) {
                const errorResponse = { error: 'Please wait before watching another ad', status: 429 };
                handleApiError(errorResponse);
                return NextResponse.json(errorResponse, { status: 429 });
            }
  



            
            // Update user stats
            user.adsWatched = (user.adsWatched || 0) + 1;
            user.balance = (user.balance || 0) + 0.001; // Add 0.01 for each ad view
            user.lastWatchTime = now;
            await user.save();

            return NextResponse.json({
                success: true,
                message: 'Ad view recorded successfully',
                balance: user.balance,
                adsWatched: user.adsWatched
            });
        }

        const errorResponse = { error: 'Invalid action', status: 400 };
        handleApiError(errorResponse);
        return NextResponse.json(errorResponse, { status: 400 });
    } catch (error) {
        const errorResponse = { error: error instanceof Error ? error.message : 'Internal Server Error', status: 500 };
        handleApiError(errorResponse);
        return NextResponse.json(errorResponse, { status: 500 });
    }
}
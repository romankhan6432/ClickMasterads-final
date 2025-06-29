import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import User from '@/models/User';

import { handleApiError } from '@/lib/errorHandler';
import { authOptions } from '@/lib/authOptions';

 

export async function GET(request: Request) {
    try {
     const session  : any = getServerSession(authOptions);
     
      if(session.user?.role === 'admin') {
       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
     

        await connectDB();
        const users = await User.find().select('-__v').sort({ createdAt: -1 });

        // Calculate new users in last 24 hours
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const newUsersCount = await User.countDocuments({ createdAt: { $gte: twentyFourHoursAgo } });

     
       
        const stats = {
            totalUsers: users.length,
            totalBalance: users.reduce((sum, user) => sum + user.balance, 0),
            totalEarnings: users.reduce((sum, user) => sum + user.totalEarnings, 0),
            totalAdsWatched: users.reduce((sum, user) => sum + user.adsWatched, 0),
            newUsersLast24h: newUsersCount,
            totalWithdrawals : 0,
            pendingWithdrawals : []
        };

        return NextResponse.json({ result:{  users, stats} });
    } catch (error) {
        const errorResponse = { error: 'Failed to fetch users', status: 500 };
        handleApiError(errorResponse);
        return NextResponse.json(errorResponse, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const session  : any = getServerSession(authOptions);

        if(session.user?.role === 'admin') {
         return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
       
        const { userId, updates } = await request.json();
        await connectDB();

        const allowedUpdates = ['balance', 'totalEarnings', 'adsWatched', 'isAdmin'];
        const sanitizedUpdates: any = {};
        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                sanitizedUpdates[key] = updates[key];
            }
        });

        const user = await User.findByIdAndUpdate(
            userId,
            { ...sanitizedUpdates, updatedAt: new Date() },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        const errorResponse = { error: 'Failed to update user', status: 500 };
        handleApiError(errorResponse);
        return NextResponse.json(errorResponse, { status: 500 });
    }
}
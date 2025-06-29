import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import dbConnect from '@/lib/db';
import History from '@/models/History';
import { authOptions } from '@/lib/authOptions';

export async function GET(request: Request) {
    try {
        // Get user session
        const session: any = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Parse query parameters
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') || '1');
        const limit = parseInt(url.searchParams.get('limit') || '10');
        const activityType = url.searchParams.get('type');
        const startDate = url.searchParams.get('startDate');
        const endDate = url.searchParams.get('endDate');

        // Connect to database
        await dbConnect();
     
        // Build query
        const query: any = { telegramId : session.user.telegramId };
        if (activityType) {
            query.activityType = activityType;
        }
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        // Get total count for pagination
        const total = await History.countDocuments(query);

        // Fetch history with pagination
        const history = await History.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        // Calculate earnings summary
        const earningsSummary = await History.aggregate([
            { $match: { userId:  session.user.telegramId, amount: { $exists: true, $ne: null } } },
            { $group: {
                _id: '$activityType',
                total: { $sum: '$amount' },
                count: { $sum: 1 }
            }},
            { $project: {
                activityType: '$_id',
                total: 1,
                count: 1,
                _id: 0
            }}
        ]);

        // Get today's earnings
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayEarnings = await History.aggregate([
            { 
                $match: { 
                    userId:  session.user.telegramId,
                    amount: { $exists: true, $ne: null },
                    createdAt: { $gte: today }
                }
            },
            { 
                $group: {
                    _id: null,
                    total: { $sum: '$amount' }
                }
            }
        ]);

        return NextResponse.json({
            success: true,
            result: {
                history,
                pagination: {
                    total,
                    pages: Math.ceil(total / limit),
                    currentPage: page,
                    limit
                },
                summary: {
                    earnings: earningsSummary,
                    todayEarnings: todayEarnings[0]?.total || 0
                }
            }
        });
    } catch (error) {
        console.error('Error fetching user history:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 
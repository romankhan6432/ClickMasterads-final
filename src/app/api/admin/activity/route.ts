import { NextResponse } from 'next/server';
import Activity from '@/models/Activity';
import connectDB from '@/lib/db';

 
export async function GET() {
    try {
        await connectDB()
        
        const activities = await Activity.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('userId', 'username')
            .lean();

        const formattedActivities = activities.map(activity => ({
            id: activity._id,
            type: activity.type,
            details: activity.details,
            username: activity.userId?.username || 'Unknown',
            status: activity.status,
            createdAt: activity.createdAt
        }));

        return NextResponse.json({ activities: formattedActivities });
    } catch (error) {
       // return errorHandler(error);
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { userId, type, details } = body;

        if (!userId || !type || !details) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        await connectDB();
        
        const activity = await Activity.create({
            userId,
            type,
            details,
            status: 'completed'
        });

        return NextResponse.json({ activity }, { status: 201 });
    } catch (error) {
        //return errorHandler(error);
    }
}
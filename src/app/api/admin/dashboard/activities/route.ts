import { NextResponse } from 'next/server';
import Activity from '@/models/Activity';
import dbConnect from '@/lib/dbConnect';

export async function GET() {
  try {
    await dbConnect();

    // Get recent activities (last 10)
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('id details createdAt')
      .lean();

    return NextResponse.json({
      response: {
        activities
      }
    });
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recent activities' },
      { status: 500 }
    );
  }
}

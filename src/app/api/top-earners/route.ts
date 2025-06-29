import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  try {
    await connectDB();
  const session : any = await getServerSession(authOptions);
    // Find top 10 users by earnings
    const topEarners = await User.find({ status: 'active' })
      .sort({ balance : -1 })
      .limit(10);

    // Map the results to a cleaned-up format
    const earners = topEarners.map((user) => ({
      id: user._id,
      name: user.fullName,
      telegramId: user.telegramId,
      totalEarnings: user.totalEarnings,
      adsWatched: user.adsWatched,
      isCurrentUser: user.telegramId === session?.user?.telegramId,
      earned : user.balance
    }));

    return NextResponse.json({ success: true, data: { earners }});
  } catch (error) {
    console.error('Error fetching top earners:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch top earners' },
      { status: 500 }
    );
  }
}

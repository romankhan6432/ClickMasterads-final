import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import WithdrawalHistory from '@/models/WithdrawalHistory';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

export async function GET() {
  await dbConnect();

 const session  : any = getServerSession(authOptions);

 if(session.user?.role === 'admin') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
 }

  // Count total users
  const totalUsers = await User.countDocuments({});

  // Count total withdrawals (approved or pending)
  const totalWithdrawals = await WithdrawalHistory.countDocuments({ activityType: 'withdrawal_request' });

  // Count pending withdrawals
  const pendingWithdrawals = await WithdrawalHistory.countDocuments({ activityType: 'withdrawal_request', status: 'pending' });

  // Count new users in last 24h
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const newUsersLast24h = await User.countDocuments({ createdAt: { $gte: since } });

  const stats = {
    totalUsers,
    totalWithdrawals,
    pendingWithdrawals,
    newUsersLast24h
  };
  return NextResponse.json({ stats });
}

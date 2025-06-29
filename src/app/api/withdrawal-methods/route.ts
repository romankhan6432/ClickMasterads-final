import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import WithdrawalMethod from '@/models/WithdrawalMethod';
import Coin from '@/models/Coin';
import dbConnect from '@/lib/dbConnect';

export async function GET() {
  try {
    await dbConnect();
   
    // Get all active withdrawal methods and sort by createdAt
    const withdrawalMethods = await WithdrawalMethod.find({ active: true })
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();

    // Get all active coins
    const coins = await Coin.find({ active: true })
      .select('-__v')
      .lean();

    // Format the response
    const formattedMethods = withdrawalMethods.map(method => ({
      ...method,
      fee: method.fee || '0.1%',
      estimatedTime: method.estimatedTime || '30-60 minutes',
      minAmount: method.minAmount || 50,
      maxAmount: method.maxAmount || 100000,
      currency: method.currency || 'USD'
    }));

    return NextResponse.json({
      methods: formattedMethods,
      coins: coins
    });
  } catch (error) {
    console.error('Error fetching withdrawal methods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch withdrawal methods' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const session = await getServerSession();

  if (!session?.user?.role || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const body = await request.json();
    
    // Generate a unique method ID
    const methodId = `wm_${body.category?.toLowerCase()}_${Date.now()}`;
    
    // Create the withdrawal method with default values
    const withdrawalMethod = await WithdrawalMethod.create({
      id: methodId,
      name: body.name,
      supportedCoins: body.supportedCoins || ['BTC'],
      icon: body.icon || `/icons/${body.category?.toLowerCase()}.png`,
      active: true,
      fee: body.fee || '0.1%',
      estimatedTime: body.estimatedTime || '30-60 minutes',
      category: body.category || 'Crypto',
      minAmount: body.minAmount || 50,
      maxAmount: body.maxAmount || 100000,
      currency: body.currency || 'USD'
    });
    
    return NextResponse.json(withdrawalMethod);
  } catch (error) {
    console.error('Error creating withdrawal method:', error);
    return NextResponse.json(
      { error: 'Failed to create withdrawal method' },
      { status: 400 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import DirectLink from '@/models/DirectLink';
import User from '@/models/User';
import ClickHistory from '@/models/ClickHistory';
import connectDB from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// Function to validate hash
const validateHash = (id: string, timestamp: number, hash: string) => {
  const str = `${id}_${timestamp}_${process.env.HASH_SECRET || 'secret'}`;
  const expectedHash = Buffer.from(str).toString('base64').replace(/[^a-zA-Z0-9]/g, '');
  return hash === expectedHash;
};

export async function POST(req: Request) {
  const headersList = headers();
  const ipAddress = (headersList instanceof Headers ? headersList.get('x-forwarded-for') : null) || 'unknown';
  const userAgent = (headersList instanceof Headers ? headersList.get('user-agent') : null) || 'unknown';
  let requestData = null;
  const session: any = await getServerSession(authOptions);

  try {
    const body = await req.json();
    requestData = body;
  } catch (error) {
    console.error('Error parsing request body:', error);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (!requestData) {
    return NextResponse.json({ error: 'Missing request data' }, { status: 400 });
  }

  const { id, hash, timestamp } = requestData;

  if (!id || !hash || !timestamp) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  await connectDB();

  const user = await User.findOne({ telegramId: session.user.telegramId });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const directLink = await DirectLink.findOne({ _id: id });

  if (!directLink) {
    return NextResponse.json({ error: 'Direct link not found' }, { status: 404 });
  }

  if (!validateHash(id, timestamp, hash)) {
    return NextResponse.json({ error: 'Invalid hash' }, { status: 400 });
  }

  user.balance += Number(directLink.rewardPerClick);
  directLink.clicks += 1;
  await user.save();
  await directLink.save();


  return NextResponse.json({ message: 'Click logged successfully' }, { status: 200 });

}
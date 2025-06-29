import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth/next';
import User from '@/models/User';
import type { IUser } from '@/models/User';
import dbConnect from '@/lib/dbConnect';

export async function adminMiddleware(request: NextRequest) {
  try {
    await dbConnect();
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is admin
    const user = await User.findOne({ email: session.user.email })
      .select('role')
      .lean() as IUser | null;

    if (!user || user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Error in admin middleware:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

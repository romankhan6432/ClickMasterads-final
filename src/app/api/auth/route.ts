import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import { ResponseCookies } from 'next/dist/server/web/spec-extension/cookies';
import User from '@/models/User';
import connectDB from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { handleApiError } from '@/lib/error';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-secret-key'
);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { telegramId, firstName, lastName, username } = body;

    if (!telegramId) {
      return NextResponse.json(
        { error: 'Telegram ID is required' },
        { status: 400 }
      );
    }
    await connectDB();
    let user = await User.findOne({ telegramId });

    if (!user) {
       return NextResponse.json(
         { error: 'User not found' },
         { status: 404 }
       );
    } 

    const users = {
      _id : user._id,
      telegramId: user.telegramId,
      fullName : user.fullName,
      username: user.username,
      balance: user.balance,
      adsWatched: user.adsWatched,
      lastWatchTime: user.lastWatchTime,
      lastResetDate: user.lastResetDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }

   const token = await new SignJWT( users )
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('2m')
      .sign(JWT_SECRET);

    // Set JWT token in HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: users 
    });

    const cookieStore = response.cookies as unknown as ResponseCookies;
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
    const session : any = await getServerSession(authOptions);
    
    if (!session) {
      const errorResponse = { error: 'Unauthorized', status: 401 };
      handleApiError(errorResponse);
      return NextResponse.json(errorResponse, { status: 401 });
    }
    await connectDB();
    const user = await User.findById(session.user._id);
    if (!user) {
      const errorResponse = { error: 'User not found', status: 404 };
      handleApiError(errorResponse);
      return NextResponse.json(errorResponse, { status: 404 });
    }

    const users = {
      _id : user._id,
      telegramId: user.telegramId,
      fullName : user.fullName,
      username: user.username,
      balance: user.balance,
      adsWatched: user.adsWatched,
      lastWatchTime: user.lastWatchTime,
      lastResetDate: user.lastResetDate,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
    return NextResponse.json({ success: true, user: users });
      
   
}
 
import { NextRequest, NextResponse } from 'next/server';
import { Notice } from '@/models/Notice';
import dbConnect from '@/lib/dbConnect';

// Get active notices for public users
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
         
    // Only fetch active notices for public users
    const notices = await Notice.find({ isActive: true }).sort({ createdAt: -1 });
    
    return NextResponse.json({ notices }, { status: 200 });
  } catch (error) {
    console.error('Error fetching notices:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { Notice } from '@/models/Notice';
import dbConnect from '@/lib/dbConnect';

// Get all notices
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const notices = await Notice.find().sort({ createdAt: -1 });
    
    return NextResponse.json({ notices }, { status: 200 });
  } catch (error) {
    console.error('Error fetching notices:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Create a new notice
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    await dbConnect();
    
    const { title, content, isActive } = await req.json();
    
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 });
    }
    
    const newNotice = new Notice({
      title,
      content,
      isActive: isActive !== undefined ? isActive : true,
    });
    
    await newNotice.save();
    
    return NextResponse.json({ notice: newNotice }, { status: 201 });
  } catch (error) {
    console.error('Error creating notice:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

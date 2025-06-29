import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectDB from '@/lib/db';
import { authOptions } from '@/lib/authOptions';
import Notice from '@/models/Notice';


// GET a single notice by ID
export async function GET(
  req: NextRequest,
  context: any
) {
  try {
    const { id } = await context.params;
    
    await connectDB();  
         
       
    const notice = await Notice.findById(id).select('-__v');

    if (!notice) {
      return NextResponse.json({ 
        success: false, 
        error: 'Notice not found' 
      }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      data: { notice } 
    });
  } catch (error) {
    console.error('Error fetching notice:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch notice' 
    }, { status: 500 });
  }
}

// PUT to update a notice (admin only)
export async function PUT(
  req: NextRequest,
 context: any
) {
  try {
    const session: any = await getServerSession(authOptions);
    
    // Check if user is authenticated and has admin role
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const { id } = await context.params;
    const { title, content, isActive } = await req.json();

    if (!title || !content) {
      return NextResponse.json({ 
        success: false, 
        error: 'Title and content are required' 
      }, { status: 400 });
    }

    await connectDB();
    
    // Check if notice exists
    const existingNotice = await Notice.findById(id);

    if (!existingNotice) {
      return NextResponse.json({ 
        success: false, 
        error: 'Notice not found' 
      }, { status: 404 });
    }

    // Update the notice
    const updatedNotice = await Notice.findByIdAndUpdate(
      id,
      {
        title,
        content,
        isActive: isActive ?? existingNotice.isActive,
        updatedAt: new Date()
      },
      { new: true }
    );

    return NextResponse.json({ 
      success: true, 
      data: { notice: updatedNotice } 
    });
  } catch (error) {
    console.error('Error updating notice:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update notice' 
    }, { status: 500 });
  }
}

// DELETE a notice (admin only)
export async function DELETE(
  req: NextRequest,
  context: any
) {
  try {
    const session: any = await getServerSession(authOptions);
    
    // Check if user is authenticated and has admin role
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json({ 
        success: false, 
        error: 'Unauthorized' 
      }, { status: 401 });
    }

    const { id } = await context.params;
    
    await connectDB();

    // Check if notice exists
    const existingNotice = await Notice.findById(id);

    if (!existingNotice) {
      return NextResponse.json({ 
        success: false, 
        error: 'Notice not found' 
      }, { status: 404 });
    }

    // Delete the notice
    await Notice.findByIdAndDelete(id);

    return NextResponse.json({ 
      success: true, 
      data: { message: 'Notice deleted successfully' } 
    });
  } catch (error) {
    console.error('Error deleting notice:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete notice' 
    }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
 
import DirectLink from '@/models/DirectLink';
import { authOptions } from '@/lib/authOptions';
import connectDB from '@/lib/db';

// GET all direct links or filter by user
export async function GET(request: Request) {
  try {
    const session : any = await getServerSession(authOptions);
     

    const { searchParams } = new URL(request.url);
    const telegramId = searchParams.get('telegramId');


    await connectDB();

    if (telegramId) {
      const links = await DirectLink.find({ userId: telegramId });
      return NextResponse.json({
        status: 'success',
        result: links,
      });
    }

    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const links = await DirectLink.find();

    return NextResponse.json({
      status: 'success',
      result: links,
    });

  } catch (error) {
    console.error('Error fetching direct links:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Create a new direct link
export async function POST(req: Request) {
  try {
    const session : any = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { url, title } = await req.json();

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const newLink = await DirectLink.create({
     userId : session.user.email,
      url,
      title: title || url,
      status: 'active',
      clicks: 0,
    });
 

    return NextResponse.json({
      status: 'success',
      result: newLink,
    });

  } catch (error) {
    console.error('Error creating direct link:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Update a direct link
export async function PUT(req: Request) {
  try {
    const session : any = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id, url, title, status } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Link ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingLink = await DirectLink.findById(id)

    if (!existingLink) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    

    const updateData: any = {};
    if (url) updateData.url = url;
    if (title) updateData.title = title;
    if (status) updateData.status = status;

    const updatedLink = await DirectLink.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    )

    return NextResponse.json({
      status: 'success',
      result: updatedLink,
    });

  } catch (error) {
    console.error('Error updating direct link:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Delete a direct link
export async function DELETE(req: Request) {
  try {
    const session : any = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Link ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const existingLink = await DirectLink.findById(id);

    if (!existingLink) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }
 
  
    await DirectLink.findByIdAndDelete(id); 

    return NextResponse.json({
      status: 'success',
      message: 'Link deleted successfully',
    });

  } catch (error) {
    console.error('Error deleting direct link:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 
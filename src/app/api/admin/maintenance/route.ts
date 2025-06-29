import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import MaintenanceSettings from '@/models/MaintenanceSettings';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session  ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const settings = await MaintenanceSettings.findOne();
    
    return NextResponse.json(settings || { isEnabled: false });
  } catch (error) {
    console.error('Error fetching maintenance settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    await connectDB();

    const settings = await MaintenanceSettings.findOneAndUpdate(
      {},
      {
        isEnabled: data.isEnabled,
        message: data.message,
        allowedIps: data.allowedIps,
        startTime: data.startTime,
        endTime: data.endTime
      },
      { upsert: true, new: true }
    );

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error updating maintenance settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
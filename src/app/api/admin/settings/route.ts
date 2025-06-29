import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import AdminSettings from '@/models/AdminSettings';
import MaintenanceSettings from '@/models/MaintenanceSettings';
import connectDB from '@/lib/db';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session  ) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const [adminSettings, maintenanceSettings] = await Promise.all([
      AdminSettings.findOne(),
      MaintenanceSettings.findOne()
    ]);
    
    if (!adminSettings) {
      const defaultAdminSettings = new AdminSettings();
      await defaultAdminSettings.save();
      return NextResponse.json({
        admin: defaultAdminSettings,
        maintenance: maintenanceSettings || {}
      });
    }

    return NextResponse.json({
      admin: adminSettings,
      maintenance: maintenanceSettings || {}
    });
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    await connectDB();

    // Handle admin settings
    const adminSettings = await AdminSettings.findOne();
    if (!adminSettings) {
      const newAdminSettings = new AdminSettings(data.admin);
      await newAdminSettings.save();
    } else {
      Object.assign(adminSettings, data.admin);
      await adminSettings.save();
    }

    // Handle maintenance settings
    if (data.maintenance) {
      const maintenanceSettings = await MaintenanceSettings.findOne();
      if (!maintenanceSettings) {
        const newMaintenanceSettings = new MaintenanceSettings(data.maintenance);
        await newMaintenanceSettings.save();
      } else {
        Object.assign(maintenanceSettings, data.maintenance);
        await maintenanceSettings.save();
      }
    }

    // Return updated settings
    const [updatedAdminSettings, updatedMaintenanceSettings] = await Promise.all([
      AdminSettings.findOne(),
      MaintenanceSettings.findOne()
    ]);

    return NextResponse.json({
      admin: updatedAdminSettings,
      maintenance: updatedMaintenanceSettings || {}
    });
  } catch (error) {
    console.error('Error updating admin settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 
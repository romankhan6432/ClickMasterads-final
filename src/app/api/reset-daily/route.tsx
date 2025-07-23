import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import User from "@/models/User";

export async function POST(req: NextRequest) {
 
    const session: any = await getServerSession(authOptions);

    
   
   try {
    const user = await User.findOne({ _id : session.user._id});
    user.adsWatched = 0;
    user.save()

    return NextResponse.json({ success: true, message: 'Daily reset successful' , user});
   } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
   }
}
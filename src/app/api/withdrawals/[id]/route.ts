import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
 
 
import { Types } from 'mongoose';
import User from '@/models/User';
import WithdrawalHistory from '@/models/WithdrawalHistory';
 
 

interface UserPopulated {
    _id: Types.ObjectId;
    name: string;
    email: string;
}

 

export async function GET(request: Request, context: any) {
    try {
        const { id } = await context.params;
        await dbConnect();
    
        
        const withdrawal = await WithdrawalHistory.findById(id);
  // Find the user based on ID in withdrawal (assume w.userId exists)
    const user = await User.findOne({ telegramId : withdrawal.telegramId });

        if (!withdrawal) {
            return NextResponse.json(
                { error: 'Withdrawal not found' },
                { status: 404 }
            );
        }

        const result = {  ...withdrawal._doc ,
             userId : {
                username : `@${user?.username}`,
                user  : user?.fullName,
               
        } }
         
        return NextResponse.json({ result });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request, context: any) {
    try {
  
     
        const { id } = await context.params;

        await dbConnect();

       
        const data = await request.json();
        const { status } = data;

        if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            );
        }

        const withdrawal = await WithdrawalHistory.findById(id);
        if (!withdrawal) {
            return NextResponse.json(
                { error: 'Withdrawal not found' },
                { status: 404 }
            );
        }

        // If rejecting a pending withdrawal, refund the user's balance
        if (withdrawal.status === 'pending' && status === 'rejected') {
            await User.findByIdAndUpdate(withdrawal.userId, {
                $inc: { balance: withdrawal.amount }
            });
        }

        withdrawal.status = status;
        await withdrawal.save();

        return NextResponse.json(withdrawal);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, context: any) {
    try {
       
        const { id } = await context.params;
        await dbConnect();

         
        const withdrawal = await WithdrawalHistory.findById(id);

        if (!withdrawal) {
            return NextResponse.json(
                { error: 'Withdrawal not found' },
                { status: 404 }
            );
        }

        // Only allow deletion of pending withdrawals
        if (withdrawal.status !== 'pending') {
            return NextResponse.json(
                { error: 'Can only delete pending withdrawals' },
                { status: 400 }
            );
        }

        // Refund the user's balance
        await User.findByIdAndUpdate(withdrawal.userId, {
            $inc: { balance: withdrawal.amount }
        });

        await withdrawal.deleteOne();

        return NextResponse.json({ message: 'Withdrawal deleted successfully' });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}

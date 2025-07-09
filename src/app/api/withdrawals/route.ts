import { NextResponse } from 'next/server';

import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import WithdrawalHistory from '@/models/WithdrawalHistory';

// Constants for conversion and fees
const USD_TO_BDT_RATE = 100; // 1 USD = 100 BDT
const MIN_CRYPTO_AMOUNT = 1.5;
const MAX_CRYPTO_AMOUNT = 150; // Maximum 50 USDT withdrawal
const MIN_BDT_AMOUNT = 100;
const MAX_BDT_AMOUNT = 25000;

// Fee structure
const FEES = {
    bkash: { percentage: 1.5, fixed: 0 },
    nagad: { percentage: 1.5, fixed: 0 },
    rocket: { percentage: 1.5, fixed: 0 },
    binance: { percentage: 0, fixed: 1 }, // 1 USDT fixed fee
    bitget: { percentage: 0, fixed: 1 }, // 1 USDT fixed fee
    tron: { percentage: 0, fixed: 1 }, // 1 USDT fixed fee
    eth: { percentage: 0, fixed: 15 }, // 15 USDT fixed fee
    btc: { percentage: 0, fixed: 0.0005 } // 0.0005 BTC fixed fee
};

// Helper function to calculate fee
function calculateFee(amount: number, method: string): { fee: number; amountAfterFee: number } {
    const feeStructure = FEES[method.toLowerCase() as keyof typeof FEES] || { percentage: 0, fixed: 0 };
    const percentageFee = (amount * feeStructure.percentage) / 100;
    const totalFee = percentageFee + feeStructure.fixed;
    const amountAfterFee = amount - totalFee;
    return { fee: totalFee, amountAfterFee };
}

// Helper function to convert USDT to BDT
function convertUSDTtoBDT(usdtAmount: number): number {
    return usdtAmount * USD_TO_BDT_RATE;
}

// Helper function to convert BDT to USDT
function convertBDTtoUSDT(bdtAmount: number): number {
    return bdtAmount / USD_TO_BDT_RATE;
}

// Helper function to validate Bangladeshi phone number
function validateBangladeshiPhoneNumber(number: string): boolean {
    // Remove any non-digit characters
    const cleanNumber = number.replace(/\D/g, '');
    
    // Handle both local (01) and international (+880) formats
    let localFormat = cleanNumber;
    if (cleanNumber.startsWith('880')) {
        localFormat = cleanNumber.slice(3); // Remove 880 prefix
    }

    // Check if it starts with 0
    if (localFormat.startsWith('0')) {
        localFormat = localFormat.slice(1); // Remove leading 0
    }
    
    // Now the number should be just 10 digits starting with 1
    if (localFormat.length !== 10 || !localFormat.startsWith('1')) {
        return false;
    }

    // Check if it starts with valid Bangladesh operator codes
    const validPrefixes = ['13', '14', '15', '16', '17', '18', '19'];
    const prefix = localFormat.substring(0, 2);
    
    return validPrefixes.includes(prefix);
}

// Helper function to validate crypto address
function validateCryptoAddress(address: string, method: string): boolean {
    const addressRegex = {
        bitget: /^[0-9a-zA-Z]{34,42}$/,
        binance: /^0x[0-9a-fA-F]{40}$/
    };

    if (method === 'bitget' || method === 'binance') {
        return addressRegex[method].test(address);
    }

    return true; // For non-crypto methods
}
export async function GET() {
    try {

        await dbConnect();

        const session: any = await getServerSession(authOptions);

        console.log(session);
        if (session.user?.role === 'admin') {
            const withdrawals = await WithdrawalHistory.find({}).sort({ createdAt: -1 });
            const withdrawalsWithConversion = withdrawals.map(w => ({
                ...w._doc,
                bdtAmount: w.method.toLowerCase() === 'bkash' || w.method.toLowerCase() === 'nagad'
                    ? w.amount
                    : convertUSDTtoBDT(w.amount)
            }));
            return NextResponse.json({ result: withdrawalsWithConversion });
        }


        if (session && session.user?.role === 'user') {
            const withdrawals = await WithdrawalHistory.find({ telegramId : session.user.telegramId }).sort({ createdAt: -1 });
            const withdrawalsWithConversion = withdrawals.map(w => ({
                ...w._doc,
                bdtAmount: w.method.toLowerCase() === 'bkash' || w.method.toLowerCase() === 'nagad'
                    ? w.amount
                    : convertUSDTtoBDT(w.amount)
            }));

            return NextResponse.json({ result: withdrawalsWithConversion });
        }



    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        await dbConnect();

        const data = await req.json();
        const { method, amount, recipient, network } = data;

        // Validate required fields
        if (!method || !amount || !recipient) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Parse amount as float and validate
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            return NextResponse.json(
                { error: 'Invalid amount' },
                { status: 400 }
            );
        }

        // Validate recipient based on method
        if (method === 'bkash' || method === 'nagad' || method === 'rocket') {
            if (!validateBangladeshiPhoneNumber(recipient)) {
                return NextResponse.json(
                    { error: 'Invalid phone number format' },
                    { status: 400 }
                );
            }
        } else if (!validateCryptoAddress(recipient, method)) {
            return NextResponse.json(
                { error: 'Invalid wallet address' },
                { status: 400 }
            );
        }

        const isCryptoPayment = !['bkash', 'nagad', 'rocket'].includes(method.toLowerCase());
        const amountInUSDT = isCryptoPayment ? numAmount : convertBDTtoUSDT(numAmount);

        // Calculate fees
        const { fee, amountAfterFee } = calculateFee(
            isCryptoPayment ? numAmount : convertBDTtoUSDT(numAmount),
            method
        );

        // Validate amount based on payment method ..
        if (isCryptoPayment) {
            if (amountInUSDT < MIN_CRYPTO_AMOUNT) {
                return NextResponse.json(
                    { error: `Minimum withdrawal amount is ${MIN_CRYPTO_AMOUNT} USDT` },
                    { status: 400 }
                );
            }
            if (amountInUSDT > MAX_CRYPTO_AMOUNT) {
                return NextResponse.json(
                    { error: `Maximum withdrawal amount is ${MAX_CRYPTO_AMOUNT} USDT` },
                    { status: 400 }
                );
            }
        } else {
            if (numAmount < MIN_BDT_AMOUNT) {
                return NextResponse.json(
                    { error: `Minimum withdrawal amount is ${MIN_BDT_AMOUNT} BDT` },
                    { status: 400 }
                );
            }
            if (numAmount > MAX_BDT_AMOUNT) {
                return NextResponse.json(
                    { error: `Maximum withdrawal amount is ${MAX_BDT_AMOUNT} BDT` },
                    { status: 400 }
                );
            }
        }

        const user = await User.findOne({ telegramId : session.user.telegramId })
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
     

        // Check if user has sufficient balance (including fee)
        if (user.balance < (amountInUSDT + fee)) {
            return NextResponse.json(
                { error: 'Insufficient balance to cover amount and fees' },
                { status: 400 }
            );
        }

        // Create withdrawal history record
        const withdrawal = await WithdrawalHistory.create({
            telegramId: user.telegramId,
            userId: user._id,
            activityType: 'withdrawal_request',
            amount: amountInUSDT,
            method,
            recipient,
            status: 'pending',
            description: `Withdrawal request of ${numAmount} ${isCryptoPayment ? 'USDT' : 'BDT'} via ${method}`,
            metadata: {
                ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
                deviceInfo: req.headers.get('user-agent'),
                network,
                originalAmount: numAmount,
                currency: isCryptoPayment ? 'USDT' : 'BDT',
                fee,
                amountAfterFee,
                feeType: isCryptoPayment ? 'fixed' : 'percentage'
            }
        });

        // Update user balance (in USDT, including fee)
        await User.findOneAndUpdate({ telegramId : session.user.telegramId  }, {
            $inc: { balance: -(amountInUSDT + fee) }
        }, { new: true });

        return NextResponse.json({
            message: 'Withdrawal request submitted successfully',
            withdrawal: {
                ...withdrawal.toObject(),
                fee,
                amountAfterFee,
                bdtAmount: isCryptoPayment ? convertUSDTtoBDT(amountInUSDT) : numAmount,
                bdtFee: isCryptoPayment ? convertUSDTtoBDT(fee) : (fee * USD_TO_BDT_RATE)
            }
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || !session.user.isAdmin) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const { withdrawalId, status, reason } = data;

        if (!withdrawalId || !status || !['approved', 'rejected'].includes(status)) {
            return NextResponse.json({ error: 'Invalid request data' }, { status: 400 });
        }

        const withdrawal = await WithdrawalHistory.findById(withdrawalId);
        if (!withdrawal) {
            return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
        }

        if (withdrawal.status !== 'pending') {
            return NextResponse.json({ error: 'Can only update pending withdrawals' }, { status: 400 });
        }

        // Update withdrawal status
        withdrawal.status = status;
        await withdrawal.save();

        // Create withdrawal history record
        await WithdrawalHistory.create({
            telegramId: withdrawal.telegramId,
            activityType: status === 'approved' ? 'withdrawal_approved' : 'withdrawal_rejected',
            amount: withdrawal.amount,
            method: withdrawal.method,
            recipient: withdrawal.recipient,
            status,
            description: status === 'approved' 
                ? `Withdrawal request approved for ${withdrawal.amount} USDT via ${withdrawal.method}`
                : `Withdrawal request rejected for ${withdrawal.amount} USDT via ${withdrawal.method}`,
            metadata: {
                adminId: session.user._id,
                reason,
                ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
                deviceInfo: req.headers.get('user-agent')
            }
        });

        // If rejected, refund the amount
        if (status === 'rejected') {
            await User.findByIdAndUpdate(withdrawal.userId, {
                $inc: { balance: withdrawal.amount }
            });
        }
   

 



        return NextResponse.json({
            message: `Withdrawal ${status} successfully`,
            withdrawal: withdrawal.toObject()
        });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        if (!id) {
            return NextResponse.json({ error: 'Missing withdrawal ID' }, { status: 400 });
        }

        const withdrawal = await WithdrawalHistory.findById(id).populate('userId', 'telegramId');
        if (!withdrawal) {
            return NextResponse.json({ error: 'Withdrawal not found' }, { status: 404 });
        }

        if (withdrawal.status !== 'pending') {
            return NextResponse.json({ error: 'Can only cancel pending withdrawals' }, { status: 400 });
        }

        // Create withdrawal history record for cancellation
        await WithdrawalHistory.create({
            telegramId: withdrawal.telegramId,
            activityType: 'withdrawal_rejected',
            amount: withdrawal.amount,
            method: withdrawal.method,
            recipient: withdrawal.recipient,
            status: 'rejected',
            description: `Withdrawal request cancelled by user for ${withdrawal.amount} USDT via ${withdrawal.method}`,
            metadata: {
                reason: 'User cancelled withdrawal',
                ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
                deviceInfo: req.headers.get('user-agent')
            }
        });

        // Refund the USDT amount to user's balance
        await User.findByIdAndUpdate(withdrawal.userId, {
            $inc: { balance: withdrawal.amount }
        });

        await WithdrawalHistory.findByIdAndDelete(id);

        return NextResponse.json({
            message: 'Withdrawal cancelled successfully',
            refundedAmount: withdrawal.amount,
            refundedAmountBDT: convertUSDTtoBDT(withdrawal.amount)
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to cancel withdrawal' }, { status: 500 });
    }
} 
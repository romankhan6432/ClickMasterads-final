import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import User from '@/models/User';
import Withdrawal from '@/app/[lang]/models/Withdrawal';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';

// Constants
const CRYPTO_WITHDRAWAL_COOLDOWN_HOURS = 24; // 24 hours between crypto withdrawals
const MOBILE_BANKING_COOLDOWN_HOURS = 12; // 12 hours between mobile banking withdrawals

export async function GET(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const user = await User.findById(session.user._id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Get the user's latest withdrawals by method type
        const latestCryptoWithdrawal = await Withdrawal.findOne({
            userId: user._id,
            method: { $in: ['bitget', 'binance'] }
        }).sort({ createdAt: -1 });

        const latestMobileBankingWithdrawal = await Withdrawal.findOne({
            userId: user._id,
            method: { $in: ['bkash', 'nagad'] }
        }).sort({ createdAt: -1 });

        const now = new Date();
        const timing = {
            crypto: {
                lastWithdrawal: null as string | null,
                nextWithdrawal: null as string | null,
                canWithdraw: true
            },
            mobileBanking: {
                lastWithdrawal: null as string | null,
                nextWithdrawal: null as string | null,
                canWithdraw: true
            }
        };

        // Calculate timing for crypto withdrawals
        if (latestCryptoWithdrawal) {
            timing.crypto.lastWithdrawal = latestCryptoWithdrawal.createdAt.toISOString();
            
            const nextCryptoWithdrawalTime = new Date(latestCryptoWithdrawal.createdAt);
            nextCryptoWithdrawalTime.setHours(nextCryptoWithdrawalTime.getHours() + CRYPTO_WITHDRAWAL_COOLDOWN_HOURS);
            
            if (nextCryptoWithdrawalTime > now) {
                timing.crypto.nextWithdrawal = nextCryptoWithdrawalTime.toISOString();
                timing.crypto.canWithdraw = false;
            }
        }

        // Calculate timing for mobile banking withdrawals
        if (latestMobileBankingWithdrawal) {
            timing.mobileBanking.lastWithdrawal = latestMobileBankingWithdrawal.createdAt.toISOString();
            
            const nextMobileBankingWithdrawalTime = new Date(latestMobileBankingWithdrawal.createdAt);
            nextMobileBankingWithdrawalTime.setHours(nextMobileBankingWithdrawalTime.getHours() + MOBILE_BANKING_COOLDOWN_HOURS);
            
            if (nextMobileBankingWithdrawalTime > now) {
                timing.mobileBanking.nextWithdrawal = nextMobileBankingWithdrawalTime.toISOString();
                timing.mobileBanking.canWithdraw = false;
            }
        }

        return NextResponse.json(timing);
    } catch (error: any) {
        console.error('Error fetching withdrawal timing:', error);
        return NextResponse.json(
            { error: error.message || 'Failed to fetch withdrawal timing' },
            { status: 500 }
        );
    }
}

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import dbConnect from '@/lib/dbConnect';
 
import { getToken } from 'next-auth/jwt';
import { cookies } from 'next/headers';
import SecurityViolation from '@/app/[lang]/models/SecurityViolation';

export async function POST(req: NextRequest) {
    try {
        const cookieStore = cookies();
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET
        });

        if (!token?.sub) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = token.sub;

        const body = await req.json();
        const { type, severity, details } = body;

        await dbConnect();

        // Find existing violation record for today
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let violation = await SecurityViolation.findOne({
            userId,
            type,
            createdAt: { $gte: today }
        });

        if (violation) {
            // Update existing violation
            violation.severity = severity;
            violation.details.push(details);
            await violation.save();
        } else {
            // Create new violation record
            violation = await SecurityViolation.create({
                userId,
                type,
                severity,
                details: [details]
            });
        }

        return NextResponse.json(violation);
    } catch (error) {
        console.error('Security violation error:', error);
        return NextResponse.json(
            { error: 'Failed to process security check' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const cookieStore = cookies();
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET
        });

        if (!token?.sub) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = token.sub;

        const { searchParams } = new URL(req.url);
        const days = parseInt(searchParams.get('days') || '7');

        await dbConnect();

        const date = new Date();
        date.setDate(date.getDate() - days);

        const violations = await SecurityViolation.find({
            userId,
            createdAt: { $gte: date }
        })
        .sort({ createdAt: -1 })
        .limit(100);

        return NextResponse.json(violations);
    } catch (error) {
        console.error('Security violation fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch security violations' },
            { status: 500 }
        );
    }
}

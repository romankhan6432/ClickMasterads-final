import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Achievement from '@/app/[lang]/models/Achievement';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import User from '@/models/User';

// Achievement definitions
const ACHIEVEMENTS = {
    FIRST_AD: {
        name: 'First Click',
        description: 'Watch your first advertisement',
        type: 'ads_watched',
        maxProgress: 1
    },
    AD_MASTER: {
        name: 'Ad Master',
        description: 'Watch 100 advertisements',
        type: 'ads_watched',
        maxProgress: 100
    },
    FIRST_WITHDRAWAL: {
        name: 'First Withdrawal',
        description: 'Make your first withdrawal',
        type: 'withdrawal_made',
        maxProgress: 1
    },
    WITHDRAWAL_PRO: {
        name: 'Withdrawal Pro',
        description: 'Make 5 successful withdrawals',
        type: 'withdrawal_made',
        maxProgress: 5
    },
    DAILY_STREAK: {
        name: 'Daily Streak',
        description: 'Complete daily goals for 7 days',
        type: 'daily_goal',
        maxProgress: 7
    },
    REFERRAL_MASTER: {
        name: 'Referral Master',
        description: 'Invite 5 friends to join',
        type: 'referral',
        maxProgress: 5
    }
};

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

        // Get user's achievements
        const achievements = await Achievement.find({ userId: user._id });

        // Initialize missing achievements
        const existingAchievements = achievements.reduce((acc: any, achievement) => {
            acc[achievement.name] = achievement;
            return acc;
        }, {});

        // Create any missing achievements
        const achievementPromises = Object.values(ACHIEVEMENTS).map(async (achievement: any) => {
            if (!existingAchievements[achievement.name]) {
                return Achievement.create({
                    userId: user._id,
                    name: achievement.name,
                    description: achievement.description,
                    type: achievement.type,
                    maxProgress: achievement.maxProgress,
                    progress: 0,
                    completed: false
                });
            }
            return null;
        });

        await Promise.all(achievementPromises.filter(Boolean));

        // Get updated achievements
        const updatedAchievements = await Achievement.find({ userId: user._id });

        return NextResponse.json({
            achievements: updatedAchievements
        });
    } catch (error: any) {
        console.error('Error in GET /api/achievements:', error);
        return NextResponse.json(
            { error: 'Failed to fetch achievements' },
            { status: 500 }
        );
    }
}

export async function PUT(req: Request) {
    try {
        const session: any = await getServerSession(authOptions);
        if (!session || !session.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { type, progress } = body;

        await dbConnect();

        const user = await User.findById(session.user._id);
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Update achievements of the specified type
        const achievements = await Achievement.find({
            userId: user._id,
            type: type
        });

        for (const achievement of achievements) {
            if (!achievement.completed && achievement.maxProgress) {
                const newProgress = Math.min(progress, achievement.maxProgress);
                achievement.progress = newProgress;
                
                if (newProgress >= achievement.maxProgress) {
                    achievement.completed = true;
                    achievement.completedAt = new Date();
                }
                
                await achievement.save();
            }
        }

        return NextResponse.json({
            message: 'Achievements updated successfully',
            achievements: await Achievement.find({ userId: user._id })
        });
    } catch (error: any) {
        console.error('Error in PUT /api/achievements:', error);
        return NextResponse.json(
            { error: 'Failed to update achievements' },
            { status: 500 }
        );
    }
}

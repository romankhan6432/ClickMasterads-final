import mongoose, { Document } from 'mongoose';

export interface IAchievement extends Document {
    userId: mongoose.Types.ObjectId;
    name: string;
    description: string;
    completed: boolean;
    completedAt?: Date;
    progress?: number;
    maxProgress?: number;
    type: 'ads_watched' | 'withdrawal_made' | 'daily_goal' | 'referral';
    createdAt: Date;
}

const achievementSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Date
    },
    progress: {
        type: Number,
        default: 0
    },
    maxProgress: {
        type: Number
    },
    type: {
        type: String,
        enum: ['ads_watched', 'withdrawal_made', 'daily_goal', 'referral'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Achievement = mongoose.models.Achievement || mongoose.model<IAchievement>('Achievement', achievementSchema);

export default Achievement;

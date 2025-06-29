import mongoose, { Schema } from 'mongoose';

export interface ITopEarner {
    name: string;
    avatar: string;
    totalEarnings: number;
    adsWatched: number;
    rank: number;
    country: string; // ISO 2-letter country code (e.g., 'BD', 'US')
    lastActive: Date;
    userId: string;
    timeframe: 'today' | 'week' | 'month' | 'all';
}

const topEarnerSchema = new Schema<ITopEarner>({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    avatar: {
        type: String,
        default: '' // Will use Ant Design's fallback icon if empty
    },
    totalEarnings: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    adsWatched: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    rank: {
        type: Number,
        required: true,
        min: 1
    },
    country: {
        type: String,
        required: true,
        default: 'BD', // Default to Bangladesh
        minlength: 2,
        maxlength: 2,
        uppercase: true
    },
    lastActive: {
        type: Date,
        required: true,
        default: Date.now
    },
    userId: {
        type: String,
        required: true,
        index: true
    },
    timeframe: {
        type: String,
        enum: ['today', 'week', 'month', 'all'],
        required: true,
        default: 'all'
    }
}, {
    timestamps: true
});

// Create compound indexes for efficient querying
topEarnerSchema.index({ timeframe: 1, totalEarnings: -1 });
topEarnerSchema.index({ userId: 1, timeframe: 1 }, { unique: true });

export const TopEarner = mongoose.models.TopEarner || mongoose.model<ITopEarner>('TopEarner', topEarnerSchema);

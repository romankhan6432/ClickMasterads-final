import mongoose, { Schema, Document } from 'mongoose';

export interface ISecurityViolation extends Document {
    userId: string;
    type: 'AUTO_CLICKER' | 'SCRIPT' | 'RAPID_CLICKING';
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    details: {
        clickInterval: number;
        patternMatch: number;
        clickCount: number;
        timestamp: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}

const SecurityViolationSchema: Schema = new Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    type: {
        type: String,
        enum: ['AUTO_CLICKER', 'SCRIPT', 'RAPID_CLICKING'],
        required: true
    },
    severity: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        required: true
    },
    details: [{
        clickInterval: Number,
        patternMatch: Number,
        clickCount: Number,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
}, {
    timestamps: true
});

// Create compound index for efficient querying
SecurityViolationSchema.index({ userId: 1, type: 1, createdAt: -1 });

export default mongoose.models.SecurityViolation || 
       mongoose.model<ISecurityViolation>('SecurityViolation', SecurityViolationSchema);

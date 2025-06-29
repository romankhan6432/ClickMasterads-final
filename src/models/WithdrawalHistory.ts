import mongoose from 'mongoose';

export interface IWithdrawalHistory {
    telegramId: string;
    activityType: 'withdrawal_request' | 'withdrawal_approved' | 'withdrawal_rejected';
    amount: number;
    method: 'bkash' | 'nagad' | 'bitget' | 'binance';
    recipient: string;
    status: 'pending' | 'approved' | 'rejected';
    description: string;
    metadata?: {
        ipAddress?: string;
        deviceInfo?: string;
        adminId?: string;
        reason?: string;
        [key: string]: any;
    };
    createdAt: Date;
}

const withdrawalHistorySchema = new mongoose.Schema<IWithdrawalHistory>({
    telegramId: {
        type: String,
        required: true,
        index: true
    },
    activityType: {
        type: String,
        required: true,
        enum: ['withdrawal_request', 'withdrawal_approved', 'withdrawal_rejected'],
        index: true
    },
    amount: {
        type: Number,
        required: true
    },
    method: {
        type: String,
        required: true,
        enum: ['bkash', 'nagad', 'bitget', 'binance']
    },
    recipient: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['pending', 'approved', 'rejected']
    },
    description: {
        type: String,
        required: true
    },
    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
});

// Create indexes for common queries
withdrawalHistorySchema.index({ telegramId: 1, createdAt: -1 });
withdrawalHistorySchema.index({ status: 1, createdAt: -1 });

const WithdrawalHistory = mongoose.models.WithdrawalHistory || mongoose.model<IWithdrawalHistory>('WithdrawalHistory', withdrawalHistorySchema);

export default WithdrawalHistory; 
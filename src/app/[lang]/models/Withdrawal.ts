import mongoose, { Document } from 'mongoose';

export interface IWithdrawal extends Document {
    userId: mongoose.Types.ObjectId;
    method: 'bkash' | 'nagad' | 'bitget' | 'binance';
    amount: number;
    recipient: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Date;
}

const withdrawalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    method: {
        type: String,
        required: true,
        enum: ['bkash', 'nagad', 'bitget', 'binance']
    },
    amount: {
        type: Number,
        required: true,
        min: 0.002
    },
    recipient: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Withdrawal = mongoose.models.Withdrawal || mongoose.model<IWithdrawal>('Withdrawal', withdrawalSchema);

export default Withdrawal;

import mongoose, { Schema, Document } from 'mongoose';

export interface INetwork {
    id: string;
    name: string;
    symbol: string;
    icon: string;
    fee: number;
    minWithdraw: number;
    maxWithdraw: number;
}

export interface IWithdrawalMethod extends Document {
    id: string;
    symbol: string;
    name: string;
    icon: string;
    networks: INetwork[];
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
}

const networkSchema = new Schema<INetwork>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    icon: { type: String, required: true },
    fee: { type: Number, required: true },
    minWithdraw: { type: Number, required: true },
    maxWithdraw: { type: Number, required: true }
});

const withdrawalMethodSchema = new Schema<IWithdrawalMethod>({
    id: { 
        type: String, 
        required: true,
        unique: true
    },
    symbol: { 
        type: String, 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    icon: { 
        type: String, 
        required: true 
    },
    networks: [networkSchema],
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    }
}, {
    timestamps: true
});

// Create indexes for better query performance
withdrawalMethodSchema.index({ status: 1 });
withdrawalMethodSchema.index({ symbol: 1 });

const WithdrawalMethod = mongoose.models.WithdrawalMethod || mongoose.model<IWithdrawalMethod>('WithdrawalMethod', withdrawalMethodSchema);

export default WithdrawalMethod; 
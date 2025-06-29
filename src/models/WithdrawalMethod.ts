import mongoose, { Schema, Document } from 'mongoose';

export interface IWithdrawalMethod extends Document {
  id: string;
  name: string;
  supportedCoins: string[];
  icon: string;
  active: boolean;
  fee: string;
  estimatedTime: string;
  category: 'Mobile Banking' | 'Crypto';
  minAmount: number;
  maxAmount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const withdrawalMethodSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  supportedCoins: [{
    type: String,
    required: true,
  }],
  icon: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  fee: {
    type: String,
    required: true,
  },
  estimatedTime: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Mobile Banking', 'Crypto'],
    required: true,
  },
  minAmount: {
    type: Number,
    required: true,
  },
  maxAmount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  }
}, {
  timestamps: true,
});

export const WithdrawalMethod = mongoose.models.WithdrawalMethod || mongoose.model<IWithdrawalMethod>('WithdrawalMethod', withdrawalMethodSchema);

export default WithdrawalMethod; 
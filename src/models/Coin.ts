import mongoose, { Schema, Document } from 'mongoose';

export interface ICoin extends Document {
  id: string;
  name: string;
  symbol: string;
  icon: string;
  active: boolean;
  minAmount: number;
  maintenanceMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

const coinSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  symbol: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  minAmount: {
    type: Number,
    required: true,
  },
  maintenanceMessage: {
    type: String,
  }
}, {
  timestamps: true,
});

export const Coin = mongoose.models.Coin || mongoose.model<ICoin>('Coin', coinSchema);

export default Coin; 
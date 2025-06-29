import { Schema, model, Document } from 'mongoose';

// Define the crypto balance interface
export interface CryptoBalance {
  symbol: string;
  amount: number;
  usdValue: number;
}

// Define the wallet interface
export interface IWallet extends Document {
  userId: Schema.Types.ObjectId;
  address: string;
  balances: CryptoBalance[];
  totalUsdValue: number;
  createdAt: Date;
  updatedAt: Date;
}

// Create the wallet schema
const walletSchema = new Schema<IWallet>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
      unique: true,
    },
    balances: [
      {
        symbol: {
          type: String,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
          default: 0,
        },
        usdValue: {
          type: Number,
          required: true,
          default: 0,
        },
      },
    ],
    totalUsdValue: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the Wallet model
const Wallet = model<IWallet>('Wallet', walletSchema);

export default Wallet; 
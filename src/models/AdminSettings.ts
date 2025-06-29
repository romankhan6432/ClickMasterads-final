import mongoose, { Schema, Document } from 'mongoose';

export interface IAdminSettings extends Document {
  bot: {
    token: string;
    username: string;
    adminChatId: string;
  };
  smtp: {
    host: string;
    port: number;
    username: string;
    password: string;
    secure: boolean;
  };
  site: {
    name: string;
    contactEmail: string;
    minWithdrawal: number;
  };
  notifications: {
    email: boolean;
    withdrawal: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AdminSettingsSchema = new Schema({
  bot: {
    token: { type: String, default: '' },
    username: { type: String, default: '' },
    adminChatId: { type: String, default: '' }
  },
  smtp: {
    host: { type: String, default: '' },
    port: { type: Number, default: 0 },
    username: { type: String, default: '' },
    password: { type: String, default: '' },
    secure: { type: Boolean, default: false }
  },
  site: {
    name: { type: String, default: '' },
    contactEmail: { type: String, default: '' },
    minWithdrawal: { type: Number, default: 0 }
  },
  notifications: {
    email: { type: Boolean, default: false },
    withdrawal: { type: Boolean, default: false }
  }
}, {
  timestamps: true
});

export default mongoose.models.AdminSettings || mongoose.model<IAdminSettings>('AdminSettings', AdminSettingsSchema); 
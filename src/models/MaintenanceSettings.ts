import mongoose, { Schema, Document } from 'mongoose';

export interface IMaintenanceSettings extends Document {
  isEnabled: boolean;
  message: string;
  allowedIps: string[];
  startTime: Date;
  endTime: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MaintenanceSettingsSchema = new Schema({
  isEnabled: { type: Boolean, default: false },
  message: { type: String, default: 'We are currently performing scheduled maintenance. Please check back later.' },
  allowedIps: [{ type: String }],
  startTime: { type: Date },
  endTime: { type: Date },
}, {
  timestamps: true
});

export default mongoose.models.MaintenanceSettings || mongoose.model<IMaintenanceSettings>('MaintenanceSettings', MaintenanceSettingsSchema); 
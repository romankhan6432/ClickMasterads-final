import mongoose, { Schema } from 'mongoose';

export interface IMessage {
    text: string;
    sender: 'user' | 'support';
    userId: string;
    userName: string;
    timestamp: Date;
    status: 'sent' | 'delivered' | 'read';
}

const messageSchema = new Schema<IMessage>({
    text: {
        type: String,
        required: [true, 'Message text is required'],
        trim: true,
    },
    sender: {
        type: String,
        enum: ['user', 'support'],
        required: [true, 'Sender type is required'],
    },
    userId: {
        type: String,
        required: [true, 'User ID is required'],
        index: true,
    },
    userName: {
        type: String,
        required: [true, 'User name is required'],
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['sent', 'delivered', 'read'],
        default: 'sent',
    },
}, {
    timestamps: true,
});

// Create indexes for better query performance
messageSchema.index({ timestamp: -1 });
messageSchema.index({ userId: 1, timestamp: -1 });

export const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);

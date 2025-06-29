import mongoose from 'mongoose';

const clickHistorySchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        index: true
    },
    linkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DirectLink',
        required: true,
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    clientTimestamp: {
        type: Number,
        required: true,
        index: true
    },
    reward: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['success', 'failed'],
        default: 'success'
    },
    ipAddress: String,
    userAgent: String,
    errorMessage: String
}, {
    timestamps: true
});

// Compound index for faster duplicate checks
clickHistorySchema.index({ userId: 1, linkId: 1, clientTimestamp: 1 }, { unique: true });

// TTL index to automatically delete old records after 30 days
clickHistorySchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 24 * 60 * 60 });

const ClickHistory = mongoose.models.ClickHistory || mongoose.model('ClickHistory', clickHistorySchema);

export default ClickHistory; 
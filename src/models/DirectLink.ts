import mongoose from 'mongoose';

const directLinkSchema = new mongoose.Schema({
    url: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        default: null
    },
    clicks: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    userId: {
        type: String, 
        required: true,
    },
    rewardPerClick: {
        type: Number,
        default: 0.01,
        min: 0,
        get: (v: number) => Number(v.toFixed(3)),
        set: (v: number) => Number(v.toFixed(3))
    },
    totalEarnings: {
        type: Number,
        default: 0,
        min: 0,
        get: (v: number) => Number(v.toFixed(2)),
        set: (v: number) => Number(v.toFixed(2))
    }
}, {
    timestamps: true,
    toJSON: { getters: true },
    toObject: { getters: true }
});

// Add indexes
directLinkSchema.index({ userId: 1 });
directLinkSchema.index({ createdAt: -1 });

// Pre-save middleware to calculate total earnings
directLinkSchema.pre('save', function(next) {
    if (this.isModified('clicks') || this.isModified('rewardPerClick')) {
        this.totalEarnings = Number((this.clicks * this.rewardPerClick).toFixed(2));
    }
    next();
});

export const DirectLink = mongoose.models.DirectLink || mongoose.model('DirectLink', directLinkSchema);

export default DirectLink;

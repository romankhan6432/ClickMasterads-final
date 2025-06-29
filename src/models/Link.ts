import mongoose from 'mongoose';

const linkSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

linkSchema.pre('save', function(next) {
    this.updatedAt = new Date();
    next();
});

const Link = mongoose.models.Link || mongoose.model('Link', linkSchema);

export default Link;

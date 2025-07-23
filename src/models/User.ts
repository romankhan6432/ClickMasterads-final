import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
    fullName: string;
    telegramId: string;
    status: 'active' | 'inactive';
    username?: string;
    email: string;
    password: string;
    role: 'admin' | 'moderator' | 'user';
    balance: number;
    totalEarnings: number;
    lastWatchTime: Date | null;
    adsWatched: number;
    lastResetDate: Date | null;
    createdAt: Date;
    updatedAt: Date;
    // Device and IP tracking
    deviceId?: string;
    ipAddress?: string;
    lastLoginIp?: string;
    lastLoginDevice?: string;
    // Referral system
    referralCode: string;
    referredBy?: mongoose.Types.ObjectId;
    referralCount: number;
    referrals: mongoose.Types.ObjectId[];
}

interface IUserMethods {
    shouldResetDaily(): boolean;
    resetDaily(): boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

type UserModel = mongoose.Model<IUser, {}, IUserMethods>;
type UserDocument = mongoose.Document<unknown, {}, IUser> & IUser & IUserMethods;

const userSchema = new mongoose.Schema<IUser, UserModel, IUserMethods>({
    // New fields
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true,
        minlength: [3, 'Full name must be at least 3 characters']
    },
    telegramId: {
        type: String,
        required: [true, 'Telegram ID is required'],
        unique: true,
        trim: true,
        match: [/^@?[\w\d_]{5,32}$/, 'Please enter a valid Telegram ID']
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        default: 'Roman1234',
        validate: {
            validator: function(v: string) {
                // m 6 characters
                return v.length >= 6;
            },
            message: 'Password must be at least 6 characters long'
        }
    },

    // Legacy fields maintained for compatibility
    username: {
        type: String,
        default: null
    },
    email: {
        type: String,
        default : null
    },
    role: {
        type: String,
        enum: ['admin', 'moderator', 'user'],
        default: 'user',
    },
    balance: {
        type: Number,
        default: 0
    },
    totalEarnings: {
        type: Number,
        default: 0
    },
    lastWatchTime: {
        type: Date,
        default: null
    },
    adsWatched: {
        type: Number,
        default: 0
    },
    lastResetDate: {
        type: Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    // Device and IP tracking fields
    deviceId: {
        type: String,
        default: null
    },
    ipAddress: {
        type: String,
        default: null
    },
    lastLoginIp: {
        type: String,
        default: null
    },
    lastLoginDevice: {
        type: String,
        default: null
    },
    // Referral system fields
    referralCode: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    referredBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    referralCount: {
        type: Number,
        default: 0
    },
    referrals: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
});

// Middleware to ensure username is set from fullName if not provided
userSchema.pre('save', function(this: UserDocument, next) {
    if (!this.username && this.fullName) {
        this.username = this.fullName.toLowerCase().replace(/\s+/g, '_');
    }
    next();
});

// Middleware to hash password before saving
userSchema.pre('save', async function(this: UserDocument, next) {
    // Only hash the password if it has been modified or is new
    if (!this.isModified('password')) return next();

    try {
        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error as Error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Update timestamps on save
userSchema.pre('save', function(this: UserDocument, next) {
    this.updatedAt = new Date();
    if (!this.createdAt) {
        this.createdAt = new Date();
    }
    next();
});

const User = mongoose.models.User || mongoose.model<IUser, UserModel>('User', userSchema);

export default User;
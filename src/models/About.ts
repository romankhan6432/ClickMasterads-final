import mongoose, { Schema } from 'mongoose';

export interface IFeature {
    id: string;
    title: string;
    description: string;
    icon: string;
}

export interface IStat {
    label: string;
    value: string;
    icon: string;
}

export interface IPlatformInfo {
    title: string;
    description: string;
    bannerImage: string;
    ctaTitle: string;
    ctaDescription: string;
}

export interface IContact {
    telegram: string;
    email: string;
}

export interface IAbout {
    features: IFeature[];
    stats: IStat[];
    platformInfo: IPlatformInfo;
    contact: IContact;
    lastUpdated: Date;
}

const featureSchema = new Schema<IFeature>({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true }
});

const statSchema = new Schema<IStat>({
    label: { type: String, required: true },
    value: { type: String, required: true },
    icon: { type: String, required: true }
});

const platformInfoSchema = new Schema<IPlatformInfo>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    bannerImage: { type: String, required: true },
    ctaTitle: { type: String, required: true },
    ctaDescription: { type: String, required: true }
});

const contactSchema = new Schema<IContact>({
    telegram: { type: String, required: true },
    email: { type: String, required: true, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
});

const aboutSchema = new Schema<IAbout>({
    features: [featureSchema],
    stats: [statSchema],
    platformInfo: { type: platformInfoSchema, required: true },
    contact: { type: contactSchema, required: true },
    lastUpdated: { type: Date, default: Date.now }
}, {
    timestamps: true
});

export const About = mongoose.models.About || mongoose.model<IAbout>('About', aboutSchema);

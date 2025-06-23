
import mongoose, { Schema, Document, models, Model } from 'mongoose';
import type { User as UserType } from '@/lib/types';

type UserDocument = Omit<UserType, 'id'> & Document & {
    password?: string;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
};

const PortfolioCompanySchema = new Schema({
    name: { type: String, required: true },
    url: { type: String, required: true },
}, { _id: false });

const UserSchema = new Schema<UserDocument>({
    name: {
        type: String,
        required: [true, 'Please provide your name.'],
    },
    email: {
        type: String,
        required: [true, 'Please provide your email.'],
        unique: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address.'],
    },
    password: {
        type: String,
        required: [true, 'Please provide a password.'],
        select: false, // Do not return password by default
    },
    role: {
        type: String,
        enum: ['investor', 'entrepreneur', 'admin'],
        required: [true, 'Please select a role.'],
    },
    avatarUrl: {
        type: String,
        default: 'https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg',
    },
    bio: {
        type: String,
        default: '',
    },
    hasCompletedOnboarding: {
        type: Boolean,
        default: false,
    },
    startupName: {
        type: String,
    },
    startupDescription: {
        type: String,
    },
    fundingNeeds: {
        type: String,
    },
    pitchDeckUrl: {
        type: String,
    },
    investmentInterests: {
        type: [String],
    },
    portfolioCompanies: {
        type: [PortfolioCompanySchema],
    },
    bookmarkedProfiles: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    resetPasswordToken: {
        type: String,
        select: false
    },
    resetPasswordExpires: {
        type: Date,
        select: false
    }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform(doc, ret) {
            delete ret.password;
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
    toObject: {
        virtuals: true,
        transform(doc, ret) {
            delete ret.password;
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

const UserModel: Model<UserDocument> = models.User || mongoose.model<UserDocument>('User', UserSchema);

export default UserModel;

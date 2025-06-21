import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IRequest extends Document {
    investorId: mongoose.Schema.Types.ObjectId;
    entrepreneurId: mongoose.Schema.Types.ObjectId;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
    updatedAt: Date;
}

const RequestSchema = new Schema<IRequest>({
    investorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    entrepreneurId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
    },
}, {
    timestamps: true
});


const RequestModel: Model<IRequest> = models.Request || mongoose.model<IRequest>('Request', RequestSchema);

export default RequestModel;

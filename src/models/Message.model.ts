import mongoose, { Schema, Document, models, Model } from 'mongoose';

export interface IMessage extends Document {
    senderId: mongoose.Schema.Types.ObjectId;
    receiverId: mongoose.Schema.Types.ObjectId;
    message: string;
    createdAt: Date;
    updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>({
    senderId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    receiverId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
}, {
    timestamps: true
});

const MessageModel: Model<IMessage> = models.Message || mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;

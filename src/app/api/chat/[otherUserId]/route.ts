
import dbConnect from '@/lib/db';
import MessageModel from '@/models/Message.model';
import UserModel from '@/models/User.model';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { sendNewMessageEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

// Get messages for a conversation
export async function GET(request: NextRequest, { params }: { params: { otherUserId: string } }) {
    await dbConnect();
    try {
        const token = request.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const currentUserId = decoded.userId;
        const otherUserId = params.otherUserId;

        if (!mongoose.Types.ObjectId.isValid(otherUserId)) {
            return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
        }

        const messages = await MessageModel.find({
            $or: [
                { senderId: currentUserId, receiverId: otherUserId },
                { senderId: otherUserId, receiverId: currentUserId },
            ],
        })
        .sort({ createdAt: 'asc' })
        .populate({ path: 'senderId', model: UserModel, select: 'name avatarUrl _id' })
        .populate({ path: 'receiverId', model: UserModel, select: 'name avatarUrl _id' });

        return NextResponse.json({ success: true, messages }, { status: 200 });

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }
        console.error('Error fetching messages:', error);
        return NextResponse.json({ success: false, message: 'An error occurred while fetching messages.' }, { status: 500 });
    }
}

// Send a message
export async function POST(request: NextRequest, { params }: { params: { otherUserId: string } }) {
    await dbConnect();
    try {
        const token = request.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const senderId = decoded.userId;
        const receiverId = params.otherUserId;

        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ success: false, message: 'Message content is required.' }, { status: 400 });
        }
        
        if (!mongoose.Types.ObjectId.isValid(receiverId)) {
            return NextResponse.json({ success: false, message: 'Invalid user ID' }, { status: 400 });
        }

        const newMessage = new MessageModel({
            senderId,
            receiverId,
            message,
        });

        await newMessage.save();
        
        const populatedMessage = await MessageModel.findById(newMessage._id)
            .populate({ path: 'senderId', model: UserModel, select: 'name avatarUrl _id' })
            .populate({ path: 'receiverId', model: UserModel, select: 'name avatarUrl _id' });
        
        // Send email notification
        const sender = await UserModel.findById(senderId);
        const receiver = await UserModel.findById(receiverId);

        if (sender && receiver && receiver.email) {
            await sendNewMessageEmail(receiver.email, receiver.name, sender.name, sender._id.toString());
        }


        return NextResponse.json({ success: true, message: populatedMessage }, { status: 201 });
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }
        console.error('Error sending message:', error);
        return NextResponse.json({ success: false, message: 'An error occurred while sending the message.' }, { status: 500 });
    }
}

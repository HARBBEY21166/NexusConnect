
import dbConnect from '@/lib/db';
import UserModel from '@/models/User.model';
import MessageModel from '@/models/Message.model';
import RequestModel from '@/models/Request.model';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();
    try {
        const token = request.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string };
        
        if (decoded.role !== 'admin') {
            return NextResponse.json({ success: false, message: 'Forbidden: Access is restricted to administrators.' }, { status: 403 });
        }

        const userIdToDelete = params.id;

        if (!mongoose.Types.ObjectId.isValid(userIdToDelete)) {
            return NextResponse.json({ success: false, message: 'Invalid user ID.' }, { status: 400 });
        }
        
        // Prevent admin from deleting themselves
        if (decoded.userId === userIdToDelete) {
            return NextResponse.json({ success: false, message: 'Admins cannot delete their own account.' }, { status: 400 });
        }

        // Use a transaction to ensure all or nothing deletion
        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            // 1. Delete the user document.
            const deletedUser = await UserModel.findByIdAndDelete(userIdToDelete).session(session);
            if (!deletedUser) {
                throw new Error("User not found.");
            }
            
            // 2. Delete messages sent or received by the user.
            await MessageModel.deleteMany({ $or: [{ senderId: userIdToDelete }, { receiverId: userIdToDelete }] }).session(session);
            
            // 3. Delete collaboration requests involving the user.
            await RequestModel.deleteMany({ $or: [{ investorId: userIdToDelete }, { entrepreneurId: userIdToDelete }] }).session(session);
            
            // 4. Remove them from other users' bookmark lists.
            await UserModel.updateMany(
                { bookmarkedProfiles: userIdToDelete },
                { $pull: { bookmarkedProfiles: userIdToDelete } }
            ).session(session);

            await session.commitTransaction();
            session.endSession();

            return NextResponse.json({ success: true, message: 'User and all associated data deleted successfully.' }, { status: 200 });

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error('Transaction Error deleting user:', error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred during the deletion process.';
            return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
        }

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }
        console.error('Error deleting user:', error);
        return NextResponse.json({ success: false, message: 'An error occurred while deleting the user.' }, { status: 500 });
    }
}

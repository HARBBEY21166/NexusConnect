
import dbConnect from '@/lib/db';
import UserModel from '@/models/User.model';
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
    await dbConnect();
    try {
        const token = request.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const currentUserId = decoded.userId;

        // Fetch all users except the current one
        const users = await UserModel.find({ _id: { $ne: currentUserId } }).select('-password');

        return NextResponse.json({ success: true, users: users.map(u => u.toObject()) }, { status: 200 });

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }
        console.error('Error fetching users:', error);
        return NextResponse.json({ success: false, message: 'An error occurred while fetching users.' }, { status: 500 });
    }
}


import dbConnect from '@/lib/db';
import UserModel from '@/models/User.model';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
    await dbConnect();

    try {
        const token = request.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string };
        const userId = decoded.userId;

        const body = await request.json();

        // Prevent role changes
        delete body.role;
        
        // Convert comma-separated string to array for interests
        if (typeof body.investmentInterests === 'string') {
            body.investmentInterests = body.investmentInterests.split(',').map(item => item.trim()).filter(Boolean);
        }

        const updatedUser = await UserModel.findByIdAndUpdate(userId, body, { new: true });

        if (!updatedUser) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Profile updated successfully', user: updatedUser.toObject() }, { status: 200 });

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }
        console.error('Error updating profile:', error);
        return NextResponse.json({ success: false, message: 'An error occurred while updating the profile.' }, { status: 500 });
    }
}

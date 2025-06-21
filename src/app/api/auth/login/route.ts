
import dbConnect from '@/lib/db';
import UserModel from '@/models/User.model';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { email, password } = await request.json();

        const user = await UserModel.findOne({ email }).select('+password');

        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password!);

        if (!isPasswordCorrect) {
            return NextResponse.json(
                { success: false, message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '1d' }
        );
        
        const userObject = user.toObject();

        return NextResponse.json(
            {
                success: true,
                message: 'Login successful',
                user: userObject,
                token,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error logging in:', error);
        return NextResponse.json(
            { success: false, message: 'An error occurred during login.' },
            { status: 500 }
        );
    }
}

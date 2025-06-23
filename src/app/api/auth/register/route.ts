
import dbConnect from '@/lib/db';
import UserModel from '@/models/User.model';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { name, email, password, role } = await request.json();

        const existingUser = await UserModel.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { success: false, message: 'User with this email already exists.' },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            role,
        });

        await newUser.save();

        return NextResponse.json(
            { success: true, message: 'User registered successfully.' },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error registering user:', error);
        return NextResponse.json(
            { success: false, message: 'An error occurred while registering the user.' },
            { status: 500 }
        );
    }
}

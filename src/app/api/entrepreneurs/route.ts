
import dbConnect from '@/lib/db';
import UserModel from '@/models/User.model';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    await dbConnect();

    try {
        const entrepreneurs = await UserModel.find({ role: 'entrepreneur' });
        
        return NextResponse.json({ success: true, entrepreneurs: entrepreneurs.map(e => e.toObject()) }, { status: 200 });
    } catch (error) {
        console.error('Error fetching entrepreneurs:', error);
        return NextResponse.json(
            { success: false, message: 'An error occurred while fetching entrepreneurs.' },
            { status: 500 }
        );
    }
}

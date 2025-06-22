
import dbConnect from '@/lib/db';
import UserModel from '@/models/User.model';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    await dbConnect();

    try {
        const investors = await UserModel.find({ role: 'investor' });
        
        return NextResponse.json({ success: true, investors: investors.map(i => i.toObject()) }, { status: 200 });
    } catch (error) {
        console.error('Error fetching investors:', error);
        return NextResponse.json(
            { success: false, message: 'An error occurred while fetching investors.' },
            { status: 500 }
        );
    }
}

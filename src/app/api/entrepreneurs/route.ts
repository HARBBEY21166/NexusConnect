
import dbConnect from '@/lib/db';
import UserModel from '@/models/User.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');

        const query: any = { role: 'entrepreneur' };

        if (search) {
            const searchRegex = new RegExp(search, 'i'); // case-insensitive
            query.$or = [
                { name: searchRegex },
                { startupName: searchRegex },
                { startupDescription: searchRegex },
                { bio: searchRegex },
            ];
        }

        const entrepreneurs = await UserModel.find(query);
        
        return NextResponse.json({ success: true, entrepreneurs: entrepreneurs.map(e => e.toObject()) }, { status: 200 });
    } catch (error) {
        console.error('Error fetching entrepreneurs:', error);
        return NextResponse.json(
            { success: false, message: 'An error occurred while fetching entrepreneurs.' },
            { status: 500 }
        );
    }
}

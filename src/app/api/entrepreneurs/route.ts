
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

        const entrepreneursFromDB = await UserModel.find(query);
        let entrepreneurs = entrepreneursFromDB.map(e => e.toObject());

        // If the database is empty and there's no active search, fall back to mock data
        if (entrepreneurs.length === 0 && !search) {
            const { users: mockUsers } = await import('@/lib/data');
            entrepreneurs = mockUsers.filter(u => u.role === 'entrepreneur');
        }
        
        return NextResponse.json({ success: true, entrepreneurs }, { status: 200 });
    } catch (error) {
        console.error('Error fetching entrepreneurs:', error);
        return NextResponse.json(
            { success: false, message: 'An error occurred while fetching entrepreneurs.' },
            { status: 500 }
        );
    }
}

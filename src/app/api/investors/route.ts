
import dbConnect from '@/lib/db';
import UserModel from '@/models/User.model';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const interests = searchParams.get('interests');

        const query: any = { role: 'investor' };

        if (search) {
            const searchRegex = new RegExp(search, 'i'); // case-insensitive
            query.$or = [
                { name: searchRegex },
                { bio: searchRegex },
            ];
        }

        if (interests) {
            const interestsArray = interests.split(',').map(item => item.trim()).filter(Boolean);
            if (interestsArray.length > 0) {
                // Use $all to ensure all selected interests are present
                query.investmentInterests = { $all: interestsArray };
            }
        }

        const investorsFromDB = await UserModel.find(query);
        let investors = investorsFromDB.map(i => i.toObject());

        // If the database is empty and there are no filters, fall back to mock data
        if (investors.length === 0 && !search && !interests) {
            const { users: mockUsers } = await import('@/lib/data');
            investors = mockUsers.filter(u => u.role === 'investor');
        }
        
        return NextResponse.json({ success: true, investors }, { status: 200 });
    } catch (error) {
        console.error('Error fetching investors:', error);
        return NextResponse.json(
            { success: false, message: 'An error occurred while fetching investors.' },
            { status: 500 }
        );
    }
}

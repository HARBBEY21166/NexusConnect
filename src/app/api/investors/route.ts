
import dbConnect from '@/lib/db';
import UserModel from '@/models/User.model';
import { NextRequest, NextResponse } from 'next/server';
import { users as mockUsers } from '@/lib/data';

export async function GET(request: NextRequest) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('search');
        const interests = searchParams.get('interests');

        // 1. Fetch all investors from the database
        const investorsFromDB = await UserModel.find({ role: 'investor' });
        const dbInvestors = investorsFromDB.map(i => i.toObject());
        
        // 2. Get mock investors
        const mockInvestors = mockUsers.filter(u => u.role === 'investor');
        
        // 3. Combine DB and mock data, ensuring uniqueness by email
        const combinedMap = new Map();
        // Add DB users first
        dbInvestors.forEach(user => combinedMap.set(user.email, user));
        // Add mock users only if not present
        mockInvestors.forEach(user => {
            if (!combinedMap.has(user.email)) {
                combinedMap.set(user.email, user);
            }
        });

        let allInvestors = Array.from(combinedMap.values());

        // 4. Apply search filter if present
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            allInvestors = allInvestors.filter(i => 
                (i.name && searchRegex.test(i.name)) ||
                (i.bio && searchRegex.test(i.bio))
            );
        }

        // 5. Apply interests filter if present
        if (interests) {
            const interestsArray = interests.split(',').map(item => item.trim()).filter(Boolean);
            if (interestsArray.length > 0) {
                allInvestors = allInvestors.filter(i => 
                    i.investmentInterests && interestsArray.every(interest => i.investmentInterests.includes(interest))
                );
            }
        }
        
        return NextResponse.json({ success: true, investors: allInvestors }, { status: 200 });
    } catch (error) {
        console.error('Error fetching investors:', error);
        return NextResponse.json(
            { success: false, message: 'An error occurred while fetching investors.' },
            { status: 500 }
        );
    }
}

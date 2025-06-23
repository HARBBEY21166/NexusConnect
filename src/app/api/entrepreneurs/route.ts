
import dbConnect from '@/lib/db';
import UserModel from '@/models/User.model';
import { NextRequest, NextResponse } from 'next/server';
import { users as mockUsers } from '@/lib/data';

export async function GET(request: NextRequest) {
    await dbConnect();

    try {
        const { searchParams } = new URL(request.url);
        const search = searchParams.get('q');

        // 1. Fetch all entrepreneurs from the database
        const entrepreneursFromDB = await UserModel.find({ role: 'entrepreneur' });
        const dbEntrepreneurs = entrepreneursFromDB.map(e => e.toObject());

        // 2. Get mock entrepreneurs
        const mockEntrepreneurs = mockUsers.filter(u => u.role === 'entrepreneur');
        
        // 3. Combine DB and mock data, ensuring uniqueness by email
        const combinedMap = new Map();
        // Add DB users first, so they take precedence
        dbEntrepreneurs.forEach(user => combinedMap.set(user.email, user));
        // Add mock users only if their email isn't already present
        mockEntrepreneurs.forEach(user => {
            if (!combinedMap.has(user.email)) {
                combinedMap.set(user.email, user);
            }
        });

        let allEntrepreneurs = Array.from(combinedMap.values());

        // 4. Apply search filter if present
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            allEntrepreneurs = allEntrepreneurs.filter(e => 
                (e.name && searchRegex.test(e.name)) || 
                (e.startupName && searchRegex.test(e.startupName)) ||
                (e.startupDescription && searchRegex.test(e.startupDescription)) ||
                (e.bio && searchRegex.test(e.bio))
            );
        }
        
        return NextResponse.json({ success: true, entrepreneurs: allEntrepreneurs }, { status: 200 });
    } catch (error) {
        console.error('Error fetching entrepreneurs:', error);
        return NextResponse.json(
            { success: false, message: 'An error occurred while fetching entrepreneurs.' },
            { status: 500 }
        );
    }
}

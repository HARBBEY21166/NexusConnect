
import dbConnect from '@/lib/db';
import UserModel from '@/models/User.model';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    await dbConnect();

    try {
        const interests = await UserModel.distinct('investmentInterests', { role: 'investor', investmentInterests: { $exists: true, $ne: [] } });
        return NextResponse.json({ success: true, interests }, { status: 200 });
    } catch (error) {
        console.error('Error fetching investment interests:', error);
        return NextResponse.json(
            { success: false, message: 'An error occurred while fetching interests.' },
            { status: 500 }
        );
    }
}

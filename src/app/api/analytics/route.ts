
import dbConnect from '@/lib/db';
import RequestModel from '@/models/Request.model';
import UserModel from '@/models/User.model';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    await dbConnect();

    try {
        const token = request.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string };
        const userId = decoded.userId;
        const userRole = decoded.role;

        let analyticsData = {};

        if (userRole === 'entrepreneur') {
            const requests = await RequestModel.find({ entrepreneurId: userId });
            const totalRequests = requests.length;
            const accepted = requests.filter(r => r.status === 'accepted').length;
            const pending = requests.filter(r => r.status === 'pending').length;
            
            analyticsData = {
                totalRequests,
                accepted,
                pending,
            };

        } else if (userRole === 'investor') {
            const requests = await RequestModel.find({ investorId: userId });
            const totalSent = requests.length;
            const accepted = requests.filter(r => r.status === 'accepted').length;
            const acceptanceRate = totalSent > 0 ? (accepted / totalSent) * 100 : 0;
            
            const user = await UserModel.findById(userId).select('bookmarkedProfiles');
            const bookmarkedCount = user?.bookmarkedProfiles?.length || 0;

            analyticsData = {
                requestsSent: totalSent,
                acceptanceRate: parseFloat(acceptanceRate.toFixed(1)),
                bookmarkedProfiles: bookmarkedCount,
            };
        } else {
             return NextResponse.json({ success: false, message: 'No analytics for this role' }, { status: 400 });
        }
        
        return NextResponse.json({ success: true, analytics: analyticsData }, { status: 200 });

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }
        console.error('Error fetching analytics:', error);
        return NextResponse.json({ success: false, message: 'An error occurred while fetching analytics.' }, { status: 500 });
    }
}

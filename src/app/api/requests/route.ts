import dbConnect from '@/lib/db';
import RequestModel from '@/models/Request.model';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import UserModel from '@/models/User.model';

export async function POST(request: NextRequest) {
    await dbConnect();
    try {
        const token = request.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
        const investorId = decoded.userId;

        if (decoded.role !== 'investor') {
            return NextResponse.json({ success: false, message: 'Only investors can send requests.' }, { status: 403 });
        }

        const { entrepreneurId } = await request.json();

        const existingRequest = await RequestModel.findOne({ investorId, entrepreneurId });

        if (existingRequest) {
            return NextResponse.json({ success: false, message: 'Collaboration request already sent.' }, { status: 409 });
        }

        const newRequest = new RequestModel({
            investorId,
            entrepreneurId,
        });

        await newRequest.save();

        return NextResponse.json({ success: true, message: 'Request sent successfully.' }, { status: 201 });

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }
        console.error('Error sending request:', error);
        return NextResponse.json({ success: false, message: 'An error occurred.' }, { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    await dbConnect();

    try {
        const token = request.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string; role: string };
        const userId = decoded.userId;
        const userRole = decoded.role;
        
        let requests;

        if (userRole === 'entrepreneur') {
            requests = await RequestModel.find({ entrepreneurId: userId }).populate({ path: 'investorId', model: UserModel });
        } else if (userRole === 'investor') {
            requests = await RequestModel.find({ investorId: userId }).populate({ path: 'entrepreneurId', model: UserModel });
        } else {
            return NextResponse.json({ success: false, message: 'Invalid role' }, { status: 400 });
        }

        const formattedRequests = requests.map(req => {
            const investor = req.investorId as any;
            return {
                id: req._id.toString(),
                investorId: investor._id.toString(),
                investorName: investor.name,
                investorAvatarUrl: investor.avatarUrl,
                entrepreneurId: req.entrepreneurId.toString(),
                status: req.status,
                timestamp: req.createdAt.toISOString(),
            };
        });

        return NextResponse.json({ success: true, requests: formattedRequests }, { status: 200 });

    } catch (error) {
         if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }
        console.error('Error fetching requests:', error);
        return NextResponse.json({ success: false, message: 'An error occurred while fetching requests.' }, { status: 500 });
    }
}

import dbConnect from '@/lib/db';
import RequestModel from '@/models/Request.model';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import UserModel from '@/models/User.model';
import { sendCollaborationAcceptedEmail } from '@/lib/email';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
    await dbConnect();

    try {
        const token = request.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, role: string };
        const userId = decoded.userId;
        const userRole = decoded.role;

        if (userRole !== 'entrepreneur') {
            return NextResponse.json({ success: false, message: 'Only entrepreneurs can update requests.' }, { status: 403 });
        }
        
        const { id } = params;
        const { status } = await request.json();

        if (!['accepted', 'rejected'].includes(status)) {
            return NextResponse.json({ success: false, message: 'Invalid status.' }, { status: 400 });
        }

        const collaborationRequest = await RequestModel.findById(id);

        if (!collaborationRequest) {
            return NextResponse.json({ success: false, message: 'Request not found.' }, { status: 404 });
        }

        if (collaborationRequest.entrepreneurId.toString() !== userId) {
            return NextResponse.json({ success: false, message: 'You are not authorized to update this request.' }, { status: 403 });
        }

        collaborationRequest.status = status;
        await collaborationRequest.save();

        // Send email notification if accepted
        if (status === 'accepted') {
            const investor = await UserModel.findById(collaborationRequest.investorId);
            const entrepreneur = await UserModel.findById(collaborationRequest.entrepreneurId);

            if (investor && entrepreneur && investor.email) {
                await sendCollaborationAcceptedEmail(investor.email, investor.name, entrepreneur.name, entrepreneur._id.toString());
            }
        }

        return NextResponse.json({ success: true, message: 'Request updated successfully.', request: collaborationRequest }, { status: 200 });

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }
        console.error('Error updating request:', error);
        return NextResponse.json({ success: false, message: 'An error occurred.' }, { status: 500 });
    }
}

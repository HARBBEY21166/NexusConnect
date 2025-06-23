
import dbConnect from '@/lib/db';
import UserModel from '@/models/User.model';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { email } = await request.json();
        const user = await UserModel.findOne({ email });

        // To prevent email enumeration, always return a success-like message.
        if (!user) {
            console.log(`Password reset attempt for non-existent user: ${email}`);
            return NextResponse.json({ success: true, message: 'If an account with this email exists, a password reset link has been sent.' }, { status: 200 });
        }
        
        // Generate a reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

        // Set token and expiry on user model
        user.resetPasswordToken = hashedResetToken;
        user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now

        await user.save();

        // Send email
        await sendPasswordResetEmail(user.email, user.name, resetToken);

        return NextResponse.json({ success: true, message: 'If an account with this email exists, a password reset link has been sent.' }, { status: 200 });

    } catch (error) {
        console.error('Error in forgot password endpoint:', error);
        return NextResponse.json({ success: false, message: 'An error occurred. Please try again later.' }, { status: 500 });
    }
}

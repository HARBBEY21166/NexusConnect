
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev';

export async function sendCollaborationAcceptedEmail(to: string, investorName: string, entrepreneurName: string, entrepreneurId: string) {
    if (!resend) {
        console.warn("Resend API key not configured. Skipping collaboration acceptance email.");
        return;
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
    try {
        await resend.emails.send({
            from: `NexusConnect <${fromEmail}>`,
            to,
            subject: 'Your collaboration request was accepted!',
            html: `<p>Hi ${investorName},</p>
                   <p>Good news! <strong>${entrepreneurName}</strong> has accepted your collaboration request on NexusConnect.</p>
                   <p>You can start a conversation with them here:</p>
                   <a href="${appUrl}/dashboard/chat/${entrepreneurId}">Chat with ${entrepreneurName}</a>
                   <br/>
                   <p>Best,</p>
                   <p>The NexusConnect Team</p>`,
        });
        console.log('Collaboration acceptance email sent successfully.');
    } catch (error) {
        console.error('Error sending collaboration acceptance email:', error);
        // Do not throw error to avoid blocking the main API response
    }
}

export async function sendNewMessageEmail(to: string, receiverName: string, senderName: string, senderId: string) {
    if (!resend) {
        console.warn("Resend API key not configured. Skipping new message email.");
        return;
    }
     const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
    try {
        await resend.emails.send({
            from: `NexusConnect <${fromEmail}>`,
            to,
            subject: `You have a new message from ${senderName}`,
            html: `<p>Hi ${receiverName},</p>
                   <p>You have a new message from <strong>${senderName}</strong> on NexusConnect.</p>
                   <p>Click here to view the conversation:</p>
                    <a href="${appUrl}/dashboard/chat/${senderId}">View Message</a>
                   <br/>
                   <p>Best,</p>
                   <p>The NexusConnect Team</p>`,
        });
        console.log('New message notification email sent successfully.');
    } catch (error) {
        console.error('Error sending new message email:', error);
    }
}

export async function sendPasswordResetEmail(to: string, name: string, token: string) {
    if (!resend) {
        console.error("Resend API key not configured. Cannot send password reset email.");
        throw new Error("Could not send password reset email.");
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:9002';
    const resetLink = `${appUrl}/reset-password?token=${token}`;
    try {
        await resend.emails.send({
            from: `NexusConnect <${fromEmail}>`,
            to,
            subject: 'Your Password Reset Request for NexusConnect',
            html: `<p>Hi ${name},</p>
                   <p>You requested a password reset for your NexusConnect account. Please click the link below to set a new password. This link will expire in one hour.</p>
                   <a href="${resetLink}">Reset Your Password</a>
                   <p>If you did not request a password reset, please ignore this email.</p>
                   <br/>
                   <p>Best,</p>
                   <p>The NexusConnect Team</p>`,
        });
        console.log('Password reset email sent successfully.');
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error("Could not send password reset email.");
    }
}

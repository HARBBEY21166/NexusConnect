
import dbConnect from '@/lib/db';
import UserModel from '@/models/User.model';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

// Get all bookmarked profiles for the current user
export async function GET(request: NextRequest) {
    await dbConnect();
    try {
        const token = request.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const userId = decoded.userId;

        const user = await UserModel.findById(userId).populate({
            path: 'bookmarkedProfiles',
            model: UserModel
        }).lean();
        
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }
        
        const bookmarks = (user.bookmarkedProfiles || []).map((profile: any) => {
             profile.id = profile._id.toString();
             delete profile._id;
             delete profile.__v;
             delete profile.password;
             return profile;
        })

        return NextResponse.json({ success: true, bookmarks: bookmarks }, { status: 200 });

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }
        console.error('Error fetching bookmarks:', error);
        return NextResponse.json({ success: false, message: 'An error occurred while fetching bookmarks.' }, { status: 500 });
    }
}


// Toggle a bookmark
export async function PATCH(request: NextRequest) {
    await dbConnect();
    try {
        const token = request.headers.get('authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const userId = decoded.userId;

        const { profileId } = await request.json();
        
        if (!profileId) {
            return NextResponse.json({ success: false, message: 'Profile ID is required.' }, { status: 400 });
        }

        const currentUser = await UserModel.findById(userId);

        if (!currentUser) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }
        
        const isAlreadyBookmarked = currentUser.bookmarkedProfiles?.some(id => id.toString() === profileId);

        let updatedUser;
        if (isAlreadyBookmarked) {
            updatedUser = await UserModel.findByIdAndUpdate(userId, { $pull: { bookmarkedProfiles: profileId } }, { new: true });
             return NextResponse.json({ success: true, message: 'Bookmark removed.', bookmarked: false }, { status: 200 });
        } else {
            updatedUser = await UserModel.findByIdAndUpdate(userId, { $addToSet: { bookmarkedProfiles: profileId } }, { new: true });
            return NextResponse.json({ success: true, message: 'Bookmark added.', bookmarked: true }, { status: 200 });
        }

    } catch (error) {
         if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 });
        }
        console.error('Error toggling bookmark:', error);
        return NextResponse.json({ success: false, message: 'An error occurred while toggling the bookmark.' }, { status: 500 });
    }
}

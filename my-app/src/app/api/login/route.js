import {connect, disconnect} from '../../../config/db';
import bcrypt from 'bcryptjs';
import { generateAuthTokens } from '../../../config/jwt';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { Username, Password } = await request.json();

        const db = await connect();
        const collection = db.collection('users');

        const existingUser = await collection.findOne({ Username });

        if (!existingUser) {
            return Response.json({
                error: 'Username does not exist'
            }, { status: 400 });
        }
        
        const hashPassword = await bcrypt.compare(Password, existingUser.Password);

        if (!hashPassword) {
            return Response.json({
                error: 'Invalid Password'
            }, { status: 400 });
        }
        
        const { accessToken, refreshToken } = generateAuthTokens({ 
            username: Username,
            role: existingUser.role || 'user'  // Default to 'user' if role not set
        });
        
        // Get cookies instance
        const cookieStore = await cookies();
        
        // Set access token cookie
        await cookieStore.set('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15  // 15 seconds
        });

        // Set refresh token cookie
        await cookieStore.set('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 45  // 45 seconds
        });

        return Response.json({
            message: "User Successfully Logged In",
            user: {
                username: Username,
                id: existingUser._id.toString(),
                role: existingUser.role || 'user'  // Include role in response
            }
        }, { status: 200 });
        
    } catch (err) {
        return Response.json({
            error: err.message
        }, { status: 500 });
    } finally {
        await disconnect();
    }
}
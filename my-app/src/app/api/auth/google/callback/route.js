import { google } from 'googleapis';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`
);

export async function GET(request) {
  try {
    // Get the code from the URL
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');

    if (!code) {
      return NextResponse.redirect('/login?error=No code provided');
    }

    // Exchange code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    // Check if user exists in your database, if not create them
    const user = {
      email: data.email,
      name: data.name,
      picture: data.picture,
      // Add any other fields you want to store
    };

    // Create JWT token
    const token = jwt.sign(
      { email: user.email },
      process.env.ACCESS_TOKEN,
      { expiresIn: '15s' }
    );

    // Create refresh token
    const refreshToken = jwt.sign(
      { email: user.email },
      process.env.REFRESH_TOKEN,
      { expiresIn: '45s' }
    );

    // Set cookies
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    };

    const response = NextResponse.redirect('/demo');
    
    response.cookies.set('token', token, {
      ...cookieOptions,
      maxAge: 15, // 15 minutes
    });

    response.cookies.set('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: 45, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Google OAuth Callback Error:', error);
    return NextResponse.redirect('/login?error=Authentication failed');
  }
} 
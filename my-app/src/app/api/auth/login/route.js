import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Add your authentication logic here
    // For example, verify credentials against your database
    
    // If authentication successful, create and set tokens
    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: { email } 
      },
      { status: 200 }
    );

    // Set HTTP-only cookie
    response.cookies.set('token', 'your-jwt-token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 1 week
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: error.message || 'Login failed' },
      { status: 400 }
    );
  }
} 
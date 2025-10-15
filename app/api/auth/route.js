import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        // Get credentials from environment variables
        const validUsername = process.env.AUTH_USERNAME;
        const validPassword = process.env.AUTH_PASSWORD;

        if (!validUsername || !validPassword) {
            console.error('AUTH_USERNAME or AUTH_PASSWORD not set in environment');
            return NextResponse.json({
                success: false,
                error: 'Server configuration error'
            }, { status: 500 });
        }

        // Check credentials
        if (username === validUsername && password === validPassword) {
            const response = NextResponse.json({
                success: true,
                message: 'Login successful'
            });

            // Set authentication cookie (expires in 7 days)
            response.cookies.set('auth', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            });

            return response;
        } else {
            return NextResponse.json({
                success: false,
                error: 'Napačno uporabniško ime ali geslo'
            }, { status: 401 });
        }
    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error'
        }, { status: 500 });
    }
}

// Logout endpoint
export async function DELETE() {
    const response = NextResponse.json({
        success: true,
        message: 'Logged out'
    });

    // Clear authentication cookie
    response.cookies.delete('auth');

    return response;
}
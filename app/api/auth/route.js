import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { username, password } = await request.json();

        // Get credentials from environment variables
        const validUsername = process.env.AUTH_USERNAME;
        const validPassword = process.env.AUTH_PASSWORD;

        if (!validUsername || !validPassword) {
            console.error('AUTH_USERNAME or AUTH_PASSWORD not set in environment');
            console.error('AUTH_USERNAME:', validUsername ? 'SET' : 'NOT SET');
            console.error('AUTH_PASSWORD:', validPassword ? 'SET' : 'NOT SET');
            return NextResponse.json({
                success: false,
                error: 'Server configuration error - Please set AUTH_USERNAME and AUTH_PASSWORD environment variables'
            }, { status: 500 });
        }

        // Check credentials
        console.log('Login attempt:', { username, password: '***' });
        console.log('Valid credentials:', { validUsername, validPassword: '***' });
        
        if (username === validUsername && password === validPassword) {
            console.log('Login successful, setting cookie');
            const response = NextResponse.json({
                success: true,
                message: 'Login successful'
            });

            // Set authentication cookie (expires in 1 hour)
            response.cookies.set('auth', 'authenticated', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60, // 1 hour
                path: '/', // Ensure cookie is available for all paths
                // Don't set domain to avoid localhost issues
            });

            console.log('Cookie set successfully');
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));

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
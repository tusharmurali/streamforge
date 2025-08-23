import { NextResponse, NextRequest } from 'next/server';

const BASIC_AUTH_USERNAME = process.env.BASIC_AUTH_USERNAME || 'admin';
const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD || 'admin';
 
export function middleware(request: NextRequest) {
    const basicAuth = request.headers.get('authorization');
    if (basicAuth) {
        const [, base64] = basicAuth.split(' ');
        const [username, password] = Buffer.from(base64, 'base64').toString().split(':');
        if (username === BASIC_AUTH_USERNAME && password === BASIC_AUTH_PASSWORD) {
            return NextResponse.next()
        }
    }
    return new NextResponse('Authentication required', {
        status: 401,
        headers: {'WWW-Authenticate': 'Basic realm="Secure Area"'}
    })
}
 
export const config = {
  matcher: '/',
};
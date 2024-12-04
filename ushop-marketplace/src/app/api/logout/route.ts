import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function GET() {
  const cookie = serialize('auth_token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 0, 
    path: '/',
  });

  const response = NextResponse.json({ success: true });
  response.headers.set('Set-Cookie', cookie);
  
  return response;
}

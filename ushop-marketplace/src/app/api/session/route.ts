// /pages/api/me.js or /app/api/me/route.ts (depending on your folder structure)
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request) {
  const cookie = request.headers.get('cookie');
  const token = cookie?.split('auth_token=')[1]?.split(';')[0];  // Extract token from cookies

  if (!token) {
    return NextResponse.json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);  // Decode the JWT token
    return NextResponse.json({ success: true, user: decoded });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Invalid token' });
  }
}

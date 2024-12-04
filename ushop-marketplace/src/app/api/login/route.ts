import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Set a strong secret key in environment variable

// Helper function to set the cookie
function setCookie(token: string) {
  return serialize('auth_token', token, {
    httpOnly: true,  // Prevents JavaScript from accessing the cookie
    secure: process.env.NODE_ENV !== 'development', // Ensures cookie is only sent over HTTPS in production
    sameSite: 'strict',  // Helps to protect against CSRF attacks
    maxAge: 60 * 60 * 24 * 7,  // 1 week expiry
    path: '/',
  });
}

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const connection = await createConnection();

    // Fetch user data including username
    const query = `SELECT * FROM account_table WHERE Email = ?`;
    const [rows] = await connection.execute(query, [email]);
    
    await connection.end();

    if (rows.length === 0) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' });
    }

    const user = rows[0];

    // Compare the provided password with the hashed password in the DB
    const passwordMatch = await bcrypt.compare(password, user.Password);
    if (!passwordMatch) {
      return NextResponse.json({ success: false, message: 'Invalid email or password' });
    }

    // Generate JWT token with user data
    const token = jwt.sign(
      {
        email,
        role: user.Role,
        username: user.Username,
        id: user.ID,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log("JWT Token Payload:", jwt.decode(token)); // Debug the token payload

    // Set the token as a cookie
    const cookie = setCookie(token);

    console.log("Set-Cookie header:", cookie); // Debug the Set-Cookie header
    
    const response = NextResponse.json({ success: true, role: user.Role, username: user.Username, id: user.ID });
    
    // Set the cookie in the response header
    response.headers.set('Set-Cookie', cookie);
    
    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

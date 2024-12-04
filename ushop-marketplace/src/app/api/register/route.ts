import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';  // Assuming you have this helper function for connecting to 
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, formattedUsername, password, role} = await request.json();

    const hashedPassword = await bcrypt.hash(password, 10);
    const connection = await createConnection();

    const query = `SELECT * FROM account_table WHERE Email = ?`;
    const [rows] = await connection.execute(query, [email]);
    
    
    if (rows.length === 0) {
      const retrieve_sql = `INSERT INTO account_table (Email, Username, Password, Role) VALUES (?,? ,?,?)`;
      const [rows] = await connection.execute(retrieve_sql, [email, formattedUsername, hashedPassword, role]);
      console.log("Rows updated:",rows);
      await connection.end();
      return NextResponse.json({ success: true });
    }else{
      return NextResponse.json({ success: false });
    }

    const user = rows[0];
    
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
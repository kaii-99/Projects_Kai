import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';  // Assuming you have this helper function for connecting to 

export async function POST(request: Request) {
  try {
    const { id } = await request.json();
    const connection = await createConnection();
    let rows = [];

    if (id === "") {
      rows = [{
        ID: null,
        email: null,
        Username: "Guest",
        Password: null,
        Role: "Guest"
      }]
      return NextResponse.json({ success: true, rows });
    }

    const query = `SELECT * FROM account_table WHERE ID = ?`;
    [rows] = await connection.execute(query, [id]);

    await connection.end();
    
    console.log(rows);
    if (rows.length === 0) {
        return NextResponse.json({ success: false });
    }else{
        return NextResponse.json({ success: true, rows });
    }
    
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message });
  }
}
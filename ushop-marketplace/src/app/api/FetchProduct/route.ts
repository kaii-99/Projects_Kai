import { NextResponse } from 'next/server';
import { createConnection } from "@/lib/db";

export async function POST(request: Request) {
  const { title } = await request.json();

  try {
    const connection = await createConnection();
    console.log("Database connection established");

    let insertQuery = "";
    let queryParams = [];

    switch (title) {
      case "tops":
        selectQuery = `
          INSERT INTO top_table (Name, Size, Price, Quantity, Image_URL, Description) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        queryParams = [name, sizes.join(","), price, stock, colours.join(","), description];
        break;
      case "bottoms":
        insertQuery = `
          INSERT INTO bottom_table (Name, Size, Price, Quantity, Image_URL, Description) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        queryParams = [name, sizes.join(","), price, stock, colours.join(","), description];
        break;
      case "accessories":
        insertQuery = `
          INSERT INTO accessories_table (Name, Size, Price, Quantity, Image_URL, Description) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        queryParams = [name, sizes.join(","), price, stock, colours.join(","), description];
        break;
      case "others":
        insertQuery = `
          INSERT INTO others_table (Name, Size, Price, Quantity, Image_URL, Description) 
          VALUES (?, ?, ?, ?, ?, ?)
        `;
        queryParams = [name, sizes.join(","), price, stock, colours.join(","), description];
        break;
      default:
        throw new Error("Invalid category");
    }

    const [result] = await connection.execute(insertQuery, queryParams);
    console.log("Query executed successfully", result);

    connection.end();

    return NextResponse.json({ success: true, data: result });
  } catch (error : any) {
    console.error("Error in POST function", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
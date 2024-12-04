import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';  // Assuming you have this helper function for connecting to MySQL

export async function POST(request: Request) {
  try {
    const { id } = await request.json();

    const connection = await createConnection();

    if (id === "") {
      return Response.json({  });
    } 
    else {
      const check_sql = `
        SELECT * FROM favourite_table
        WHERE favourite_table.ID = ?;
      `;
      
      // Execute the check query
      const [existingRows] = await connection.execute(check_sql, [id]);
      
      if (existingRows.length === 0) {
        // If no rows are found, insert the new ID
        const insert_sql = `
          INSERT INTO favourite_table (ID)
          VALUES (?);
        `;
        await connection.execute(insert_sql, [id]);
      
        console.log(`Inserted new ID ${id} into favourite_table`);
      }
    
      const retrieve_sql = `
        SELECT * FROM favourite_table
        WHERE ID = ?;
      `;
    
      const [rows] = await connection.execute(retrieve_sql, [id]);
    
       // If no rows are returned, handle it
       if (rows.length === 0) {
          await connection.end();
          return NextResponse.json({ success: false, message: 'No records found' });
      }
      
    
      const topList = rows[0].TopList ? JSON.parse(rows[0].TopList) : [];
      const bottomList = rows[0].BottomList ? JSON.parse(rows[0].BottomList) : [];
      const accessoriesList = rows[0].AccessoriesList ? JSON.parse(rows[0].AccessoriesList) : [];
      const othersList = rows[0].OthersList ? JSON.parse(rows[0].OthersList) : [];
    
      // Calculate lengths
      const topLength = topList.length; // Now correctly gets the count of elements in the array
      const bottomLength = bottomList.length; // Length of BottomList
      const accessoriesLength = accessoriesList.length; // Length of AccessoriesList
      const othersLength = othersList.length; // Length of OthersList
    
      const length = topLength + bottomLength + accessoriesLength + othersLength;
      console.log(length);
      await connection.end();
    
      return NextResponse.json({ 
          success: true, 
          count: length
      });
    }

  } catch (error) {
    console.error("Error fetching order list:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
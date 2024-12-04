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
        SELECT * FROM shoppingcart_table
        WHERE shoppingcart_table.ID = ?;
      `;
      
      // Execute the check query
      const [existingRows] = await connection.execute(check_sql, [id]);
      
      if (existingRows.length === 0) {
        // If no rows are found, insert the new ID
        const insert_sql = `
          INSERT INTO shoppingcart_table (ID)
          VALUES (?);
        `;
        await connection.execute(insert_sql, [id]);
      
        console.log(`Inserted new ID ${id} into shoppingcart_table`);
      }

      const retrieve_sql = `
        SELECT 
          top_table.*,
          'tops' AS Category,
          jt.OrderedQuantity
        FROM 
          shoppingcart_table
        JOIN 
          JSON_TABLE(shoppingcart_table.TopList, '$[*]' 
                COLUMNS (
                  TopID INT PATH '$[0]',
                  OrderedQuantity VARCHAR(10) PATH '$[1].Q'
                )
              ) AS jt
          JOIN 
              top_table
          ON jt.TopID = top_table.ID
          WHERE 
              shoppingcart_table.ID = ?
              AND JSON_LENGTH(shoppingcart_table.TopList) > 0

        UNION

        SELECT 
          bottom_table.*,
          'bottoms' AS Category,
          jt.OrderedQuantity
        FROM 
          shoppingcart_table
        JOIN 
          JSON_TABLE(shoppingcart_table.BottomList, '$[*]' 
                COLUMNS (
                  BottomID INT PATH '$[0]',
                  OrderedQuantity VARCHAR(10) PATH '$[1].Q'
                )
              ) AS jt
          JOIN 
            bottom_table
          ON jt.BottomID = bottom_table.ID
          WHERE 
            shoppingcart_table.ID = ?
            AND JSON_LENGTH(shoppingcart_table.BottomList) > 0

        UNION

        SELECT 
          accessories_table.*,
          'accessories' AS Category,
          jt.OrderedQuantity
        FROM 
          shoppingcart_table
        JOIN 
          JSON_TABLE(shoppingcart_table.AccessoriesList, '$[*]' 
                COLUMNS (
                  AccessoriesID INT PATH '$[0]',
                  OrderedQuantity VARCHAR(10) PATH '$[1].Q'
                )
              ) AS jt
          JOIN 
            accessories_table
          ON jt.AccessoriesID = accessories_table.ID
          WHERE 
            shoppingcart_table.ID = ?
            AND JSON_LENGTH(shoppingcart_table.AccessoriesList) > 0

        UNION

        SELECT 
          others_table.*,
          'others' AS Category,
          jt.OrderedQuantity
        FROM 
          shoppingcart_table
        JOIN 
          JSON_TABLE(shoppingcart_table.OthersList, '$[*]' 
                COLUMNS (
                  OthersID INT PATH '$[0]',
                  OrderedQuantity VARCHAR(10) PATH '$[1].Q'
                )
              ) AS jt
          JOIN 
            others_table
          ON jt.OthersID = others_table.ID
          WHERE 
            shoppingcart_table.ID = ?
            AND JSON_LENGTH(shoppingcart_table.OthersList) > 0
      `;

      const [rows] = await connection.execute(retrieve_sql, [id,id,id,id]);

      // If no rows are returned, handle it
      if (rows.length === 0) {
          await connection.end();
          return NextResponse.json({ success: true, count: 0 });
      }

      let count = 0;

      if (Array.isArray(rows) && rows.length > 0) {
        rows.forEach((row) => {
          count += parseInt(row.OrderedQuantity, 10);
        });

      }
      console.log(count);
      await connection.end();

      return NextResponse.json({ 
          success: true, 
          count: count
      });
    }
  } catch (error) {
    console.error("Error fetching order list:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
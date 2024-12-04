import { NextResponse } from 'next/server';
import { createConnection } from "@/lib/db";
import { Product } from '@/components/Products';

export async function POST(request: Request) {

  try {
    const { id , role } = await request.json();
    let cartList: Product[] = [];

    const connection = await createConnection();
    console.log("Database connection established, "+role);

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

      console.log(id);
      console.log(existingRows);
      if (existingRows === null) {
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

      //console.log(rows);

      if (check_sql[0] === null)  {
          return Response.json({  });
        }
      else {
        //console.log("Updated Rows data:", rows);

        if (role) {
          if (Array.isArray(rows) && rows.length > 0) {
            cartList = rows.map((row) => ({
                user: id,
                id: row.ID,
                name: row.Name,
                sizes: row.Size,
                price: (row.Price.toFixed(2) * row.OrderedQuantity * (1 - parseFloat(row.Discount) / 100).toFixed(2)),
                images: JSON.parse(row.Image_URL),
                category: row.Category,
                disc: row.Discount,
                quantity: row.OrderedQuantity,
                liked: false,
            }));
          }
        }
        else {
          if (Array.isArray(rows) && rows.length > 0) {
            cartList = rows.map((row) => ({
                user: id,
                id: row.ID,
                name: row.Name,
                sizes: row.Size,
                price: (row.Price.toFixed(2) * row.OrderedQuantity),
                images: JSON.parse(row.Image_URL),
                category: row.Category,
                disc: "0%",
                quantity: row.OrderedQuantity,
                liked: false,
            }));
          }
        } 
      }
    }

    await connection.end();

    return NextResponse.json({ success: true, result: cartList });
  } catch (error) {
    console.error("Error in POST function", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
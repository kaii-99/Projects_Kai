import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';  // Assuming you have this helper function for connecting to MySQL

let InvoiceItems = [];

export async function POST(request: Request) {
    try {
        const { id , role } = await request.json();
        
        const connection = await createConnection();
        
        const length_sql = `
          SELECT * FROM order_table WHERE Account_ID = ?
        `;
        
        const sql = `
          SELECT 
            order_table.ID AS Invoice,
            top_table.*, 
            SUBSTRING(order_table.Date, 1, 10) AS Date, 
            order_table.Status,
            jt.OrderedQuantity,
            'tops' AS Category,
            CONCAT(top_table.Image_URL) AS ImageURL
          FROM 
            order_table
          JOIN
            JSON_TABLE(order_table.TopList, '$[*]' 
              COLUMNS (
                TopID INT PATH '$[0]',
                OrderedQuantity VARCHAR(10) PATH '$[1].Q'
              )
            ) AS jt
          JOIN 
            top_table
          ON jt.TopID = top_table.ID
          WHERE 
            order_table.Account_ID = ?
            AND JSON_LENGTH(order_table.TopList) > 0

          UNION

          SELECT 
            order_table.ID AS Invoice,
            bottom_table.*, 
            SUBSTRING(order_table.Date, 1, 10) AS Date, 
            order_table.Status,
            jt.OrderedQuantity,
            'bottoms' AS Category,
            CONCAT(bottom_table.Image_URL) AS ImageURL
          FROM 
            order_table
          JOIN
            JSON_TABLE(order_table.BottomList, '$[*]' 
              COLUMNS (
                BottomID INT PATH '$[0]',
                OrderedQuantity VARCHAR(10) PATH '$[1].Q'
              )
            ) AS jt
          JOIN 
            bottom_table
          ON jt.BottomID = bottom_table.ID
          WHERE 
            order_table.Account_ID = ?
            AND JSON_LENGTH(order_table.BottomList) > 0

          UNION

          SELECT 
            order_table.ID AS Invoice,
            accessories_table.*, 
            SUBSTRING(order_table.Date, 1, 10) AS Date, 
            order_table.Status,
            jt.OrderedQuantity,
            'accessories' AS Category,
            CONCAT(accessories_table.Image_URL) AS ImageURL
          FROM 
            order_table
          JOIN
            JSON_TABLE(order_table.AccessoriesList, '$[*]' 
              COLUMNS (
                AccessoriesID INT PATH '$[0]',
                OrderedQuantity VARCHAR(10) PATH '$[1].Q'
              )
            ) AS jt
          JOIN 
            accessories_table
          ON jt.AccessoriesID = accessories_table.ID
          WHERE 
            order_table.Account_ID = ?
            AND JSON_LENGTH(order_table.AccessoriesList) > 0

          UNION

          SELECT 
            order_table.ID AS Invoice,
            others_table.*, 
            SUBSTRING(order_table.Date, 1, 10) AS Date, 
            order_table.Status,
            jt.OrderedQuantity,
            'others' AS Category,
            CONCAT(others_table.Image_URL) AS ImageURL
          FROM 
            order_table
          JOIN
            JSON_TABLE(order_table.OthersList, '$[*]' 
              COLUMNS (
                OthersID INT PATH '$[0]',
                OrderedQuantity VARCHAR(10) PATH '$[1].Q'
              )
            ) AS jt
          JOIN 
            others_table
          ON jt.OthersID = others_table.ID
          WHERE 
            order_table.Account_ID = ?
            AND JSON_LENGTH(order_table.OthersList) > 0

          ORDER BY 
            Invoice ASC;
        `;
        const [rows_length] = await connection.execute(length_sql, [id]);
        //console.log(rows_length);
        const [rows] = await connection.execute(sql, [id,id,id,id]);
        console.log(rows);

        await connection.end();

        if (rows_length[0] === null)  {
          return NextResponse.json({  });
        }
        else {
          console.log(role);
          if (role) {
            if (Array.isArray(rows) && rows.length > 0) {
              InvoiceItems = rows.map((row) => ({
                images: JSON.parse(row.Image_URL),
                name: row.Name + " " + row.Size,
                invoice: 'NTU000'+row.Invoice+row.Category+row.ID,
                category: row.Category,
                id: 'NTU000'+row.Invoice,
                date: row.Date,
                status: row.Status,
                quantity: row.OrderedQuantity,
                price: (row.Price.toFixed(2) * (1 - parseFloat(row.Discount) / 100).toFixed(2)),
              }));
            }
          }
          else {
            if (Array.isArray(rows) && rows.length > 0) {
              InvoiceItems = rows.map((row) => ({
                images: JSON.parse(row.Image_URL),
                name: row.Name + " " + row.Size,
                invoice: 'NTU000'+row.Invoice+row.Category+row.ID,
                category: row.Category,
                id: 'NTU000'+row.Invoice,
                date: row.Date,
                status: row.Status,
                quantity: row.OrderedQuantity,
                price: (row.Price.toFixed(2)),
              }));
            }
          }

            
          console.log("InvoiceItems data:", InvoiceItems);
          return NextResponse.json(InvoiceItems);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ success: false, error: error.message });
    }
}
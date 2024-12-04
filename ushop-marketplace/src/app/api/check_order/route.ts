import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';
import nodemailer from 'nodemailer';

let InvoiceItems = [];

export async function GET(request: Request) {
  let connection;

  try {
    connection = await createConnection();
    console.log("Database connection established");

    const sql = `
          SELECT 
            order_table.ID AS Invoice,
            top_table.*, 
            SUBSTRING(order_table.Date, 1, 10) AS Date, 
            order_table.Status,
            jt.OrderedQuantity,
            'tops' AS Category,
            CONCAT('tops/', top_table.Image_URL) AS ImageURL
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
            JSON_LENGTH(order_table.TopList) > 0

          UNION

          SELECT 
            order_table.ID AS Invoice,
            bottom_table.*, 
            SUBSTRING(order_table.Date, 1, 10) AS Date, 
            order_table.Status,
            jt.OrderedQuantity,
            'bottoms' AS Category,
            CONCAT('bottoms/', bottom_table.Image_URL) AS ImageURL
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
            JSON_LENGTH(order_table.BottomList) > 0

          UNION

          SELECT 
            order_table.ID AS Invoice,
            accessories_table.*, 
            SUBSTRING(order_table.Date, 1, 10) AS Date, 
            order_table.Status,
            jt.OrderedQuantity,
            'accessories' AS Category,
            CONCAT('accessories/', accessories_table.Image_URL) AS ImageURL
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
            JSON_LENGTH(order_table.AccessoriesList) > 0

          UNION

          SELECT 
            order_table.ID AS Invoice,
            others_table.*, 
            SUBSTRING(order_table.Date, 1, 10) AS Date, 
            order_table.Status,
            jt.OrderedQuantity,
            'others' AS Category,
            CONCAT('others/', others_table.Image_URL) AS ImageURL
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
            JSON_LENGTH(order_table.OthersList) > 0

          ORDER BY 
            Invoice ASC;
        `;

    const [rows] = await connection.execute(sql,[]);
    console.log("Orders fetched successfully", rows);
    if (Array.isArray(rows) && rows.length > 0) {
      InvoiceItems = rows.map((row) => ({
        images: JSON.parse(row.Image_URL),
        name: row.Name,
        invoice: 'NTU000'+row.Invoice+row.Category+row.ID,
        category: row.Category,
        id: 'NTU000'+row.Invoice,
        date: row.Date,
        status: row.Status,
        quantity: row.OrderedQuantity,
        price: row.Price.toFixed(2),
        invoice_id: row.Invoice
      }));
    }
    console.log("InvoiceItems data:", InvoiceItems);

    return NextResponse.json({ success: true, data: InvoiceItems });
  } catch (error: any) {
    console.error("Error in GET function", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (connection) {
      connection.end();
    }
  }
}

export async function PUT(request: Request) {
  const { invoice, status } = await request.json();
  console.log(invoice);
  //const email = "chuakaiwei2012@gmail.com";

  if (!invoice || !status) {
    return NextResponse.json({ success: false, error: "Invoice and status are required" }, { status: 400 });
  }

  let connection;

  try {
    connection = await createConnection();
    console.log("Database connection established");

    const [result] = await connection.execute(
      "UPDATE order_table SET Status = ? WHERE ID = ?",
      [status, invoice]
    );


    //console.log("Email retrieved:",email[0].Email);
    //console.log("Order status updated successfully", result);
    // Send email if status is "Confirmed"
    if (status === "Confirmed") {
      const transporter = nodemailer.createTransport({
        service: "gmail", // or any email service you prefer
        auth: {
          user: "nanyangushop@gmail.com",
          pass: "jqqm wryo skuw mpid",
        },
      });

      const [email] = await connection.execute(
        `
        SELECT
          top_table.*, 
          account_table.*,
          'tops' AS Category,
          jt.OrderedQuantity
        FROM 
          order_table
		    JOIN 
		    	account_table ON order_table.account_ID = account_table.ID
            JOIN 
              JSON_TABLE(order_table.TopList, '$[*]' 
                    COLUMNS (
                      TopID INT PATH '$[0]',
                      OrderedQuantity VARCHAR(10) PATH '$[1].Q'
                    )
                  ) AS jt
        JOIN 
          top_table
        ON 
          jt.TopID = top_table.ID
        WHERE 
          order_table.ID = ?
          AND JSON_LENGTH(order_table.TopList) > 0
  
        UNION
  
        SELECT
          bottom_table.*, 
          account_table.*,
          'bottoms' AS Category,
          jt.OrderedQuantity
        FROM 
          order_table
		    JOIN 
		    	account_table ON order_table.account_ID = account_table.ID
            JOIN 
              JSON_TABLE(order_table.BottomList, '$[*]' 
                    COLUMNS (
                      BottomID INT PATH '$[0]',
                      OrderedQuantity VARCHAR(10) PATH '$[1].Q'
                    )
                  ) AS jt
        JOIN 
          bottom_table
        ON 
          jt.BottomID = bottom_table.ID
        WHERE 
          order_table.ID = ?
          AND JSON_LENGTH(order_table.BottomList) > 0
  
        UNION
        
        SELECT
          accessories_table.*, 
          account_table.*,
          'accessories' AS Category,
          jt.OrderedQuantity
        FROM 
          order_table
		    JOIN 
		    	account_table ON order_table.account_ID = account_table.ID
            JOIN 
              JSON_TABLE(order_table.AccessoriesList, '$[*]' 
                    COLUMNS (
                      AccessoriesID INT PATH '$[0]',
                      OrderedQuantity VARCHAR(10) PATH '$[1].Q'
                    )
                  ) AS jt
        JOIN 
          accessories_table
        ON 
          jt.AccessoriesID = accessories_table.ID
        WHERE 
          order_table.ID = ?
          AND JSON_LENGTH(order_table.AccessoriesList) > 0
  
          UNION
        
        SELECT
          others_table.*, 
          account_table.*,
          'others' AS Category,
          jt.OrderedQuantity
        FROM 
          order_table
		    JOIN 
		    	account_table ON order_table.account_ID = account_table.ID
            JOIN 
              JSON_TABLE(order_table.OthersList, '$[*]' 
                    COLUMNS (
                      OthersID INT PATH '$[0]',
                      OrderedQuantity VARCHAR(10) PATH '$[1].Q'
                    )
                  ) AS jt
        JOIN 
          others_table
        ON 
          jt.OthersID = others_table.ID
        WHERE 
          order_table.ID = ?
          AND JSON_LENGTH(order_table.OthersList) > 0
        `,
        [invoice,invoice,invoice,invoice]
      );

      console.log(email);

      // Initialize an empty string for order details
      let details = `-----------------------------------\n`;

      // Loop through each item in the order to generate order details
      email.forEach((item) => {
        //console.log(item.Name);
        details += `
        Product Name: ${item.Name + " " + item.Size}\n
        Quantity: ${item.OrderedQuantity}\n
        -----------------------------------\n`;
      });

      const mailOptions = {
        from: "nanyangushop@gmail.com",
        to: email[0].Email,
        subject: `Order ${invoice} Confirmation`,
        text: `Dear Customer,\n\n
        Your order with invoice number NTU000${invoice} has been confirmed.\n
        Order details:\n
        ${details}
        Thank you for your purchase!\n\n
        Best regards,\n
        U-Shop`,
      };

      await transporter.sendMail(mailOptions);
      console.log("Confirmation email sent successfully");
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error: any) {
    console.error("Error in PUT function", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (connection) {
      connection.end();
    }
  }
}
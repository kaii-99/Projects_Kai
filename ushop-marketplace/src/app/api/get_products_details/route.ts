import { NextResponse } from 'next/server';
import { createConnection } from "@/lib/db";
import { Product } from '@/components/Products';
import { products } from '@/app/productsData';

export async function POST(request: Request) {


  try {
    const { category, id, userid, role } = await request.json();
    let productItem: Product = {
        id: 0,
        name: '',
        price: 0,
        images: '',
        category: ''
    };

    const connection = await createConnection();
    console.log("Database connection established");

    let selectQuery = "";
    let sizeQuery = "";
    let disc = "";

    if (role) {
      disc = "10%";
    }
    else {
      disc = "0%";
    }

    console.log(disc);
    if(id === "") {
      switch (category) {
        case "tops":
          selectQuery = `
            SELECT 
                *
            FROM 
                top_table
            WHERE
              top_table.ID = ?;
          `;
          sizeQuery = `
            SELECT Size From top_table WHERE Name = ?;
          `;
          break;
        case "bottoms":
          selectQuery = `
            SELECT 
              *
            FROM 
              bottom_table
            WHERE
              bottom_table.ID = ?;
          `;
          sizeQuery = `
            SELECT Size From bottom_table WHERE Name = ?;
          `;
          break;
        case "accessories":
          selectQuery = `
            SELECT 
              *
            FROM 
              accessories_table
            WHERE
              accessories_table.ID = ?;
          `;
          sizeQuery = `
            SELECT Size From accessories_table WHERE Name = ?;
          `;
          break;
        case "others":
          selectQuery = `
            SELECT 
              *
            FROM 
              others_table
            WHERE
              others_table.ID = ?;
          `;
          sizeQuery = `
            SELECT Size From others_table WHERE Name = ?;
          `;
          break;
        default:
          throw new Error("Invalid category");
      }
  
      const [result] = await connection.execute(selectQuery, [userid, id]);
      const [size_result] = await connection.execute(sizeQuery, [result[0].Name]);
      console.log("Query executed successfully", result);
      console.log(size_result);
  
      if(role) {
        if (Array.isArray(result) && result.length > 0) {
          productItem = {
           id: result[0].ID,
           name: result[0].Name, 
           size: result[0].Size,
           price: result[0].Price, 
           images: JSON.parse(result[0].Image_URL),
           description: result[0].Description,
           stock: result[0].Quantity,
           sizes: size_result.map(item => item.Size),
           disc: result[0].Discount,
           promo: false,
           category: category,
           liked: result[0].liked
         };
        }
      }
      else {
        if (Array.isArray(result) && result.length > 0) {
          productItem = {
           id: result[0].ID,
           name: result[0].Name, 
           size: result[0].Size,
           price: result[0].Price, 
           images: JSON.parse(result[0].Image_URL),
           description: result[0].Description,
           stock: result[0].Quantity,
           sizes: size_result.map(item => item.Size),
           disc: "0%",
           promo: false,
           category: category,
           liked: result[0].liked
         };
       }
      }
    }
    else {
      switch (category) {
        case "tops":
          selectQuery = `
            SELECT 
                top_table.*,
                favourite_table.ID AS userID,
            CASE 
                WHEN JSON_CONTAINS(favourite_table.TopList, CAST(top_table.ID AS JSON), '$') THEN true
                ELSE false 
            END AS liked
            FROM 
                top_table
            LEFT JOIN 
              favourite_table 
            ON 
              favourite_table.ID = ?
            WHERE
              top_table.ID = ?;
          `;
          sizeQuery = `
            SELECT Size From top_table WHERE Name = ?;
          `;
          break;
        case "bottoms":
          selectQuery = `
            SELECT 
              bottom_table.*,
              favourite_table.ID AS userID,
            CASE 
              WHEN JSON_CONTAINS(favourite_table.BottomList, CAST(bottom_table.ID AS JSON), '$') THEN true
              ELSE false 
            END AS liked 
            FROM 
              bottom_table
            LEFT JOIN 
              favourite_table 
            ON 
              favourite_table.ID = ?
            WHERE
              bottom_table.ID = ?;
          `;
          sizeQuery = `
            SELECT Size From bottom_table WHERE Name = ?;
          `;
          break;
        case "accessories":
          selectQuery = `
            SELECT 
              accessories_table.*, 
              favourite_table.ID AS userID,
            CASE 
              WHEN JSON_CONTAINS(favourite_table.AccessoriesList, CAST(accessories_table.ID AS JSON), '$') THEN true
              ELSE false 
            END AS liked  
            FROM 
              accessories_table
            LEFT JOIN 
              favourite_table 
            ON 
              favourite_table.ID = ?
            WHERE
              accessories_table.ID = ?;
          `;
          sizeQuery = `
            SELECT Size From accessories_table WHERE Name = ?;
          `;
          break;
        case "others":
          selectQuery = `
            SELECT 
              others_table.*, 
              favourite_table.ID AS userID,
            CASE 
              WHEN JSON_CONTAINS(favourite_table.OthersList, CAST(others_table.ID AS JSON), '$') THEN true
              ELSE false 
            END AS liked
            FROM 
              others_table
            LEFT JOIN 
              favourite_table 
            ON 
              favourite_table.ID = ?
            WHERE
              others_table.ID = ?;
          `;
          sizeQuery = `
            SELECT Size From others_table WHERE Name = ?;
          `;
          break;
        default:
          throw new Error("Invalid category");
      }
  
      const [result] = await connection.execute(selectQuery, [userid, id]);
      const [size_result] = await connection.execute(sizeQuery, [result[0].Name]);
      console.log("Query executed successfully", result);
      console.log(size_result);
  
      if(role) {
        if (Array.isArray(result) && result.length > 0) {
          productItem = {
           id: result[0].ID,
           name: result[0].Name, 
           size: result[0].Size,
           price: result[0].Price, 
           images: JSON.parse(result[0].Image_URL),
           description: result[0].Description,
           stock: result[0].Quantity,
           sizes: size_result.map(item => item.Size),
           disc: result[0].Discount,
           promo: false,
           category: category,
           liked: result[0].liked
         };
        }
      }
      else {
        if (Array.isArray(result) && result.length > 0) {
          productItem = {
           id: result[0].ID,
           name: result[0].Name, 
           size: result[0].Size,
           price: result[0].Price, 
           images: JSON.parse(result[0].Image_URL),
           description: result[0].Description,
           stock: result[0].Quantity,
           sizes: size_result.map(item => item.Size),
           disc: "0%",
           promo: false,
           category: category,
           liked: result[0].liked
         };
       }
      }
    }

    console.log(productItem);

    await connection.end();

    return NextResponse.json({ success: true, result: productItem });
  } catch (error) {
    console.error("Error in POST function", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
import { NextResponse } from 'next/server';
import { createConnection } from "@/lib/db";
import { Product } from '@/components/Products';
import { products } from '@/app/productsData';

export async function POST(request: Request) {


  try {
    const { category, name, size } = await request.json();
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

    switch (category) {
      case "tops":
        selectQuery = `
          SELECT * FROM top_table WHERE Name = ? AND Size = ?;
        `;
        sizeQuery = `
          SELECT Size From top_table WHERE Name = ?;
        `;
        break;
      case "bottoms":
        selectQuery = `
          SELECT * FROM bottom_table WHERE Name = ? AND Size = ?;
        `;
        sizeQuery = `
          SELECT Size From bottom_table WHERE Name = ?;
        `;
        break;
      case "accessories":
        selectQuery = `
          SELECT * FROM accessories_table WHERE Name = ? AND Size = ?;
        `;
        sizeQuery = `
          SELECT Size From accessories_table WHERE Name = ?;
        `;
        break;
      case "others":
        selectQuery = `
          SELECT * FROM others_table WHERE Name = ? AND Size = ?;
        `;
        sizeQuery = `
          SELECT Size From others_table WHERE Name = ?;
        `;
        break;
      default:
        throw new Error("Invalid category");
    }

    const [result] = await connection.execute(selectQuery, [name, size]);
    const [size_result] = await connection.execute(sizeQuery, [result[0].Name]);
    console.log("Query executed successfully", result);
    console.log(size_result);

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
        liked: false
      };
    }

    console.log(productItem);

    await connection.end();

    return NextResponse.json({ success: true, result: productItem });
  } catch (error) {
    console.error("Error in POST function", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
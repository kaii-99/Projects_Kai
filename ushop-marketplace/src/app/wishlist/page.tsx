import Wishlist from "@/components/Wishlist";
import { createConnection } from '@/lib/db';
import { RowDataPacket } from 'mysql2';
import Navbar from "@/components/Navbar";

// Fetch wishlist items directly in the component
const fetchWishlistItems = async (id: string): Promise<WishlistItem[]> => {
  let wishlistItems: WishlistItem[] = [];
  
  try {
    const connection = await createConnection();

    const length_sql = `
      SELECT * FROM favourite_table WHERE ID = ?
    `;

    const sql = `
      SELECT top_table.*,
      'tops' AS Category
      FROM top_table
      JOIN favourite_table
      ON favourite_table.TopList != '' 
      AND JSON_CONTAINS(favourite_table.TopList, CAST(top_table.ID AS JSON), '$')
      WHERE favourite_table.ID = ?
      UNION
      SELECT bottom_table.*,
      'bottoms' AS Category
      FROM bottom_table
      JOIN favourite_table
      ON favourite_table.BottomList != '' 
      AND JSON_CONTAINS(favourite_table.BottomList, CAST(bottom_table.ID AS JSON), '$')
      WHERE favourite_table.ID = ?
      UNION
      SELECT accessories_table.*,
      'accessories' AS Category
      FROM accessories_table
      JOIN favourite_table
      ON favourite_table.AccessoriesList != '' 
      AND JSON_CONTAINS(favourite_table.AccessoriesList, CAST(accessories_table.ID AS JSON), '$')
      WHERE favourite_table.ID = ?
      UNION
      SELECT others_table.*,
      'others' AS Category
      FROM others_table
      JOIN favourite_table
      ON favourite_table.OthersList != '' 
      AND JSON_CONTAINS(favourite_table.OthersList, CAST(others_table.ID AS JSON), '$')
      WHERE favourite_table.ID = ?;
    `;
    const [rows_length] = await connection.execute(length_sql, [id]);

    const [rows] = await connection.execute(sql, [id, id, id, id]);

    await connection.end();

    if (rows_length[0] === null)  {
      return Response.json({  });
    }
    else {
      //console.log("Updated Rows data:", rows);

      if (Array.isArray(rows) && rows.length > 0) {
        wishlistItems = rows.map((row) => ({
          user: id,
          id: row.ID,
          name: row.Name,
          sizes: row.Size,
          price: row.Price,
          images: JSON.parse(row.Image_URL),
          category: row.Category,
          stock: row.Quantity,
          disc: row.Discount,
          liked: true,
        }));
      }
      //console.log("WishList data:", wishlistItems);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return wishlistItems;
};

export default async function Page({ searchParams }) {
  console.log("GetServerSideProps triggered with context:", searchParams);
  const { id } = searchParams;  // Fetch the ID from the search params

  const wishlistItems = await fetchWishlistItems(id);
  return (
    <>
    <Navbar id={id}/>
      <div className="container mx-auto p-6 pb-36 relative z-10 top-[100px]">
        <Wishlist title="Your Wishlist" products={wishlistItems} id={id} />
        <hr />
        
      </div>
    </>
  );
};

import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';  // Assuming you have this helper function for connecting to MySQL

export async function POST(request: Request) {
  try {
    const { id, cartItemId, category, mode } = await request.json();
    console.log(id + " " + cartItemId + " " + category + " " + mode);

    const connection = await createConnection();
    const retrieve_sql = `
      SELECT * FROM shoppingcart_table
      WHERE shoppingcart_table.ID = ?;
    `;

    const [rows] = await connection.execute(retrieve_sql, [id]);

    if (mode === "delete") {
      //Update Top_list
      if (category === "tops") {
        const update_top_sql = `
          UPDATE shoppingcart_table 
          SET TopList = ?
          WHERE ID = ?;
        `;
        // Parse TopList and filter out the item with the specified itemId
        let TopList = JSON.parse(rows[0].TopList || '[]').filter(
          (item: [number, { Q: string }]) => item[0] !== cartItemId
        );

        await connection.execute(update_top_sql, [TopList.length === 0 ? null : JSON.stringify(TopList), id]);
      }
    
      //Update Bottom_list
      if (category === "bottoms") {
          const update_bottom_sql = `
            UPDATE shoppingcart_table 
            SET BottomList = ?
            WHERE ID = ?;
          `;
          // Parse BottomList and filter out the item with the specified itemId
          let BottomList = JSON.parse(rows[0].BottomList || '[]').filter(
            (item: [number, { Q: string }]) => item[0] !== cartItemId
          );

          console.log(BottomList);
        
          await connection.execute(update_bottom_sql, [BottomList.length === 0 ? null : JSON.stringify(BottomList), id]);
      }
    
      //Update Accessories_list
      if (category === "accessories") {
        const update_accessories_sql = `
          UPDATE shoppingcart_table 
          SET AccessoriesList = ?
          WHERE ID = ?;
        `;
        // Parse AccessoriesList and filter out the item with the specified itemId
        let AccessoriesList = JSON.parse(rows[0].AccessoriesList || '[]').filter(
          (item: [number, { Q: string }]) => item[0] !== cartItemId
        );
      
        await connection.execute(update_accessories_sql, [AccessoriesList.length === 0 ? null : JSON.stringify(AccessoriesList), id]);
      }
    
      //Update Others_list
      if (category === "others") {
        const update_others_sql = `
          UPDATE shoppingcart_table 
          SET OthersList = ?
          WHERE ID = ?;
        `;
        // Parse OthersList and filter out the item with the specified itemId
        let OthersList = JSON.parse(rows[0].OthersList || '[]').filter(
          (item: [number, { Q: string }]) => item[0] !== cartItemId
        );
      
        await connection.execute(update_others_sql, [OthersList.length === 0 ? null : JSON.stringify(OthersList), id]);
      }

      console.log('remove Done');
      await connection.end();
    }

    else if (mode === "add") {
      //Update Top_list
      if (category === "tops") {
        const update_top_sql = `
          UPDATE shoppingcart_table 
          SET TopList = ?
          WHERE ID = ?;
        `;
        let TopList = JSON.parse(rows[0].TopList || '[]');

        // Find the index of the item in TopList, if it exists
        const existingItemIndex = TopList.findIndex((item) => item[0] === cartItemId);
        if (existingItemIndex !== -1) {
          // If the item exists, update its quantity
          TopList[existingItemIndex][1].Q = (parseInt(TopList[existingItemIndex][1].Q) + 1).toString();
        } else {
          // If the item doesn't exist, add it with quantity 1
          TopList.push([cartItemId, { Q: "1" }]);
        }
        // Sort TopList by product ID
        TopList.sort((a, b) => a[0] - b[0]);

        await connection.execute(update_top_sql, [JSON.stringify(TopList), id]);
      }

      //Update Bottom_list
      if (category === "bottoms") {
        const update_bottom_sql = `
          UPDATE shoppingcart_table 
          SET BottomList = ?
          WHERE ID = ?;
        `;
        let BottomList = JSON.parse(rows[0].BottomList || '[]');

        // Find the index of the item in TopList, if it exists
        const existingItemIndex = BottomList.findIndex((item) => item[0] === cartItemId);
        if (existingItemIndex !== -1) {
          // If the item exists, update its quantity
          BottomList[existingItemIndex][1].Q = (parseInt(BottomList[existingItemIndex][1].Q) + 1).toString();
        } else {
          // If the item doesn't exist, add it with quantity 1
          BottomList.push([cartItemId, { Q: "1" }]);
        }
        // Sort TopList by product ID
        BottomList.sort((a, b) => a[0] - b[0]);
      
        await connection.execute(update_bottom_sql, [JSON.stringify(BottomList), id]);
      }
    
      //Update Accessories_list
      if (category === "accessories") {
        const update_accessories_sql = `
          UPDATE shoppingcart_table 
          SET AccessoriesList = ?
          WHERE ID = ?;
        `;
        let AccessoriesList = JSON.parse(rows[0].AccessoriesList || '[]');
        
        // Find the index of the item in TopList, if it exists
        const existingItemIndex = AccessoriesList.findIndex((item) => item[0] === cartItemId);
        if (existingItemIndex !== -1) {
          // If the item exists, update its quantity
          AccessoriesList[existingItemIndex][1].Q = (parseInt(AccessoriesList[existingItemIndex][1].Q) + 1).toString();
        } else {
          // If the item doesn't exist, add it with quantity 1
          AccessoriesList.push([cartItemId, { Q: "1" }]);
        }
        // Sort TopList by product ID
        AccessoriesList.sort((a, b) => a[0] - b[0]);
      
        await connection.execute(update_accessories_sql, [JSON.stringify(AccessoriesList), id]);
      }
    
      //Update Others_list
      if (category === "others") {
        const update_others_sql = `
          UPDATE shoppingcart_table 
          SET OthersList = ?
          WHERE ID = ?;
        `;
        let OthersList = JSON.parse(rows[0].OthersList || '[]');
        
        // Find the index of the item in TopList, if it exists
        const existingItemIndex = OthersList.findIndex((item) => item[0] === cartItemId);
        if (existingItemIndex !== -1) {
          // If the item exists, update its quantity
          OthersList[existingItemIndex][1].Q = (parseInt(OthersList[existingItemIndex][1].Q) + 1).toString();
        } else {
          // If the item doesn't exist, add it with quantity 1
          OthersList.push([cartItemId, { Q: "1" }]);
        }
        // Sort TopList by product ID
        OthersList.sort((a, b) => a[0] - b[0]);
      
        await connection.execute(update_others_sql, [JSON.stringify(OthersList), id]);
      }

      console.log('adding Done');
      await connection.end();
    }

    console.log('Proceeding')
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
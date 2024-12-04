import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';  // Assuming you have this helper function for connecting to MySQL

export async function POST(request: Request) {
  try {
    const { id, ItemId, category, mode } = await request.json();

    const connection = await createConnection();

    const retrieve_sql = `
      SELECT * FROM favourite_table
      WHERE favourite_table.ID = ?;
    `;

    const [rows] = await connection.execute(retrieve_sql, [id]);

    if (mode === "delete") {
      //Update Top_list
      if (category === "tops") {
        const update_top_sql = `
          UPDATE favourite_table 
          SET TopList = ?
          WHERE ID = ?;
        `;
        let TopList = JSON.parse(rows[0].TopList || '[]');
        TopList = TopList.filter((item: number) => item !== ItemId);

        //if (TopList.length === 0) {
        //  TopList = "";  // Set to empty string when the array is empty
        //}

        await connection.execute(update_top_sql, [TopList.length === 0 ? null : JSON.stringify(TopList), id]);
      }
    
      //Update Bottom_list
      if (category === "bottoms") {
          const update_bottom_sql = `
            UPDATE favourite_table 
            SET BottomList = ?
            WHERE ID = ?;
          `;
          let BottomList = JSON.parse(rows[0].BottomList || '[]');
          BottomList = BottomList.filter((item: number) => item !== ItemId);
          //if (BottomList.length === 0) {
          //  BottomList = "";  // Set to empty string when the array is empty
          //}
        
          await connection.execute(update_bottom_sql, [BottomList.length === 0 ? null : JSON.stringify(BottomList), id]);
      }
    
      //Update Accessories_list
      if (category === "accessories") {
        const update_accessories_sql = `
          UPDATE favourite_table 
          SET AccessoriesList = ?
          WHERE ID = ?;
        `;
        let AccessoriesList = JSON.parse(rows[0].AccessoriesList || '[]');
        AccessoriesList = AccessoriesList.filter((item: number) => item !== ItemId);
        //if (AccessoriesList.length === 0) {
        //  AccessoriesList = "";  // Set to empty string when the array is empty
        //}
      
        await connection.execute(update_accessories_sql, [AccessoriesList.length === 0 ? null : JSON.stringify(AccessoriesList), id]);
      }
    
      //Update Others_list
      if (category === "others") {
        const update_others_sql = `
          UPDATE favourite_table 
          SET OthersList = ?
          WHERE ID = ?;
        `;
        let OthersList = JSON.parse(rows[0].OthersList || '[]');
        OthersList = OthersList.filter((item: number) => item !== ItemId);
        //if (OthersList.length === 0) {
        //  OthersList = "";  // Set to empty string when the array is empty
        //}
      
        await connection.execute(update_others_sql, [OthersList.length === 0 ? null : JSON.stringify(OthersList), id]);
      }

      console.log('remove Done');
      await connection.end();
    }

    else if (mode === "add") {
      //Update Top_list
      if (category === "tops") {
        const update_top_sql = `
          UPDATE favourite_table 
          SET TopList = ?
          WHERE ID = ?;
        `;
        let TopList = JSON.parse(rows[0].TopList || '[]');
        // Add the item if it's not already in the TopList to avoid duplicates
        if (!TopList.includes(ItemId)) {
          TopList.push(ItemId);
          TopList.sort((a: number, b: number) => a - b);
        }

        await connection.execute(update_top_sql, [JSON.stringify(TopList), id]);
      }

      //Update Bottom_list
      if (category === "bottoms") {
        const update_bottom_sql = `
          UPDATE favourite_table 
          SET BottomList = ?
          WHERE ID = ?;
        `;
        let BottomList = JSON.parse(rows[0].BottomList || '[]');
        if (!BottomList.includes(ItemId)) {
          BottomList.push(ItemId);
          BottomList.sort((a: number, b: number) => a - b);
        }
      
        await connection.execute(update_bottom_sql, [JSON.stringify(BottomList), id]);
      }
    
      //Update Accessories_list
      if (category === "accessories") {
        const update_accessories_sql = `
          UPDATE favourite_table 
          SET AccessoriesList = ?
          WHERE ID = ?;
        `;
        let AccessoriesList = JSON.parse(rows[0].AccessoriesList || '[]');
        if (!AccessoriesList.includes(ItemId)) {
          AccessoriesList.push(ItemId);
          AccessoriesList.sort((a: number, b: number) => a - b); 
        }
      
        await connection.execute(update_accessories_sql, [JSON.stringify(AccessoriesList), id]);
      }
    
      //Update Others_list
      if (category === "others") {
        const update_others_sql = `
          UPDATE favourite_table 
          SET OthersList = ?
          WHERE ID = ?;
        `;
        let OthersList = JSON.parse(rows[0].OthersList || '[]');
        if (!OthersList.includes(ItemId)) {
          OthersList.push(ItemId);
          OthersList.sort((a: number, b: number) => a - b);
        }
      
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
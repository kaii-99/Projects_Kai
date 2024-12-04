import { NextResponse } from 'next/server';
import { createConnection } from '@/lib/db';  // Assuming you have this helper function for connecting to MySQL
import { Product } from '@/components/Products';

export async function POST(request: Request) {
  try {
    const { id , collectionMode, Name , CardNum , expDate , CVCNum , Address , Postal } = await request.json();

    const connection = await createConnection();

    const retrieve_order_sql = `
        SELECT * FROM shoppingcart_table WHERE ID = ?
    `;
    const [rows] = await connection.execute(retrieve_order_sql, [id]);

    const Expiry_CVC = expDate +" "+ CVCNum;
    // Get the current date in SQL format (YYYY-MM-DD)
    const currentDate = new Date().toISOString().slice(0, 10);

    // Set Address and Postal to null if they are empty
    const addressValue = Address ? Address : null;
    const postalValue = Postal ? Postal : null;

    const insert_order_sql = `
        INSERT INTO order_table
        (Account_ID, TopList, BottomList, AccessoriesList, OthersList, CollectionMode, Date, Status, CardName, CardNumber, ExpiryDate_CVC, Address, Postal)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;

    await connection.execute(insert_order_sql, [id, rows[0].TopList, rows[0].BottomList, rows[0].AccessoriesList, rows[0].OthersList, collectionMode, currentDate, "Pending", Name, CardNum, Expiry_CVC, addressValue, postalValue]);

    if (rows[0].TopList && rows[0].TopList.length > 0) {
        const topList = typeof rows[0].TopList === 'string' 
        ? JSON.parse(rows[0].TopList) 
        : rows[0].TopList;
        const retrieve_top = `
            SELECT * FROM top_table WHERE ID = ?;
        `;

        const update_TopTable = `
            UPDATE top_table
            SET Quantity = ?
            WHERE ID = ?;
        `;

        for (const [objectid, topData] of topList) {
            const quantity = topData.Q;
            const [datas] = await connection.execute(retrieve_top, [objectid]);
            const updated_quantity = parseInt(datas[0].Quantity, 10) - parseInt(quantity, 10);
            await connection.execute(update_TopTable, [updated_quantity, objectid]);
        }
    }

    if (rows[0].BottomList && rows[0].BottomList.length > 0) {
        const bottomList = typeof rows[0].BottomList === 'string' 
        ? JSON.parse(rows[0].BottomList) 
        : rows[0].BottomList;
        const retrieve_bottom = `
            SELECT * FROM bottom_table WHERE ID = ?;
        `;

        const update_BottomTable = `
            UPDATE bottom_table
            SET Quantity = ?
            WHERE ID = ?;
        `;

        for (const [objectid, bottomData] of bottomList) {
            const quantity = bottomData.Q;
            const [datas] = await connection.execute(retrieve_bottom, [objectid]);
            const updated_quantity = parseInt(datas[0].Quantity, 10) - parseInt(quantity, 10);
            await connection.execute(update_BottomTable, [updated_quantity, objectid]);
        }
    }

    if (rows[0].AccessoriesList && rows[0].AccessoriesList.length > 0) {
        const accessoriesList = typeof rows[0].AccessoriesList === 'string' 
        ? JSON.parse(rows[0].AccessoriesList) 
        : rows[0].AccessoriesList;

        const retrieve_accessories = `
            SELECT * FROM accessories_table WHERE ID = ?;
        `;

        const update_AccessoriesTable = `
            UPDATE accessories_table
            SET Quantity = ?
            WHERE ID = ?;
        `;

        for (const [objectid, accessoryData] of accessoriesList) {

            const quantity = accessoryData.Q;
            const [datas] = await connection.execute(retrieve_accessories, [objectid]);
            const updated_quantity = parseInt(datas[0].Quantity, 10) - parseInt(quantity, 10);
            await connection.execute(update_AccessoriesTable, [updated_quantity, objectid]);
        }
    }

    if (rows[0].OthersList && rows[0].OthersList.length > 0) {
        const othersList = typeof rows[0].OthersList === 'string' 
        ? JSON.parse(rows[0].OthersList) 
        : rows[0].OthersList;

        const retrieve_others = `
            SELECT * FROM others_table WHERE ID = ?;
        `;

        const update_OthersTable = `
            UPDATE others_table
            SET Quantity = ?
            WHERE ID = ?;
        `;

        for (const [objectid, othersData] of othersList) {
            const quantity = othersData.Q;
            const [datas] = await connection.execute(retrieve_others, [objectid]);
            const updated_quantity = parseInt(datas[0].Quantity, 10) - parseInt(quantity, 10);
            await connection.execute(update_OthersTable, [updated_quantity, objectid]);
        }
    }
    
    const update_shoppingcart_sql = `
        UPDATE shoppingcart_table 
        SET TopList = null, BottomList = null, AccessoriesList = null, OthersList = null
        where ID = ?;
    `;

    await connection.execute(update_shoppingcart_sql, [id]);

    await connection.end();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating wishlist:", error);
    return NextResponse.json({ success: false, error: error.message });
  }
}
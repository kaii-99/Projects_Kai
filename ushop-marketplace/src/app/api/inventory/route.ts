import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { createConnection } from '@/lib/db'; // Adjust the import path as necessary

interface TableMap {
    [key: string]: string;
    top: string;
    bottom: string;
    accessories: string;
    others: string;
}

const tableMap: TableMap = {
    top: 'top_table',
    bottom: 'bottom_table',
    accessories: 'accessories_table',
    others: 'others_table',
};

// Fetch products by table
export async function GET(request: NextRequest) {
    const table = request.nextUrl.searchParams.get('table');
    if (!table || !tableMap[table]) {
        return NextResponse.json({ success: false, error: 'Invalid table parameter' }, { status: 400 });
    }

    const actualTableName = tableMap[table];
    const connection = await createConnection();
    try {
        const [results] = await connection.execute(
          `SELECT *, '${table}' AS category
          FROM ${actualTableName};`);
        console.log(results);
        // Parse the Image_URL for each product
        const modifiedResults = results.map(product => {
          return {
              ...product,
              Image_URL: JSON.parse(product.Image_URL) // Parse Image_URL string to array
          };
        });

        return NextResponse.json({ success: true, data: modifiedResults });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ success: false, error: 'Error fetching products' }, { status: 500 });
    } finally {
        await connection.end();
    }
}

// Delete a product by id
export async function DELETE(request: NextRequest) {
    const { id, table } = await request.json();
    const actualTableName = tableMap[table];
    if (!actualTableName) {
        return NextResponse.json({ success: false, error: 'Invalid table parameter' }, { status: 400 });
    }

    const connection = await createConnection();
    try {
        await connection.execute(`DELETE FROM ${actualTableName} WHERE ID = ?`, [id]);
        return NextResponse.json({ success: true, message: 'Product removed successfully' });
    } catch (error) {
        console.error('Error removing product:', error);
        return NextResponse.json({ success: false, error: 'Error removing product' }, { status: 500 });
    } finally {
        await connection.end();
    }
}

// Update product price and quantity
export async function PUT(request: NextRequest) {
    const { id, table, product } = await request.json();
    console.log('Received table parameter:', table); // Log the table parameter received
    const actualTableName = tableMap[table];
    if (!actualTableName) {
      console.error('Invalid table parameter:', table);
      return NextResponse.json({ success: false, error: 'Invalid table parameter' }, { status: 400 });
    }
  
    const connection = await createConnection();
    try {
      console.log('Updating product:', id, 'in table:', actualTableName);
      console.log('New price:', product.Price, 'New quantity:', product.Quantity, 'New Discount:', product.Discount);
  
      await connection.execute(`
        UPDATE ${actualTableName}
        SET Price = ?, Quantity = ?, Discount = ?
        WHERE ID = ?
      `, [
        product.Price,
        product.Quantity,
        product.Discount,
        id
      ]);
  
      console.log('Product updated successfully');
      return NextResponse.json({ success: true, message: 'Product updated successfully' });
    } catch (error) {
      console.error('Error updating product:', error);
      return NextResponse.json({ success: false, error: 'Error updating product' }, { status: 500 });
    } finally {
      await connection.end();
    }
  }
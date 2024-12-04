import { createConnection as mysqlCreateConnection } from "mysql2/promise";

// Load environment variables from .env file
require('dotenv').config();

// Create a function to establish a MySQL connection
export const createConnection = async () => {
  try {
    const connection = await mysqlCreateConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      charset: 'utf8mb4', // Optional: add charset for better encoding
    });
    console.log("Database connection successful");
    return connection;
  } catch (error) {
    console.error("Database connection error", error);
    throw error;
  }
};
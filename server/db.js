/* ===================================
   LearnHub — MySQL Database Connection
   =================================== */

const mysql = require("mysql2/promise");
const dotenv = require("dotenv");
const path = require("path");

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../.env") });

// Create a connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT, 10) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "learnhub",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verify connection on server start
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL Database connected successfully!");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
    console.error("👉 Please ensure MySQL is running on port " + (process.env.DB_PORT || 3306) + ", the database '" + (process.env.DB_NAME || "learnhub") + "' exists, and credentials in .env are correct.");
  }
}

testConnection();

module.exports = pool;

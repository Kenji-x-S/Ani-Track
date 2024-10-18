import mysql from 'mysql2/promise';

let isConnected = false;

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'ani_track',
});

const connectToDB = async () => {
  try {
    // Check if already connected
    if (isConnected) return console.log("Already connected to Database");

    // Try to establish a connection
    const connection = await pool.getConnection();
    console.log("Connected to Database");

    // Perform simple SELECT queries to check if tables exist
    await connection.query("SELECT * FROM users LIMIT 1;");
    await connection.query("SELECT * FROM posts LIMIT 1;");
    await connection.query("SELECT * FROM comments LIMIT 1;");
    await connection.query("SELECT * FROM replies LIMIT 1;");
    await connection.query("SELECT * FROM notifications LIMIT 1;");
    await connection.query("SELECT * FROM groups LIMIT 1;");
    await connection.query("SELECT * FROM saved LIMIT 1;");

    // Release the connection back to the pool
    connection.release();

    // Mark as connected
    isConnected = true;
  } catch (error: any) {
    console.log(`Failed to connect to Database: ${error.message}`);
  }
};

export { connectToDB };

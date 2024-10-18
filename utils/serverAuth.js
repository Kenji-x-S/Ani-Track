import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Create a MySQL connection pool
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  connectionLimit: process.env.MYSQL_CONNECTION_LIMIT || 10,
});

const serverAuth = async (req, res) => {
  try {
    // Establish a connection
    const connection = await pool.getConnection();

    // Get the current session
    const session = await getServerSession(req, res, authOptions);

    // If the session does not exist or has no user email
    if (!session?.user?.email) {
      return res.status(404).json("Not signed in");
    }

    // Fetch the current user from the MySQL database
    const [rows] = await connection.query(
      "SELECT * FROM users WHERE email = ? LIMIT 1", 
      [session.user.email]
    );

    // Release the connection back to the pool
    connection.release();

    // If no user was found in the database
    if (rows.length === 0) {
      return res.status(404).json("Not signed in");
    }

    const currentUser = rows[0];

    // Return the current user object
    return { currentUser };
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal server error");
  }
};

export default serverAuth;

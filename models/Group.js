// models/groups.js
import pool from '../utils/db'; // Adjust the path as necessary

// Function to create the groups table
const createGroupsTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS groups (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      desc TEXT NOT NULL,
      creator_id INT NOT NULL,
      img_url VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      members JSON,
      FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  try {
    const [results] = await pool.query(sql);
    console.log('Groups table created successfully:', results);
  } catch (error) {
    console.error('Error creating groups table:', error);
  }
};

// Call the function to create the table when needed (e.g., on server start)
createGroupsTable();

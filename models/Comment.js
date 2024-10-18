import pool from '../utils/db'; 

const createCommentsTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS comments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      creator_id INT NOT NULL,
      post_id INT NOT NULL,
      desc TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      replies JSON,
      likes JSON,
      FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
    );
  `;

  try {
    const [results] = await pool.query(sql);
    console.log('Comments table created successfully:', results);
  } catch (error) {
    console.error('Error creating comments table:', error);
  }
};
createCommentsTable();

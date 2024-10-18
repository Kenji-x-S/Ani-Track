// models/notifications.js
import pool from '../utils/db'; // Adjust the path as necessary

// Function to create the notifications table
export const createNotificationsTable = async () => {
  const sql = `
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      desc TEXT,
      url VARCHAR(255),
      img_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  try {
    const [results] = await pool.query(sql);
    console.log('Notifications table created successfully:', results);
  } catch (error) {
    console.error('Error creating notifications table:', error);
  }
};

// Function to insert a new notification
export const insertNotification = async (userId, desc, url, imgUrl) => {
  const sql = `
    INSERT INTO notifications (user_id, desc, url, img_url) 
    VALUES (?, ?, ?, ?);
  `;

  try {
    const [results] = await pool.query(sql, [userId, desc, url, imgUrl]);
    console.log('Notification inserted successfully:', results);
    return results.insertId; // Return the ID of the newly inserted notification
  } catch (error) {
    console.error('Error inserting notification:', error);
  }
};

// Example call to create the table when the server starts
createNotificationsTable();

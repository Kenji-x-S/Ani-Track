// pages/api/auth/signup.ts

import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { query } from '../../../lib/db';  // Adjust based on your actual path

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { name, email, password } = req.body;

    try {
      // Query database for existing user
      const existingUser: any = await query('SELECT * FROM users WHERE email = ?', [email]);

      // Check if a user exists
      if (Array.isArray(existingUser) && existingUser.length > 0) {
        return res.status(400).json({ message: 'Email already exists.' });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Insert new user into the database
      await query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
        name,
        email,
        hashedPassword,
      ]);

      res.status(200).json({ message: 'User created successfully.' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error.' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed.' });
  }
}

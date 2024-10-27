import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { getPool } from "@/lib/pool";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(StatusCodes.METHOD_NOT_ALLOWED);
    return res.json({ error: "Method not allowed" });
  }

  const { username, password, name, bio, email } = req.body;

  if (!username || !password || !name || !email) {
    res.status(StatusCodes.BAD_REQUEST);
    return res.json({ error: "All fields are required" });
  }

  try {
    const pool = await getPool();
    const hashedPassword = await bcrypt.hash(password, 10);

    const [result]: any = await pool.execute(
      `INSERT INTO users (username, password, name, bio, email) VALUES (?, ?, ?, ?, ?)`,
      [username, hashedPassword, name, bio, email]
    );

    res.status(StatusCodes.CREATED);
    res.json({
      message: "User created successfully",
      userId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ error: "Internal server error" });
  }
}

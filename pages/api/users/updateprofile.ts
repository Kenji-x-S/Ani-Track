import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { getPool } from "@/lib/pool";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(StatusCodes.METHOD_NOT_ALLOWED);
    return res.json({ error: "Method not allowed" });
  }

  const session = await getServerSession(req, res, options);
  if (!session) {
    res.status(StatusCodes.UNAUTHORIZED);
    return res.json({ error: "Unauthorized" });
  }

  const { username, password, name, bio, email } = req.body;
  const userId = session.user.id;
  if (!username || !name || !email) {
    res.status(StatusCodes.BAD_REQUEST);
    return res.json({ error: "Username, name, and email are required" });
  }

  try {
    const pool = await getPool();
    const fieldsToUpdate: any[] = [username, name, bio, email];
    let query = `UPDATE users SET username = ?, name = ?, bio = ?, email = ? WHERE id = ?`;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      fieldsToUpdate.push(hashedPassword);
      query = `UPDATE users SET username = ?, name = ?, bio = ?, email = ?, password = ? WHERE id = ?`;
    }
    await pool.execute(query, [...fieldsToUpdate, userId]);

    res.status(StatusCodes.OK);
    res.json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ error: "Internal server error" });
  }
}

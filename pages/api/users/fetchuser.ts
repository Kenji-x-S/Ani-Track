import { getPool } from "@/lib/pool";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
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

  try {
    const session = await getServerSession(req, res, options);
    if (!session) {
      res.status(StatusCodes.UNAUTHORIZED);
      return res.json({ error: "Unauthorized" });
    }

    const pool = await getPool();
    const userId = parseInt(req.body.id);

    if (isNaN(userId)) {
      res.status(StatusCodes.BAD_REQUEST);
      return res.json({ error: "Invalid user ID" });
    }
    const [rows]: any = await pool.execute(`SELECT * FROM users WHERE id = ?`, [
      userId,
    ]);

    if (!rows || rows.length === 0) {
      res.status(StatusCodes.NOT_FOUND);
      return res.json({ error: "User not found" });
    }

    const [following]: any = await pool.execute(
      `SELECT * FROM follows WHERE followerId = ?`,
      [userId]
    );
    const [followers]: any = await pool.execute(
      `SELECT * FROM follows WHERE followingId = ?`,
      [userId]
    );

    rows[0].followers = followers;
    rows[0].following = following;

    res.status(StatusCodes.OK).json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Internal server error" });
  }
}

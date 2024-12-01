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
    let threads: any[] = [];

    const [rows]: any = await pool.execute(
      `SELECT * FROM threads ORDER BY createdAt DESC`
    );
    for (const r of rows) {
      const [creator]: any = await pool.execute(
        `SELECT * FROM users WHERE id = ?`,
        [r.creatorId]
      );
      const [threadUsers]: any = await pool.execute(
        `SELECT * FROM threadusers WHERE threadId = ?`,
        [r.id]
      );
      const threadusersConnected = [];
      for (const t of threadUsers) {
        const [user]: any = await pool.execute(
          `SELECT * FROM users WHERE id = ?`,
          [t.userId]
        );
        threadusersConnected.push(user[0]);
      }

      threads.push({
        ...r,
        creator: creator[0],
        threadUsers: threadusersConnected,
      });
    }
    res.status(StatusCodes.OK);
    res.json(threads);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ error: "Internal server error" });
  }
}

import { getPool } from "@/lib/pool";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.status(StatusCodes.METHOD_NOT_ALLOWED);
    return res.json({ error: "Method not allowed" });
  }

  try {
    const pool = await getPool();
    let users: any[] = [];

    if (req.body.action === "view") {
      const [rows]: any = await pool.execute(
        `SELECT * FROM users WHERE username = ? AND id != ?`,
        [req.body.username, req.body.id]
      );
      users = rows;
    } else {
      const [rows]: any = await pool.execute(
        `SELECT * FROM users WHERE username = ?`,
        [req.body.username]
      );
      users = rows;
    }

    res.status(StatusCodes.OK);
    res.json(!(users.length > 0));
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ error: "Internal server error" });
  }
}

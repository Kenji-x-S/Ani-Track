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
    let groups: any[] = [];

    const [rows]: any = await pool.execute(
      `SELECT * FROM users WHERE id != ?`,
      [session.user.id]
    );

    res.status(StatusCodes.OK);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ error: "Internal server error" });
  }
}

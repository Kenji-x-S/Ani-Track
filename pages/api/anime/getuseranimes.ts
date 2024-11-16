import { getPool } from "@/lib/pool";
import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]";
import axios from "axios";

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

    const [rows]: any = await pool.execute(
      `SELECT * FROM animelist WHERE userId = ?`,
      [session.user.id]
    );
    const withDataList = [];
    for (const row of rows) {
      try {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const response = await axios.get(
          `https://api.jikan.moe/v4/anime/${row.animeId}`
        );
        withDataList.push({
          ...response?.data.data,
          status: row.status,
          review: row.review,
          rating: row.rating,
        });
      } catch (error) {}
    }

    res.status(StatusCodes.OK);
    res.json(withDataList);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ error: "Internal server error" });
  }
}

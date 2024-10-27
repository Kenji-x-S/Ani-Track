import { StatusCodes } from "http-status-codes";
import { NextApiRequest, NextApiResponse } from "next";
import { getPool } from "@/lib/pool";
import { getServerSession } from "next-auth";
import { options } from "../auth/[...nextauth]";
import uploadFile from "@/lib/uploader";
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "300mb",
    },
  },
};

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

  const { threadTitle, threadDescription } = req.body;

  if (!threadTitle || !threadDescription) {
    res.status(StatusCodes.BAD_REQUEST);
    return res.json({ error: "All fields are required" });
  }

  try {
    const pool = await getPool();
    let image;
    if (req.body.uploadCheck) {
      image = await uploadFile(req.body.image);
    }
    const [result]: any = await pool.execute(
      `INSERT INTO threads (creatorId, threadTitle, threadDescription, image) VALUES (?, ?, ?, ?)`,
      [session.user.id, threadTitle, threadDescription, image]
    );

    res.status(StatusCodes.CREATED);
    res.json({
      message: "Thread created successfully",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ error: "Internal server error" });
  }
}

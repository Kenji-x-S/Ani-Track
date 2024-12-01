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
    const [rows]: any = await pool.execute(`SELECT * FROM posts WHERE id = ?`, [
      parseInt(req.body.id),
    ]);

    if (!rows || rows?.length === 0) {
      res.status(StatusCodes.NOT_FOUND);
      res.json({ error: "Thread not found" });
      return;
    }

    const [creator]: any = await pool.execute(
      `SELECT * FROM users WHERE id = ?`,
      [rows[0].creatorId]
    );
    const comments = await getCommentsForThread(rows[0].id);
    const thread = {
      ...rows[0],
      creator: creator[0],
      comments,
    };

    res.status(StatusCodes.OK);
    res.json(thread);
  } catch (error) {
    console.error(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR);
    res.json({ error: "Internal server error" });
  }
}

async function getCommentWithReplies(commentId: number, pool: any) {
  // Fetch the main comment
  const [comments]: any = await pool.execute(
    `SELECT * FROM comment WHERE id = ?`,
    [commentId]
  );

  if (comments.length === 0) return null; // If no comment found, return null

  const comment = comments[0];

  // Fetch creator (author) details for the comment
  const [users]: any = await pool.execute(
    `SELECT id, username, email, profilePicture, name FROM users WHERE id = ?`,
    [comment.authorId]
  );

  comment.creator = users[0]; // Attach creator details to the comment

  // Fetch replies for the comment
  const [replies]: any = await pool.execute(
    `SELECT * FROM comment WHERE parentCommentId = ? ORDER BY createdAt ASC`,
    [comment.id]
  );

  // Recursively get replies for each reply
  comment.replies = [];
  for (const reply of replies) {
    const nestedReply = await getCommentWithReplies(reply.id, pool);
    if (nestedReply) comment.replies.push(nestedReply);
  }

  return comment;
}

// Main function to get all top-level comments for a thread and their nested replies with creator details
export async function getCommentsForThread(postId: number) {
  const pool = await getPool();
  const comments = [];
  const [topLevelComments]: any = await pool.execute(
    `SELECT * FROM comment WHERE postId = ? AND parentCommentId IS NULL ORDER BY createdAt ASC`,
    [postId]
  );

  for (const topLevelComment of topLevelComments) {
    const [users]: any = await pool.execute(
      `SELECT id, username, email FROM users WHERE id = ?`,
      [topLevelComment.authorId]
    );

    topLevelComment.creator = users[0];
    const commentWithReplies = await getCommentWithReplies(
      topLevelComment.id,
      pool
    );
    if (commentWithReplies) {
      comments.push(commentWithReplies);
    }
  }
  return comments;
}

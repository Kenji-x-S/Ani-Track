import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Comment = ({ id, content, creator, replies = [], onReply }: any) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");

  const handleReply = async () => {
    await onReply(id, replyContent);
    setReplyContent("");
    setIsReplying(false);
  };

  return (
    <Card className="p-4 mb-4 w-full">
      <div className="flex gap-2 items-center">
        <Avatar className="h-12 w-12">
          <AvatarImage src={`/${creator?.profilePicture}`} alt="@shadcn" />
          <AvatarFallback>
            {creator?.name?.slice(0, 2)?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="">
          <p className="font-semibold">{creator?.name}</p>
          <p className="text-sm">@{creator?.username}</p>
        </div>
      </div>
      <p className="mt-2 text-gray-800">{content}</p>

      <div className="flex items-center mt-4 space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsReplying(!isReplying)}
        >
          {isReplying ? "Cancel" : "Reply"}
        </Button>
      </div>

      {isReplying && (
        <div className="mt-2">
          <Textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="Write a reply..."
          />
          <Button size="sm" className="mt-2" onClick={handleReply}>
            Submit Reply
          </Button>
        </div>
      )}

      {replies && replies.length > 0 && (
        <div className="mt-4 ml-4 border-l-2 border-gray-200 pl-4">
          <CommentList comments={replies} onReply={onReply} />
        </div>
      )}
    </Card>
  );
};

const CommentList = ({ comments, onReply }: any) => {
  return (
    <div>
      {comments.map((comment: any) => (
        <Comment
          key={comment.id}
          id={comment.id}
          content={comment.content}
          creator={comment.creator}
          replies={comment.replies}
          onReply={onReply}
        />
      ))}
    </div>
  );
};

export default CommentList;

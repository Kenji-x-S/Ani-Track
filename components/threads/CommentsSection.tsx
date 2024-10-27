import CommentList from "./CommentList";
import axios from "axios";

const CommentsSection = ({ comments, setRefresh, id }: any) => {
  const addReply = async (parentCommentId: number, content: string) => {
    console.log(parentCommentId, content);
    try {
      const response = await axios.post("/api/threads/addcomment", {
        id,
        parentCommentId,
        comment: content,
      });
    } catch (error: any) {
      // toast?.error(
      //   error?.response?.data?.error || error?.error || error?.message
      // );
    } finally {
      setRefresh((prev: boolean) => !prev);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-lg font-semibold">Comments</h2>
      <CommentList comments={comments} onReply={addReply} />
    </div>
  );
};

export default CommentsSection;

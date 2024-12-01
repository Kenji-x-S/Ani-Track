import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { AlertInterface } from "@/types";
import Alert from "../alert/Alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import PageContainer from "../ui/page-container";
import Loader from "../ui/loader";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import CommentsSection from "./CommentsSection";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export default function ThreadPostListing({ id }: { id: string }) {
  const { push } = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      push("/sign-in");
    },
  });
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [alert, setAlert] = useState<AlertInterface | null>(null);

  const [thread, setThread] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchThread = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/posts/fetchpostdetails", {
          id,
        });
        setThread(response.data);
      } catch (error: any) {
        toast?.error(
          error?.response?.data?.error || error?.error || error?.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchThread();
  }, [refresh]);
  const [comment, setComment] = useState("");
  const addComment = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/posts/addcomment", {
        id,
        comment,
      });
      setComment("");
    } catch (error: any) {
      toast?.error(
        error?.response?.data?.error || error?.error || error?.message
      );
    } finally {
      setRefresh(!refresh);
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <Card>
        <Loader loading={loading} />
        <Alert alert={alert} />
        <CardHeader>
          <div className="flex gap-2 items-center">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={`/${thread?.creator?.profilePicture}`}
                alt="@shadcn"
              />
              <AvatarFallback>
                {thread?.creator?.name?.slice(0, 2)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="">
              <p className="font-semibold">{thread?.creator?.name}</p>
              <p className="text-sm">@{thread?.creator?.username}</p>
            </div>
          </div>
          <CardTitle>
            <p>{thread?.title}</p>
          </CardTitle>
          <CardDescription>
            <p>{thread?.description}</p>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <Card className="w-full">
              <CardContent>
                <CommentsSection
                  comments={thread?.comments || []}
                  setRefresh={setRefresh}
                  id={id}
                />
              </CardContent>

              <CardFooter>
                <div className="flex gap-2">
                  <Input
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Add a comment..."
                  />
                  <Button disabled={!comment} onClick={addComment}>
                    Add Comment
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

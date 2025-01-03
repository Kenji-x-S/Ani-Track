"use client";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ThreadPostListing from "@/components/posts/ThreadPostListing";

const Post = ({ params }: { params: { id: string } }) => {
  const { push } = useRouter();
  const { data: session, status }: any = useSession({
    required: true,
    onUnauthenticated() {
      push("/sign-in");
    },
  });
  const pathname = usePathname();
  return (
    <div className="w-full">
      {session ? <ThreadPostListing id={params.id} /> : <div></div>}
    </div>
  );
};

export default Post;

"use client";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import PostsListing from "@/components/posts/PostListing";

const SectionList = () => {
  const { push } = useRouter();
  const { data: session, status }: any = useSession({
    required: true,
    onUnauthenticated() {
      push("/sign-in");
    },
  });
  const pathname = usePathname();
  return (
    <div className="w-full">{session ? <PostsListing /> : <div></div>}</div>
  );
};

export default SectionList;

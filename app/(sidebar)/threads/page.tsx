"use client";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ThreadListing from "@/components/threads/ThreadListing";

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
    <div className="w-full">{session ? <ThreadListing /> : <div></div>}</div>
  );
};

export default SectionList;

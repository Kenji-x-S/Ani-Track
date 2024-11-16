"use client";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import ThreadListing from "@/components/threads/ThreadListing";
import GroupListing from "@/components/groups/GroupListing";

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
    <div className="w-full">{session ? <GroupListing /> : <div></div>}</div>
  );
};

export default SectionList;

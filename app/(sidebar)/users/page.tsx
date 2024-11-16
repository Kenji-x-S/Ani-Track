"use client";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import UserListing from "@/components/users/UserListing";

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
    <div className="w-full">{session ? <UserListing /> : <div></div>}</div>
  );
};

export default SectionList;

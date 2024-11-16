"use client";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Profile from "@/components/profile/Profile";

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
    <div className="w-full">
      {session ? <Profile session={session} /> : <div></div>}
    </div>
  );
};

export default SectionList;

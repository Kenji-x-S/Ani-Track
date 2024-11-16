import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import * as yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import { AlertInterface } from "@/types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "../ui/dialog";
import Alert from "../alert/Alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import PageContainer from "../ui/page-container";
import Loader from "../ui/loader";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Settings } from "lucide-react";
import { IconEdit, IconSettings, IconTrash } from "@tabler/icons-react";
import Image from "next/image";

export default function UserListing() {
  const { push } = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      push("/sign-in");
    },
  });
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [refresh, setRefresh] = useState(false);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState<Record<string, any>>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/users/fetchusers");
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.error || error?.error || error?.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [refresh]);

  const handleSearch = (e: any) => {
    setSearch(e.target.value);
    if (e.target.value === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter(
          (item: any) =>
            item.name?.toLowerCase().includes(e.target.value.toLowerCase()) ||
            item?.username?.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    }
  };
  const router = useRouter();
  return (
    <PageContainer>
      <Card>
        <Loader loading={loading} />
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">People</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2 justify-between mb-4">
            <Input
              className="w-full sm:max-w-xs"
              placeholder="Search People"
              id="search"
              name="search"
              value={search}
              onChange={handleSearch}
            />
          </div>

          <div className="flex gap-4 flex-wrap">
            {filteredUsers.map((t: any) => (
              <Card onClick={() => router.push(`/users/${t?.id}`)}>
                <CardContent>
                  <div className="flex gap-2 items-center min-h-32 min-w-52">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`/${t?.profilePicture}`}
                        alt="@shadcn"
                      />
                      <AvatarFallback>
                        {t?.name?.slice(0, 2)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="">
                      <p className="font-semibold">{t?.name}</p>
                      <p className="text-sm">@{t?.username}</p>
                    </div>
                  </div>
                  <p className="text-sm">{t?.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

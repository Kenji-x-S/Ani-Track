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
import AddGroupDialog from "./AddGroupDialog";
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

export default function GroupListing() {
  const { push } = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      push("/sign-in");
    },
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [action, setAction] = useState("create");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [groupId, setGroupId] = useState<number | null>(null);
  const [alert, setAlert] = useState<AlertInterface | null>(null);
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState<Record<string, any>>([]);

  const [uploadCheck, setUploadCheck] = useState(false);

  const handleCreate = () => {
    setOpen(true);
  };

  const [group, setGroup] = useState({
    image: "",
    title: "",
    description: "",
  });

  const validationSchema = yup.object({
    title: yup
      .string()
      .required("Group Title is required")
      .min(3, "Group Title must be at least 3 characters")
      .max(50, "Group Title must be at most 50 characters"),
    description: yup
      .string()
      .required("Group Description is required")
      .min(3, "Group Description must be at least 3 characters")
      .max(500, "Group Description must be at most 500 characters"),
  });

  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: true,
    initialValues: group,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let url = "/api/groups/addgroup";
      if (action == "view") {
        url = "/api/groups/updategroup";
      }
      const manageGroup = async () => {
        try {
          setLoading(true);
          const response = await axios.post(url, { ...values, uploadCheck });
          console.log(response.data);
          setAlert({
            open: true,
            title: "Success",
            description:
              action == "create"
                ? "Group Created Successfully"
                : "Group Updated Successfully",
            callback: () => {
              setAlert({ open: false });
            },
          });
        } catch (error: any) {
          toast.error(
            error?.response?.data?.error || error?.error || error?.message
          );
        } finally {
          setLoading(false);
          setRefresh((prev) => !prev);
          handleClose();
        }
      };
      manageGroup();
    },
  });

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/groups/fetchgroups");
        setGroups(response.data);
        setFilteredGroups(response.data);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.error || error?.error || error?.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, [refresh]);

  const deleteItem = async () => {
    try {
      setLoading(true);
      setOpenDeleteDialog(false);
      const response = await axios.post("/api/groups/deletegroup", {
        id: groupId,
      });
      setAlert({
        open: true,
        title: "Success",
        description: "Group Deleted Successfully",
        callback: () => {
          setAlert({ open: false });
        },
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || error?.error || error?.message
      );
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
      setRefresh((prev) => !prev);
    }
  };
  const joinGroup = async (id: number) => {
    try {
      setLoading(true);
      setOpenDeleteDialog(false);
      const response = await axios.post("/api/groups/joingroup", {
        id,
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || error?.error || error?.message
      );
    } finally {
      setLoading(false);
      setRefresh((prev) => !prev);
    }
  };
  const leaveGroup = async (id: number) => {
    try {
      setLoading(true);
      setOpenDeleteDialog(false);
      const response = await axios.post("/api/groups/leavegroup", {
        id,
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || error?.error || error?.message
      );
    } finally {
      setLoading(false);
      setRefresh((prev) => !prev);
    }
  };

  const handleEdit = async (row: any) => {
    setAction("view");
    formik.setValues(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setAction("create");
    formik.resetForm();
    setUploadCheck(false);
  };

  const handleSearch = (e: any) => {
    setSearch(e.target.value);
    if (e.target.value === "") {
      setFilteredGroups(groups);
    } else {
      setFilteredGroups(
        groups.filter(
          (item: any) =>
            item.title?.toLowerCase().includes(e.target.value.toLowerCase()) ||
            item?.description
              ?.toLowerCase()
              .includes(e.target.value.toLowerCase())
        )
      );
    }
  };
  const router = useRouter();
  return (
    <PageContainer>
      <Card>
        <Loader loading={loading} />
        <Alert alert={alert} />
        <CardHeader>
          <CardTitle className="text-xl md:text-2xl">Groups</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2 justify-between mb-4">
            <Input
              className="w-full sm:max-w-xs"
              placeholder="Search Groups"
              id="search"
              name="search"
              value={search}
              onChange={handleSearch}
            />
            <Button
              onClick={handleCreate}
              color="primary"
              className="w-full sm:w-auto"
            >
              Create Group
            </Button>
          </div>

          <AddGroupDialog
            formik={formik}
            open={open}
            setOpen={setOpen}
            action={action}
            handleClose={handleClose}
            uploadCheck={uploadCheck}
            setUploadCheck={setUploadCheck}
          />

          <Dialog open={openDeleteDialog}>
            <DialogContent>
              <DialogTitle className="text-center">
                Are you sure you want to delete this group?
              </DialogTitle>
              <DialogFooter>
                <Button variant="destructive" onClick={deleteItem}>
                  Yes
                </Button>
                <Button onClick={() => setOpenDeleteDialog(false)}>No</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <div className="flex gap-4 flex-wrap">
            {filteredGroups.map((t: any) => (
              <Card>
                <CardHeader>
                  <div className="flex gap-2 items-center">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={`/${t.creator?.profilePicture}`}
                        alt="@shadcn"
                      />
                      <AvatarFallback>
                        {t.creator?.name?.slice(0, 2)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="">
                      <p className="font-semibold">{t.creator?.name}</p>
                      <p className="text-sm">@{t.creator?.username}</p>
                    </div>
                  </div>
                  <CardTitle>
                    <h1>{t.title}</h1>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {t.image && (
                    <Image src={t.image} alt="image" width={500} height={500} />
                  )}
                  <p>{t.description}</p>
                </CardContent>
                <CardFooter>
                  {t.groupUsers?.slice(0, 5).map((u: any) => (
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`/${u?.profilePicture}`}
                        alt="@shadcn"
                      />
                      <AvatarFallback>
                        {u?.name?.slice(0, 2)?.toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}

                  {t.creatorId === session?.user?.id ? (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="default">
                          <IconSettings />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => {
                            handleEdit(t);
                          }}
                        >
                          <IconEdit className="mr-2 h-4 w-4" />
                          <span>Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setGroupId(t.id);
                            setOpenDeleteDialog(true);
                          }}
                        >
                          <IconTrash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  ) : (
                    <div className="ml-2">
                      {t.creatorId !== session?.user?.id &&
                      !t.groupUsers?.find(
                        (u: any) => u.id === session?.user?.id
                      ) ? (
                        <Button onClick={() => joinGroup(t.id)}>
                          Join Group
                        </Button>
                      ) : (
                        <Button onClick={() => leaveGroup(t.id)}>
                          Leave Group
                        </Button>
                      )}
                    </div>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

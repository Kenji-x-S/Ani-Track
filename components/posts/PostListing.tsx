import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
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
import AddPostDialog from "./AddPostDialog";
import { threadId } from "worker_threads";

export default function PostsListing() {
  const { push } = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      push("/sign-in");
    },
  });
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [action, setAction] = useState("create");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [postId, setPostId] = useState<number | null>(null);
  const [alert, setAlert] = useState<AlertInterface | null>(null);
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState<Record<string, any>>([]);

  const [uploadCheck, setUploadCheck] = useState(false);

  const handleCreate = () => {
    setOpen(true);
  };

  const [post, setPost] = useState({
    image: "",
    title: "",
    description: "",
    threadId: null,
  });

  const validationSchema = yup.object({
    title: yup
      .string()
      .required("Post Title is required")
      .min(3, "Post Title must be at least 3 characters")
      .max(50, "Post Title must be at most 50 characters"),
    description: yup
      .string()
      .required("Post Description is required")
      .min(3, "Post Description must be at least 3 characters")
      .max(500, "Post Description must be at most 500 characters"),
  });

  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: true,
    initialValues: post,
    validationSchema: validationSchema,
    onSubmit: (values) => {
      let url = "/api/posts/addpost";
      if (action == "view") {
        url = "/api/posts/updatepost";
      }
      const managePost = async () => {
        try {
          setLoading(true);
          const response = await axios.post(url, {
            ...values,
            uploadCheck,
            threadId: searchParams?.get("threadId"),
          });
          console.log(response.data);
          setAlert({
            open: true,
            title: "Success",
            description:
              action == "create"
                ? "Post Created Successfully"
                : "Post Updated Successfully",
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
      managePost();
    },
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/posts/fetchposts", {
          threadId: searchParams?.get("threadId"),
        });
        setPosts(response.data);
        setFilteredPosts(response.data);
      } catch (error: any) {
        toast.error(
          error?.response?.data?.error || error?.error || error?.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [refresh, searchParams]);

  const deleteItem = async () => {
    try {
      setLoading(true);
      setOpenDeleteDialog(false);
      const response = await axios.post("/api/posts/deletepost", {
        id: postId,
      });
      setAlert({
        open: true,
        title: "Success",
        description: "Post Deleted Successfully",
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
      setFilteredPosts(posts);
    } else {
      setFilteredPosts(
        posts.filter(
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
          <CardTitle className="text-xl md:text-2xl">Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2 justify-between mb-4">
            <Input
              className="w-full sm:max-w-xs"
              placeholder="Search Threads"
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
              Create Post
            </Button>
          </div>

          <AddPostDialog
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
                Are you sure you want to delete this thread?
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
            {filteredPosts.map((t: any) => (
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
                  {t.threadUsers?.slice(0, 5).map((u: any) => (
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

                  {t.creatorId === session?.user?.id && (
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
                            setPostId(t.id);
                            setOpenDeleteDialog(true);
                          }}
                        >
                          <IconTrash className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  <Button onClick={() => router.push(`/thread-posts/${t.id}`)}>
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </PageContainer>
  );
}

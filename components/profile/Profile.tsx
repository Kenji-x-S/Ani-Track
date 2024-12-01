import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useState } from "react";
import axios from "axios";
import { Carousel } from "../ui/carousel";
import { Button } from "../ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Dialog, DialogContent, DialogFooter } from "../ui/dialog";
import { Textarea } from "../ui/textarea";
import { DialogTitle } from "@radix-ui/react-dialog";
import UpdateProfile from "./UpdateProfile";

export default function Profile({ session }: { session: any }) {
  const [animes, setAnimes] = useState<Record<string, any>[]>([]);
  const [editIndex, setEditIndex] = useState(null);
  const [status, setStatus] = useState<string | null>();
  const [openReview, setOpenReview] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [follow, setFollow] = useState({
    followers: [],
    following: [],
  });
  const [review, setReview] = useState({
    rating: 0,
    text: "",
  });
  const fetchAnimes = async () => {
    try {
      const response = await axios.post(`/api/anime/getuseranimes`);
      setAnimes(response.data);
    } catch {}
  };
  const fetchFollows = async () => {
    try {
      const response = await axios.post(`/api/users/followinfo`);
      setFollow(response.data);
    } catch {}
  };

  const addToWatchList = async (id: number, status: boolean) => {
    try {
      await axios.post("/api/watchlist/removefromwatchlist", { id });
      setAnimes(animes.filter((anime) => anime.mal_id !== id));
      setEditIndex(null);
    } catch (error) {}
  };
  const updateAnimeStatus = async (id: number, status: string | null) => {
    try {
      await axios.post("/api/anime/changestatus", { id, status });
      setAnimes(
        animes.map((anime) =>
          anime.mal_id === id ? { ...anime, status } : anime
        )
      );
      setEditIndex(null);
      setStatus(null);
    } catch (error) {}
  };
  const submitReview = async () => {
    try {
      await axios.post("/api/review/addreview", { ...review, id: editIndex });

      fetchAnimes();
    } catch (error) {
    } finally {
      setOpenReview(false);
      setEditIndex(null);
      setReview({ rating: 0, text: "" });
    }
  };
  useEffect(() => {
    fetchAnimes();
    fetchFollows();
  }, []);
  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center gap-4">
      <Dialog open={openReview}>
        <DialogContent>
          <DialogTitle>Write a Review</DialogTitle>
          <Select
            value={review.rating as any}
            onValueChange={(selectedValue) => {
              setReview((prevReview) => ({
                ...prevReview,
                rating: selectedValue as any,
              }));
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Rating" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup className="max-h-52 overflow-y-auto">
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Textarea
            value={review.text}
            onChange={(e) => {
              setReview((prevReview) => ({
                ...prevReview,
                text: e.target.value,
              }));
            }}
            className="mt-2"
            placeholder="Enter your review"
          />
          <DialogFooter>
            <Button
              onClick={submitReview}
              disabled={!review.text || !review.rating}
            >
              Submit
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setOpenReview(false);
                setEditIndex(null);
                setReview({ rating: 1, text: "" });
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4 pb-2">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage
              src={session?.user?.profilePicture}
              alt={`${name}'s profile picture`}
            />
            <AvatarFallback>{session?.user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left space-y-1">
            <h1 className="text-2xl font-bold">{session?.user?.name}</h1>
            <p className="text-muted-foreground">{session?.user?.username}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4 space-y-2">
            <h2 className="text-lg font-semibold">Bio</h2>
            <p className="text-muted-foreground">{session?.user?.bio}</p>
          </div>

          <div className="flex gap-6">
            <div className=" flex items-center gap-1">
              <h2 className="text-lg font-semibold">Followers</h2>
              <p className="text-muted-foreground">
                {follow?.followers?.length}
              </p>
            </div>
            <div className=" flex items-center gap-1">
              <h2 className="text-lg font-semibold">Following</h2>
              <p className="text-muted-foreground">
                {follow?.following?.length}
              </p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={() => setOpenEdit(true)}>Edit Profile</Button>
        </CardFooter>
      </Card>

      <UpdateProfile session={session} open={openEdit} setOpen={setOpenEdit} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {animes.map((anime) => (
          <Card key={anime.mal_id} className="shadow-lg">
            <Carousel className="mb-4">
              {anime.images.jpg.large_image_url && (
                <img
                  src={anime.images.jpg.large_image_url}
                  alt={anime.title}
                  className="w-full h-48 object-cover rounded-t-md"
                />
              )}
            </Carousel>
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">{anime.title}</h3>
              <p className="text-sm text-gray-600">
                Year: {anime.year || "N/A"} | Duration:{" "}
                {anime.duration || "N/A"}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Genres:{" "}
                {anime.genres.map((genre: any) => genre.name).join(", ")}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Status: {anime.status}
              </p>
            </CardContent>
            <CardFooter className="flex flex-col space-x-3">
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => addToWatchList(anime.mal_id, false)}
              >
                Remove
              </Button>
              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => {
                  setEditIndex((prev) => (prev ? null : anime.mal_id));
                  setStatus(anime.status);
                }}
              >
                {editIndex === anime.mal_id ? "Cancel" : "Change Status"}
              </Button>

              <div className="flex gap-3 items-end mt-4 justify-start w-full">
                {editIndex === anime.mal_id && (
                  <>
                    <Select
                      value={status as any}
                      onValueChange={(selectedValue) => {
                        setStatus(selectedValue);
                      }}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup className="max-h-52 overflow-y-auto">
                          <SelectItem value="Watching">Watching</SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                          <SelectItem value="Dropped">Dropped</SelectItem>
                          <SelectItem value="PlanToWatch">
                            PlanToWatch
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>

                    <Button
                      variant="outline"
                      className="w-full mt-2"
                      onClick={() =>
                        updateAnimeStatus(anime.mal_id, status as any)
                      }
                    >
                      Update
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                className="w-full mt-2"
                onClick={() => {
                  if (editIndex === anime.mal_id) {
                    setEditIndex(null);
                  } else {
                    setEditIndex(anime.mal_id);
                    setOpenReview(true);
                    setReview({
                      rating: anime.rating?.toString() || 1,
                      text: anime.review || "",
                    });
                  }
                }}
              >
                {anime.review ? "Edit Review" : "Add Review"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

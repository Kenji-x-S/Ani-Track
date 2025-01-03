import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { AlertInterface } from "@/types";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Carousel } from "../ui/carousel";

export default function UserProfile({ id }: { id: string }) {
  const { push } = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      push("/sign-in");
    },
  });
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [alert, setAlert] = useState<AlertInterface | null>(null);
  const [animes, setAnimes] = useState<Record<string, any>[]>([]);
  const [user, setUser] = useState<Record<string, any>>({});

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axios.post("/api/users/fetchuser", {
          id,
        });
        setUser(response.data);
      } catch (error: any) {
        toast?.error(
          error?.response?.data?.error || error?.error || error?.message
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    fetchAnimes();
  }, [refresh]);

  const fetchAnimes = async () => {
    try {
      const response = await axios.post(`/api/anime/getuseranimes`, {
        userId: id,
      });
      setAnimes(response.data);
    } catch {}
  };
  const followUser = async (id: number, check: boolean) => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/follow", {
        id,
        check,
      });
    } catch (error: any) {
      toast?.error(
        error?.response?.data?.error || error?.error || error?.message
      );
    } finally {
      setRefresh(!refresh);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center justify-center gap-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="flex flex-col sm:flex-row items-center gap-4 pb-2">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage
              src={user?.profilePicture}
              alt={`${name}'s profile picture`}
            />
            <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center sm:text-left space-y-1">
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-muted-foreground">{user?.username}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mt-4 space-y-2">
            <h2 className="text-lg font-semibold">Bio</h2>
            <p className="text-muted-foreground">{user?.bio}</p>
          </div>

          <div className="flex gap-6">
            <div className=" flex items-center gap-1">
              <h2 className="text-lg font-semibold">Followers</h2>
              <p className="text-muted-foreground">{user?.followers?.length}</p>
            </div>
            <div className=" flex items-center gap-1">
              <h2 className="text-lg font-semibold">Following</h2>
              <p className="text-muted-foreground">{user?.following?.length}</p>
            </div>
          </div>

          {user?.followers
            ?.map((follower: any) => follower?.followerId)
            ?.includes(session?.user?.id) ? (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => followUser(user?.id, false)}
            >
              Unfollow
            </Button>
          ) : (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => followUser(user?.id, true)}
            >
              Follow
            </Button>
          )}
        </CardContent>
      </Card>

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
          </Card>
        ))}
      </div>
    </div>
  );
}

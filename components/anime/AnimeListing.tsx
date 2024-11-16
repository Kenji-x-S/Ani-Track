import React, { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card"; // Adjust the import based on Shadcn setup
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Carousel } from "@/components/ui/carousel"; // Placeholder for carousel component
import axios from "axios";

const AnimeList = () => {
  const [animes, setAnimes] = useState<Record<string, any>[]>([]);
  const [watchList, setWatchList] = useState<Record<string, any>[]>([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const fetchAnimes = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`https://api.jikan.moe/v4/anime`, {
        params: {
          q: query,
          page: page,
        },
      });
      setAnimes(response.data.data);
    } catch (error) {
      console.error("Error fetching anime:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnimes();
  }, [query, page]);
  const fetchWatchList = async () => {
    try {
      const response = await axios.post(`/api/watchlist/getwatchlist`);
      setWatchList(response.data);
    } catch {}
  };

  useEffect(() => {
    fetchWatchList();
  }, []);

  const addToWatchList = async (id: number, status: boolean) => {
    try {
      let url = "/api/watchlist/addtowatchlist";
      if (status) url = "/api/watchlist/removefromwatchlist";
      await axios.post(url, { id });
      await fetchWatchList();
      setEditIndex(null);
    } catch (error) {}
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <Input
          type="text"
          placeholder="Search for anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center">Loading...</div>
        ) : (
          animes.map((anime) => (
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
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  variant="outline"
                  className="w-full mt-2"
                  onClick={() =>
                    addToWatchList(
                      anime.mal_id,
                      watchList.some((item) => item.animeId === anime.mal_id)
                    )
                  }
                >
                  {watchList.some((item) => item.animeId === anime.mal_id)
                    ? "Remove from Watch List"
                    : "Add to Watch List"}
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      <div className="flex justify-between items-center mt-6">
        <Button
          variant="outline"
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-gray-700">Page {page}</span>
        <Button variant="outline" onClick={() => setPage((prev) => prev + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default AnimeList;

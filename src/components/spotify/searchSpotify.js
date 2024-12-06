import { searchSpotify } from "../../utils/spotifyApi";

const fetchTracks = async (query) => {
  const results = await searchSpotify(query, "track", 3);
  console.log("Spotify Search Results:", results);
};

fetchTracks("Imagine Dragons");
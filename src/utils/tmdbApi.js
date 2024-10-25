// /src/utils/tmdbApi.js



const API_KEY = "84bf7fb1a1d6008ee499b3bc270c23a2";

export const fetchAllMovies = async (page = 1, searchQuery = "") => {
  try {
    const url = searchQuery
      ? `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
          searchQuery
        )}&page=${page}`
      : `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&page=${page}`;
    
    const response = await fetch(url);
    const data = await response.json();
    data.total_pages = Math.min(data.total_pages || 500, 500);
    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return null;
  }
};


// Fetch genres list
export const fetchGenres = async () => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${API_KEY}`
    );
    
    const data = await response.json();
    return data.genres; // Return the list of genres
  } catch (error) {
    console.error("Error fetching genres:", error);
    return [];
  }
};
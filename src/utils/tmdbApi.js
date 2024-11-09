const API_KEY = "84bf7fb1a1d6008ee499b3bc270c23a2";

// Fetch all movies with optional filters like searchQuery, genre, release year, etc.
export const fetchAllMovies = async (
  page = 1,
  searchQuery = "",
  { releaseYear, selectedGenre, rating, language, popularity }
) => {
  try {
    let url = "https://api.themoviedb.org/3/discover/movie?api_key=" + API_KEY + `&page=${page}`;

    // If there's a search query, we use the search endpoint
    if (searchQuery) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        searchQuery
      )}&page=${page}`;
    }

    // Add filters if they are provided
    if (releaseYear) {
      url += `&primary_release_year=${releaseYear}`;
    }
    if (selectedGenre) {
      url += `&with_genres=${selectedGenre}`;
    }
    if (rating) {
      url += `&vote_average.gte=${rating[0]}&vote_average.lte=${rating[1]}`;
    }
    if (language) {
      url += `&language=${language}`;
    }
    if (popularity) {
      url += `&sort_by=${popularity}`;
    }

    // Fetch data from TMDB API
    const response = await fetch(url);
    const data = await response.json();

    // Ensure total_pages doesn't exceed 500
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

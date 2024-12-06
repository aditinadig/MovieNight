const API_KEY = "84bf7fb1a1d6008ee499b3bc270c23a2";

const moodToGenreAndKeywords = {
"happy": { genres: ["35"], keywords: ["comedy"]},
  "romantic": { genres: ["10749"], keywords: ["romance"] }, // Romance
  "exciting": { genres: ["28"], keywords: ["action"] }, // Action
  "thrilling": { genres: ["53"], keywords: ["thriller"] }, // Thriller
  "sad": { genres: ["18"], keywords: ["drama"] }, // Drama
};


export const fetchAllMovies = async (
  page = 1,
  searchQuery = "",
  { releaseYear, selectedGenre, rating, language, popularity, mood } // Keep mood filter here
) => {
  try {
    let url = "https://api.themoviedb.org/3/discover/movie?api_key=" + API_KEY + `&page=${page}`;

    // If there's a search query, we use the search endpoint
    if (searchQuery) {
      url = `https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(
        searchQuery
      )}&page=${page}`;
    }

    // Add mood-based genres and keywords if a mood is provided
    let moodGenres = [];
    let moodKeywords = [];
    if (mood && moodToGenreAndKeywords[mood]) {
      moodGenres = moodToGenreAndKeywords[mood].genres;
      moodKeywords = moodToGenreAndKeywords[mood].keywords;
    }

    // Combine moodGenres with selectedGenre, ensuring unique genres only
    const allGenres = [...new Set([...(selectedGenre ? [selectedGenre] : []), ...moodGenres])];
    if (allGenres.length > 0) {
      url += `&with_genres=${allGenres.join(",")}`;
    }

    // Add filters if they are provided
    if (releaseYear) {
      url += `&primary_release_year=${releaseYear}`;
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

    // If mood keywords are available, add them to the URL using `with_keywords`
    if (moodKeywords.length > 0) {
      const keywordIds = await getKeywordIds(moodKeywords);
      if (keywordIds.length > 0) {
        url += `&with_keywords=${keywordIds.join(",")}`;
      }
    }

    // Fetch data from TMDB API
    const response = await fetch(url);
    console.log("fetched url: ", url);
    const data = await response.json();

    // Ensure total_pages doesn't exceed 500
    data.total_pages = Math.min(data.total_pages || 500, 500);

    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return null;
  }
};

const getKeywordIds = async (keywords) => {
  const keywordIds = [];
  // Remove duplicates to avoid redundant API calls
  const uniqueKeywords = [...new Set(keywords)];

  for (const keyword of uniqueKeywords) {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/search/keyword?api_key=${API_KEY}&query=${encodeURIComponent(keyword)}`
      );
      const data = await response.json();
      if (data.results && data.results.length > 0) {
        keywordIds.push(data.results[0].id); // Push the first matched keyword ID
      } else {
        console.warn(`No results found for keyword: ${keyword}`);
      }
    } catch (error) {
      console.error(`Error fetching keyword ID for ${keyword}:`, error);
    }
  }

  return keywordIds;
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

export const fetchMovieDetails = async (movieId) => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits,videos`
    );

    const data = await response.json();
    console.log("fetched movie details: ", data);
    return data;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    return null;
  }
}


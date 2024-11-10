import { useEffect, useState } from "react";
import { auth } from "../../../firebaseConfig";
import { fetchAllMovies, fetchGenres } from "../../utils/tmdbapi.js";
import FiltersDrawer from "./FiltersDrawer.jsx";
import MovieCard from "../movies/MovieCard.jsx";
import { Box, Typography, Grid, Pagination, TextField, Slider, MenuItem } from "@mui/material";
import SearchField from "../form/SearchField.jsx";
import Cookies from "js-cookie";

export default function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [rating, setRating] = useState([0, 10]);
  const [language, setLanguage] = useState("");
  const [popularity, setPopularity] = useState("");

  // Language code mapping
  const languageMap = {
    "english": "en",
    "korean": "ko",
    "spanish": "es",
    "french": "fr",
    "german": "de",
    "japanese": "ja",
    "chinese": "zh",
    // Add more languages here as needed
  };

  // Convert language name to ISO code
  const getLanguageCode = (lang) => {
    const lowerLang = lang.toLowerCase();
    return languageMap[lowerLang] || "";
  };

  // Check if user is authenticated, redirect to login if not
  useEffect(() => {
    // Check if authToken cookie exists
    const authToken = Cookies.get("authToken");

    if (!authToken) {
      // If no session, redirect to login page
      window.location.href = "/login";
    }
  }, []);

  // Fetch genres and movies with applied filters
  useEffect(() => {
    fetchGenres()
      .then((genresData) => setGenres(genresData))
      .catch((error) => console.error("Error fetching genres:", error));

    fetchAllMovies(page, searchQuery, {
      releaseYear,
      selectedGenre,
      rating,
      language: getLanguageCode(language), // Pass ISO code for language
      popularity,
    })
      .then((data) => {
        if (data && data.results) {
          setMovies(data.results);
          setTotalPages(data.total_pages);
        } else {
          setMovies([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching movies:", error);
        setMovies([]);
      });
  }, [page, searchQuery, releaseYear, selectedGenre, rating, language, popularity]);

  // Filter handlers
  const handlePageChange = (event, value) => setPage(value);
  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setPage(1);
  };
  const handleGenreChange = (event) => setSelectedGenre(event.target.value);
  const handleReleaseYearChange = (event) => setReleaseYear(event.target.value);
  const handleRatingChange = (event, newValue) => setRating(newValue);
  const handleLanguageChange = (event) => setLanguage(event.target.value);
  const handlePopularityChange = (event) => setPopularity(event.target.value);

  // Map genre IDs to names
  const mapGenres = (genreIds) => {
    if (!Array.isArray(genreIds) || genreIds.length === 0) {
      return "Unknown Genre";
    }
    return genreIds
      .map(
        (id) => genres.find((genre) => genre?.id === id)?.name || "Unknown Genre"
      )
      .filter(Boolean)
      .join(", ");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "var(--primary-bg)" }}>
      {/* Sidebar Filters */}
      <Box
        sx={{
          width: "200px", // Fixed width for sidebar
          bgcolor: "var(--primary-bg)",
          color: "var(--primary-text)",
          padding: 3,
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
        {/* Filters Drawer with all the state and handlers passed as props */}
        <FiltersDrawer
          genres={genres}
          selectedGenre={selectedGenre}
          releaseYear={releaseYear}
          rating={rating}
          language={language}
          popularity={popularity}
          handleGenreChange={handleGenreChange}
          handleReleaseYearChange={handleReleaseYearChange}
          handleRatingChange={handleRatingChange}
          handleLanguageChange={handleLanguageChange}
          handlePopularityChange={handlePopularityChange}
        />

        <Box sx={{ mt: 4 }}>
          {/* Genre Filter */}
          <TextField
            label="Genre"
            select
            value={selectedGenre}
            onChange={handleGenreChange}
            fullWidth
          >
            {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                {genre.name}
              </MenuItem>
            ))}
          </TextField>

          {/* Release Year Filter */}
          <TextField
            label="Release Year"
            type="number"
            value={releaseYear}
            onChange={handleReleaseYearChange}
            fullWidth
            sx={{ mt: 2 }}
          />

          {/* Rating Filter */}
          <Typography gutterBottom>Rating</Typography>
          <Slider
            value={rating}
            onChange={handleRatingChange}
            valueLabelDisplay="auto"
            min={0}
            max={10}
            sx={{ mt: 1 }}
          />

          {/* Language Filter */}
          <TextField
            label="Language"
            value={language}
            onChange={handleLanguageChange}
            fullWidth
            sx={{ mt: 2 }}
          />

          {/* Popularity Filter */}
          <TextField
            label="Popularity"
            select
            value={popularity}
            onChange={handlePopularityChange}
            fullWidth
            sx={{ mt: 2 }}
          >
            <MenuItem value="popularity.desc">Most Popular</MenuItem>
            <MenuItem value="popularity.asc">Least Popular</MenuItem>
          </TextField>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: "1",
          p: 3,
          ml: "50px", // Offset for sidebar
          color: "var(--primary-text)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "1200px", mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            All Movies
          </Typography>

          <SearchField onSearchChange={handleSearchChange} />
        </Box>

        {/* Movie Grid */}
        <Grid container spacing={2} sx={{ maxWidth: "1200px" }}>
          {movies.length > 0 ? (
            movies.map((movie) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={movie.id}>
                <MovieCard
                  title={movie.title}
                  genre={mapGenres(movie.genre_ids)}
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                />
              </Grid>
            ))
          ) : (
            <Typography>No movies available.</Typography>
          )}
        </Grid>

        {/* Pagination */}
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            sx={{
              color: "var(--primary-text)",
              "& .MuiPaginationItem-root": { color: "var(--primary-text)" },
              "& .Mui-selected": {
                backgroundColor: "var(--accent-color) !important",
                color: "var(--primary-bg) !important",
                fontWeight: "bold",
              },
              "& .MuiPaginationItem-page:hover": { opacity: 0.8 },
              "& .Mui-selected:hover": {
                backgroundColor: "var(--accent-color) !important",
                opacity: 1,
              },
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

import { useEffect, useState } from "react";
import { auth } from "../../../firebaseConfig";
import { fetchAllMovies, fetchGenres } from "../../utils/tmdbapi.js";
import FiltersDrawer from "./FiltersDrawer.jsx";
import MovieCard from "../movies/MovieCard.jsx";
import { Box, Typography, Grid, Pagination } from "@mui/material";
import SearchField from "../form/SearchField.jsx";

export default function Dashboard() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState(""); // Track search input

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        window.location.href = "/login";
      }
    });

    fetchGenres()
      .then((genresData) => setGenres(genresData))
      .catch((error) => console.error("Error fetching genres:", error));

    // Fetch movies based on searchQuery
    fetchAllMovies(page, searchQuery)
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

    return () => unsubscribe();
  }, [page, searchQuery]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setPage(1); // Reset to the first page on new search
  };

  const mapGenres = (genreIds) => {
    if (!Array.isArray(genreIds) || genreIds.length === 0) {
      return "Unknown Genre";
    }

    return genreIds
      .map(
        (id) =>
          genres.find((genre) => genre?.id === id)?.name || "Unknown Genre"
      )
      .filter(Boolean)
      .join(", ");
  };

  return (
    <Box sx={{ display: "flex", pr: 4, pl: 4 }}>
      <Box sx={{ flex: '0 0 20%' }}>
        <FiltersDrawer />
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flex: '0 0 70%',
          flexGrow: 1,
          p: 3,
          backgroundColor: "var(--primary-bg)",
          color: "var(--primary-text)",
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh', // Ensure consistent height
        }}
      >
        <Box sx={{ width: '100%', maxWidth: '1200px', mb: 4 }}>
          <Typography variant="h4" gutterBottom mb={4}>
            All Movies
          </Typography>

          <SearchField onSearchChange={handleSearchChange} />
        </Box>

        {/* Movie Grid */}
        <Grid container spacing={2} sx={{ maxWidth: '1200px' }}>
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

        {/* Pagination Component */}
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
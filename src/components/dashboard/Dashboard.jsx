import { useEffect, useState } from "react";
import { auth } from "../../../firebaseConfig";
import { fetchAllMovies, fetchGenres } from "../../utils/tmdbApi.js";
import FiltersDrawer from "./FiltersDrawer.jsx";
import MovieCard from "../movies/MovieCard.jsx";
import { Box, Typography, Grid, Pagination, TextField, Slider, MenuItem } from "@mui/material";
import SearchField from "../form/SearchField.jsx";
import Cookies from "js-cookie";
import { Modal } from "antd";
import AccentButton from "../form/accentButton.jsx";
import EventForm from "../event/EventForm.jsx";

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
  const [mood, setMood] = useState(""); // Add mood state
  const [surpriseMovies, setSurpriseMovies] = useState([]); // State for surprise movies
  const [isSurpriseModalVisible, setIsSurpriseModalVisible] = useState(false); // Modal visibility state


  const languageMap = {
    "english": "en",
    "korean": "ko",
    "spanish": "es",
    "french": "fr",
    "german": "de",
    "japanese": "ja",
    "chinese": "zh",
  };

  const getLanguageCode = (lang) => {
    const lowerLang = lang.toLowerCase();
    return languageMap[lowerLang] || "";
  };

  const resetFilters = () => {
    setSelectedGenre("");
    setReleaseYear("");
    setRating([0, 10]);
    setLanguage("");
    setPopularity("");
    setMood("");
    setPage(1);
    setSearchQuery("");
  };

  useEffect(() => {
    const authToken = Cookies.get("authToken");

    if (!authToken) {
      window.location.href = "/login";
    }
  }, []);

  useEffect(() => {
    fetchGenres()
      .then((genresData) => setGenres(genresData))
      .catch((error) => console.error("Error fetching genres:", error));

    fetchAllMovies(page, searchQuery, {
      releaseYear,
      selectedGenre,
      rating,
      language: getLanguageCode(language),
      popularity,
      mood, // Add mood filter here
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
  }, [page, searchQuery, releaseYear, selectedGenre, rating, language, popularity, mood]);

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
  const handleMoodChange = (event) => setMood(event.target.value); // Add mood handler


  // const handleSurpriseMe = () => {
  //   const shuffledMovies = [...movies].sort(() => 0.5 - Math.random());
  //   setSurpriseMovies(shuffledMovies.slice(0, 6));
  //   setIsSurpriseModalVisible(true);
  // };

  const handleSurpriseMe = () => {
    // Fetch movies based on the same filters you are using on the main dashboard
    fetchAllMovies(page, searchQuery, {
      releaseYear,
      selectedGenre,
      rating,
      language: getLanguageCode(language),
      popularity,
      mood, // Include mood filter as well
    })
      .then((data) => {
        if (data && data.results) {
          const shuffledMovies = [...data.results].sort(() => 0.5 - Math.random());
          setSurpriseMovies(shuffledMovies.slice(0, 6)); // Display a random selection of 6 movies
          setIsSurpriseModalVisible(true); // Show the modal with the random movies
        } else {
          setSurpriseMovies([]); // If no movies found, set empty array
        }
      })
      .catch((error) => {
        console.error("Error fetching surprise movies:", error);
        setSurpriseMovies([]); // In case of error, set empty array
      });
  };
  

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
      <Box
        sx={{
          width: "340px",
          bgcolor: "var(--primary-bg)",
          color: "var(--primary-text)",
          padding: 3,
          mt: 1,
          position: "sticky",
          top: 0,
          height: "100vh",
        }}
      >
<Box sx={{ display: "flex", justifyContent: "space-between", width: "100%", gap:"1rem" }}>
  <AccentButton
    text={"Create Event"}
    padding="0.7rem"
    width="320px"  // You can keep the width or use 100% depending on your design
  />
  <AccentButton
    text={"Surprise Me!"}
    padding="0.7rem"
    width="320px"
    onClick={handleSurpriseMe}
  />
</Box>

        <FiltersDrawer
          genres={genres}
          selectedGenre={selectedGenre}
          releaseYear={releaseYear}
          rating={rating}
          language={language}
          popularity={popularity}
          mood={mood} // Pass mood to FiltersDrawer
          handleGenreChange={handleGenreChange}
          handleReleaseYearChange={handleReleaseYearChange}
          handleRatingChange={handleRatingChange}
          handleLanguageChange={handleLanguageChange}
          handlePopularityChange={handlePopularityChange}
          handleMoodChange={handleMoodChange} // Pass mood handler to FiltersDrawer
          resetFilters={resetFilters}
        />
      </Box>

      <Box
        component="main"
        sx={{
          flex: "1",
          p: 4,
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

      {/* Surprise Me Modal */}
      <Modal
  title={null} // We’ll add a custom title inside the body
  open={isSurpriseModalVisible}
  onCancel={() => setIsSurpriseModalVisible(false)}
  footer={null}
  closable={false} // Removes the close button from the top right
  centered
  width={650} // Custom width for a comfortable view
  height={500}
  bodyStyle={{
    backgroundColor: "var(--primary-bg)", 
    color: "var(--primary-text)", 
    padding: "2rem", // Adds padding around the content
    borderRadius: "10px", // Rounds the modal corners
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
  }}
  style={{
    border: "2px solid var(--primary-bg)", // Custom border color for the modal
    borderRadius: "10px", // Ensures both the content and border are rounded
  }}
>
<Box sx={{ display: "flex", justifyContent: "center", marginTop: "0.1rem", marginBottom: "1.25rem" }}>
    <AccentButton
      text="↺ Back"
      onClick={() => setIsSurpriseModalVisible(false)}
      padding="0.7rem 1.5rem"
      sx={{
        width: '50%',
        backgroundColor: "#C49B9B",
        color: "var(--primary-bg)",
        padding: "1.5rem", // Reduced padding
        borderRadius: "20px",
        fontWeight: "bold",
        transition: "background-color 0.3s ease", // Optional for smooth hover effect
      "&:hover": {
        backgroundColor: "var(--accent-hover-color)", // Optional hover effect
      },
      }}
    />
  </Box>
  <Box sx={{ textAlign: "center", marginBottom: "1.5rem" }}>
    <Typography variant="h5" sx={{ fontWeight: "bold", color: "var(--accent-color)" }}>
      Did we surprise you?
    </Typography>
    <Typography variant="subtitle1" sx={{ color: "var(--secondary-text)" }}>
      Here are some movie picks just for you!
    </Typography>
  </Box>

  <Grid container spacing={2}>
    {surpriseMovies.map((movie) => (
      <Grid item xs={12} sm={6} md={4} key={movie.id}>
        <MovieCard
          title={movie.title}
          genre={mapGenres(movie.genre_ids)}
          image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
        />
      </Grid>
    ))}
  </Grid>

  
</Modal>

    </Box>
  );
}

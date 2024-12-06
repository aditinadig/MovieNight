import { useEffect, useState } from "react";
import { auth } from "../../../firebaseConfig";
import {
  fetchAllMovies,
  fetchGenres,
  fetchMovieDetails,
} from "../../utils/tmdbApi.js";
import {
  fetchAllPlaylists,
  createPlaylist,
  updatePlaylist,
} from "../../services/playlistsService"; // Import your service
import FiltersDrawer from "./FiltersDrawer.jsx";
import MovieCard from "../movies/MovieCard.jsx";
import {
  Box,
  Typography,
  Grid,
  Pagination,
  Button,
  Modal,
  Card,
  CardMedia,
  CardContent,
  Fade,
} from "@mui/material";
import SearchField from "../form/SearchField.jsx";
import AccentButton from "../form/AccentButton.jsx";
import OutlineButton from "../form/outlineButton.jsx";

export default function Dashboard({ mode, onSelectMovie, selectedMovies }) {
  // Track user authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user); // Set user if logged in
      } else {
        setUser(null); // Set user to null if not logged in
        window.location.href = "/login"; // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe(); // Cleanup listener on component unmount
  }, []);

  const [user, setUser] = useState(null); // State for tracking authenticated user
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
  const [selectedMovie, setSelectedMovie] = useState(null); // Track the selected movie for modal
  const [openMovieModal, setOpenMovieModal] = useState(false); // State to control modal visibility

  // Add state for playlists and modal visibility
  const [playlists, setPlaylists] = useState([]); // List of user playlists
  const [selectedPlaylist, setSelectedPlaylist] = useState(null); // Selected playlist for movie addition
  const [openPlaylistModal, setOpenPlaylistModal] = useState(false); // Modal open state
  const [currentMovie, setCurrentMovie] = useState(null); // Track the current movie for playlist addition
  const [loading, setLoading] = useState(false); // For loading state when adding a movie

  const handleLearnMoreClick = (movie) => {
    setSelectedMovie(movie); // Set the selected movie
    setOpenMovieModal(true); // Open the modal
  };

  const handleCloseMovieModal = () => {
    setOpenMovieModal(false); // Close the modal
    setSelectedMovie(null); // Reset the selected movie
  };

  // Handle opening/closing of the modal
  const handlePlaylistModalOpen = (movie) => {
    if (movie && typeof movie === "number") {
      // Fetch movie details using the ID
      fetchMovieDetails(movie)
        .then((movieDetails) => {
          if (movieDetails) {
            setCurrentMovie(movieDetails); // Set the fetched movie details
          } else {
            console.error("Movie details not found for ID:", movie);
          }
        })
        .catch((error) =>
          console.error("Error fetching movie details:", error)
        );
    } else {
      // If movie is already an object, directly set it
      setCurrentMovie(movie);
    }
    setOpenPlaylistModal(true); // Open the modal
  };

  const handlePlaylistModalClose = () => setOpenPlaylistModal(false); // Close modal

  // Fetch playlists on user state change
  useEffect(() => {
    if (user) {
      const fetchPlaylists = async () => {
        const fetchedPlaylists = await fetchAllPlaylists(user.uid); // Pass user ID to fetch playlists
        setPlaylists(fetchedPlaylists);
      };
      fetchPlaylists();
    }
  }, [user]);

  // Handle adding a movie to a playlist
  const addMovieToPlaylist = async () => {
    if (!selectedPlaylist) {
      alert("Please select or create a playlist.");
      return;
    }

    if (currentMovie) {
      setLoading(true); // Show loading indicator
      console.log("Adding movie to playlist:", currentMovie);
      const playlistToUpdate = playlists.find(
        (playlist) => playlist.id === selectedPlaylist
      );
      console.log("Playlist to update:", playlistToUpdate);
      if (playlistToUpdate) {
        // Ensure that movies is always an array, even if it's undefined
        const updatedMovies = [
          ...(playlistToUpdate.movies || []),
          currentMovie,
        ]; // Default to an empty array if movies is undefined

        console.log("Updated movies:", updatedMovies);

        await updatePlaylist(selectedPlaylist, { movies: updatedMovies }); // Update Firestore

        // Update local state to reflect the added movie
        const updatedPlaylists = playlists.map((playlist) =>
          playlist.id === selectedPlaylist
            ? { ...playlist, movies: updatedMovies } // Update the current playlist with new movie
            : playlist
        );

        console.log("Updated playlists:", updatedPlaylists);

        setPlaylists(updatedPlaylists); // Set the updated playlists state

        alert(
          `Movie ${currentMovie.title} added to playlist ${playlistToUpdate.name}`
        );
      }

      setLoading(false); // Hide loading indicator
      handlePlaylistModalClose(); // Close the modal after adding the movie
    }
  };

  // Handle creating a new playlist
  const handleCreatePlaylist = async () => {
    const playlistName = prompt("Enter the name of the new playlist");
    if (playlistName) {
      const newPlaylist = await createPlaylist({
        name: playlistName,
        movies: [],
      });
      setPlaylists([...playlists, newPlaylist]);
      setSelectedPlaylist(newPlaylist.id); // Automatically select the newly created playlist
      handlePlaylistModalClose();
    }
  };

  const languageMap = {
    english: "en",
    korean: "ko",
    spanish: "es",
    french: "fr",
    german: "de",
    japanese: "ja",
    chinese: "zh",
    italian: "it",
    portuguese: "pt",
    russian: "ru",
    hindi: "hi",
    arabic: "ar",
    dutch: "nl",
    swedish: "sv",
    danish: "da",
    finnish: "fi",
    norwegian: "no",
    polish: "pl",
    turkish: "tr",
    greek: "el",
    thai: "th",
    vietnamese: "vi",
    hebrew: "he",
    czech: "cs",
    indonesian: "id",
  };

  const handleModalClose = () => {
    setIsSurpriseModalVisible(false);
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
  }, [
    page,
    searchQuery,
    releaseYear,
    selectedGenre,
    rating,
    language,
    popularity,
    mood,
  ]);

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
          const shuffledMovies = [...data.results].sort(
            () => 0.5 - Math.random()
          );
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
        (id) =>
          genres.find((genre) => genre?.id === id)?.name || "Unknown Genre"
      )
      .filter(Boolean)
      .join(", ");
  };

  return (
    <Box
      sx={{ display: "flex", minHeight: "100vh", bgcolor: "var(--primary-bg)" }}
    >
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
        {mode !== "choose-movies" ? (
          <>
            <Box
              sx={{
                width: "100%",
                gap: "1rem",
              }}
            >
              <AccentButton
                text={"Create Event"}
                padding="0.7rem"
                width="320px" // You can keep the width or use 100% depending on your design
                navigateTo="/create-event"
                marginBottom="1rem"
              />
              <OutlineButton
                text={"Surprise Me!"}
                padding="0.7rem"
                width="320px"
                onClick={handleSurpriseMe}
              />
            </Box>
          </>
        ) : null}

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

        {/* Playlist Modal */}
        <Modal
          open={openPlaylistModal}
          onClose={handlePlaylistModalClose}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              padding: 2,
              borderRadius: "10px",
              width: "50%",
            }}
          >
            <Box sx={{ mt: 0 }}>
              <Typography>Select a Playlist</Typography>
              <select
                value={selectedPlaylist || ""}
                onChange={(e) => setSelectedPlaylist(e.target.value)}
                style={{ width: "100%", padding: "8px", borderRadius: "5px" }}
              >
                <option value="">--Select a Playlist--</option>
                {playlists
                  .filter(
                    (playlist) => playlist.userId === auth.currentUser?.uid
                  ) // Filter playlists by current user's ID
                  .map((playlist) => (
                    <option key={playlist.id} value={playlist.id}>
                      {playlist.name}
                    </option>
                  ))}
              </select>
            </Box>

            <Button
              onClick={() => {
                addMovieToPlaylist(); // Call the function to add the movie
                handlePlaylistModalClose(); // Close the modal after adding
              }}
              sx={{ mt: 4 }}
              variant="contained"
              color="primary"
            >
              Add Movie to Playlist
            </Button>
          </Box>
        </Modal>
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

        <Grid container spacing={2} sx={{ mb: 7, maxWidth: "1200px" }}>
          {movies.length > 0 ? (
            movies.map((movie) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={movie.id}>
                {/* Add space between movie card and button */}

                <MovieCard
                  mode={mode}
                  title={movie.title}
                  id={movie.id}
                  movie={movie}
                  genre={mapGenres(movie.genre_ids)}
                  image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  onLearnMore={() => handleLearnMoreClick(movie)} // Show details on click
                  onClickAdd={() => handlePlaylistModalOpen(movie)} // Open modal on click
                  selectedMovies={
                    mode === "choose-movies" ? selectedMovies : []
                  } // Pass selectedMovies only if mode is "choose-movies"
                  onSelect={
                    mode === "choose-movies"
                      ? () =>
                          onSelectMovie({
                            title: movie.title,
                            tmdb_id: movie.id,
                            poster_path: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                          })
                      : null
                  } // Set onSelect only if mode is "choose-movies"
                  handlePlaylistModalOpen={handlePlaylistModalOpen} // Pass function here
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

      <Modal
        open={Boolean(isSurpriseModalVisible)}
        onClose={handleModalClose}
        sx={{
          width: "70%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2, // Add padding to the modal
          margin: "auto", // Center the modal
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            p: 4,
            backgroundColor: "var(--primary-bg)",
            borderRadius: "10px",
            boxShadow: 24,
          }}
        >
          <Button
            variant="link"
            onClick={handleModalClose}
            sx={{ mb: 2, color: "var(--highlight-color)" }}
          >
            Go back to Dashboard
          </Button>
          <Typography
            variant="h5"
            sx={{ fontWeight: "bold", color: "var(--accent-color)" }}
          >
            Did we surprise you?
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{ color: "var(--secondary-text)", mb: 3 }}
          >
            Here are some movie picks just for you!
          </Typography>
          <Grid container spacing={2} sx={{ padding: "0 16px" }}>
            {surpriseMovies?.length > 0 &&
              surpriseMovies.map((movie) => (
                <Grid item xs={12} sm={6} md={4} key={movie.id}>
                  <MovieCard
                    mode={"surprise-movies"}
                    title={movie.title}
                    id={movie.id}
                    genre={mapGenres(movie.genre_ids)}
                    image={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  />
                </Grid>
              ))}
          </Grid>
        </Box>
      </Modal>

      {/* Movie Details Modal */}
      <Modal
        open={openMovieModal}
        onClose={handleCloseMovieModal}
        aria-labelledby="movie-modal-title"
        aria-describedby="movie-modal-description"
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(8px)", // Adds a background blur for a modern look
        }}
      >
        <Fade in={openMovieModal}>
          <Card
            sx={{
              background: "linear-gradient(145deg, #121212, #1e1e1e)", // Gradient background
              padding: 4,
              borderRadius: 4,
              width: { xs: "90%", md: "60%" },
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0px 10px 20px rgba(0,0,0,0.5)", // Subtle shadow for depth
              color: "white",
            }}
          >
            {selectedMovie && (
              <Grid container spacing={4}>
                {/* Image Section */}
                <Grid
                  item
                  xs={12}
                  md={4}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={`https://image.tmdb.org/t/p/w500${selectedMovie.poster_path}`}
                    alt={selectedMovie.title || "Movie poster"}
                    sx={{
                      maxWidth: "100%",
                      maxHeight: "300px",
                      objectFit: "cover",
                      borderRadius: 2,
                      boxShadow: "0px 4px 8px rgba(0,0,0,0.3)", // Shadow for the image
                    }}
                  />
                </Grid>

                {/* Text Section */}
                <Grid item xs={12} md={8}>
                  <CardContent>
                    <Typography
                      id="movie-modal-title"
                      variant="h4"
                      gutterBottom
                      sx={{
                        color: "white",
                        textAlign: "center",
                        fontWeight: "bold",
                        textTransform: "uppercase", // Added emphasis
                        letterSpacing: 1,
                      }}
                    >
                      {selectedMovie.title}
                    </Typography>
                    <Typography
                      id="movie-modal-description"
                      variant="body1"
                      color="white"
                      sx={{
                        textAlign: "justify",
                        mb: 2,
                        lineHeight: 1.8, // Increased spacing for readability
                        opacity: 0.85,
                      }}
                    >
                      {selectedMovie.overview}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "white",
                        mb: 1,
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      🎬 <strong style={{ marginLeft: "8px" }}>Genres:</strong>{" "}
                      <span style={{ marginLeft: "8px", fontWeight: 400 }}>
                        {mapGenres(selectedMovie.genre_ids)}
                      </span>
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        color: "white",
                        mb: 2,
                        fontWeight: "bold",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      📅{" "}
                      <strong style={{ marginLeft: "8px" }}>
                        Release Date:
                      </strong>{" "}
                      <span style={{ marginLeft: "8px", fontWeight: 400 }}>
                        {selectedMovie.release_date}
                      </span>
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: { xs: "center", md: "start" },
                        mt: 3,
                      }}
                    >
                      <Button
                        onClick={handleCloseMovieModal}
                        variant="contained"
                        color="secondary"
                        sx={{
                          px: 4,
                          py: 1.5,
                          backgroundColor: "#ff4081", // Custom pink color
                          color: "white",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          "&:hover": {
                            backgroundColor: "#ff79a1", // Lighter pink on hover
                          },
                        }}
                      >
                        Close
                      </Button>
                    </Box>
                  </CardContent>
                </Grid>
              </Grid>
            )}
          </Card>
        </Fade>
      </Modal>
    </Box>
  );
}

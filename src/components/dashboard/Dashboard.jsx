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
  fetchPlaylistNotContainingMovie,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Link,
} from "@mui/material";
import SearchField from "../form/SearchField.jsx";
import AccentButton from "../form/AccentButton.jsx";
import OutlineButton from "../form/outlineButton.jsx";
import CreatePlaylist from "../playlists/CreatePlaylist.jsx";

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
  const [openCreatePlaylistModal, setOpenCreatePlaylistModal] = useState(false); // State for create playlist modal

  // Add state for playlists and modal visibility
  const [playlists, setPlaylists] = useState([]); // List of user playlists
  const [playlistsMenu, setPlaylistsMenu] = useState([]); // List of playlists for dropdown
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
            handleSetPlaylistMenu(movieDetails.id);
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
      handleSetPlaylistMenu(movie); // Fetch playlists not containing
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
      const playlistToUpdate = playlists.find(
        (playlist) => playlist.id === selectedPlaylist
      );
      if (playlistToUpdate) {
        // Ensure that movies is always an array, even if it's undefined
        const updatedMovies = [
          ...(playlistToUpdate.movies || []),
          currentMovie,
        ]; // Default to an empty array if movies is undefined

        await updatePlaylist(selectedPlaylist, { movies: updatedMovies }); // Update Firestore

        // Update local state to reflect the added movie
        const updatedPlaylists = playlists.map((playlist) =>
          playlist.id === selectedPlaylist
            ? { ...playlist, movies: updatedMovies } // Update the current playlist with new movie
            : playlist
        );

        setPlaylists(updatedPlaylists); // Set the updated playlists state

        alert(
          `Movie ${currentMovie.title} added to playlist ${playlistToUpdate.name}`
        );
      }

      setLoading(false); // Hide loading indicator
      handlePlaylistModalClose(); // Close the modal after adding the movie
    }
  };

  const handleSetPlaylistMenu = (movieId) => {
    fetchPlaylistNotContainingMovie(movieId)
      .then((playlists) => {
        setPlaylistsMenu(playlists);
      })
      .catch((error) => console.error("Error fetching playlists:", error));
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

  const handleOpenCreatePlaylistModal = () => {
    setOpenCreatePlaylistModal(true);
  };

  const handleCloseCreatePlaylistModal = () => {
    setOpenCreatePlaylistModal(false);
  };

  const handleRefreshPlaylistsMenu = () => {
    if (currentMovie) {
      handleSetPlaylistMenu(currentMovie.id); // Re-fetch playlists not containing the movie
    }
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

      {/* Playlist Modal */}
      <Modal
        open={openPlaylistModal}
        onClose={handlePlaylistModalClose}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(8px)", // Adds frosted-glass background effect
        }}
      >
        <Box
          sx={{
            backgroundColor: "var(--card-bg)", // Dark mode card background
            padding: 4,
            borderRadius: "var(--border-radius)", // Use global border-radius
            width: { xs: "90%", sm: "50%" },
            boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.4)", // Subtle shadow
            color: "var(--primary-text)", // Primary text color for dark mode
          }}
        >
          <Typography
            variant="h5"
            sx={{
              textAlign: "center",
              mb: 2,
              fontWeight: "bold",
              color: "var(--primary-text)", // Align heading color with dark mode
            }}
          >
            Select a Playlist
          </Typography>
          <Typography
            variant="body2"
            sx={{
              mb: 1,
              textAlign: "center",
              color: "var(--secondary-text)", // Secondary text for description
            }}
          >
            Choose a playlist to add the movie to.
          </Typography>

          <Box sx={{ textAlign: "center" }}>
            <Link
              onClick={handleOpenCreatePlaylistModal} // Call function on link click
              sx={{
                padding: "10px 20px",
                fontWeight: "bold",
                color: "var(--accent-pink)", // Use accent color for button
                textDecoration: "underline",
                textDecorationColor: "var(--accent-pink)", // Underline color
                "&:hover": {
                  color: "var(--highlight-pink)", // Highlight color on hover
                  textDecorationColor: "var(--highlight-pink)", // Highlight underline
                },
              }}
            >
              Create Playlist
            </Link>
          </Box>

          {playlistsMenu.length === 0 ? (
            <>
              {" "}
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  mt: 2,
                  mb: 4,
                  color: "var(--secondary-text)", // Secondary text for description
                }}
              >
                There are no playlists without the movie present.
              </Typography>{" "}
            </>
          ) : (
            <>
              {" "}
              <FormControl fullWidth sx={{ mb: 3, mt: 2 }}>
                <InputLabel
                  id="playlist-select-label"
                  sx={{
                    color: "var(--secondary-text)", // Normal label color
                    "&.Mui-focused": {
                      color: "var(--primary-text)", // Change label color on focus
                    },
                  }}
                >
                  Playlist
                </InputLabel>
                <Select
                  labelId="playlist-select-label"
                  value={selectedPlaylist || ""}
                  onChange={(e) => setSelectedPlaylist(e.target.value)}
                  sx={{
                    backgroundColor: "var(--secondary-bg)", // Input background
                    color: "var(--primary-text)", // Input text color
                    borderRadius: "var(--border-radius)", // Global border radius
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--border)", // Input border color
                    },
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--border)", // Input border color
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "var(--border)", // Input border color
                    },
                    "& .MuiSelect-icon": {
                      color: "var(--primary-text)", // Dropdown arrow color
                    },
                  }}
                  MenuProps={{
                    PaperProps: {
                      sx: {
                        backgroundColor: "var(--card-bg)", // Dropdown menu background
                        color: "var(--primary-text)", // Dropdown text color
                        "& .MuiMenuItem-root:hover": {
                          backgroundColor: "var(--secondary-bg)", // Hover background
                        },
                      },
                    },
                  }}
                >
                  <MenuItem value="">
                    <em>--Select a Playlist--</em>
                  </MenuItem>
                  {playlistsMenu
                    .filter(
                      (playlistsMenu) =>
                        playlistsMenu.userId === auth.currentUser?.uid
                    )
                    .map((playlistsMenu) => (
                      <MenuItem
                        key={playlistsMenu.id}
                        value={playlistsMenu.id}
                        sx={{
                          backgroundColor: "var(--card-bg)",
                          "&:hover": { backgroundColor: "var(--secondary-bg)" },
                        }}
                      >
                        {playlistsMenu.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>{" "}
              <Box sx={{ textAlign: "center" }}>
                <Button
                  onClick={() => {
                    addMovieToPlaylist();
                    handlePlaylistModalClose();
                  }}
                  variant="contained"
                  color="primary"
                  sx={{
                    padding: "10px 20px",
                    fontWeight: "bold",
                    backgroundColor: "var(--accent-pink)", // Use accent color for button
                    "&:hover": {
                      backgroundColor: "var(--highlight-pink)", // Highlight color on hover
                    },
                  }}
                >
                  Add Movie to Playlist
                </Button>
              </Box>
            </>
          )}
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
                        color: "var(--primary-text)",
                        fontWeight: "bold",
                        letterSpacing: 1,
                      }}
                    >
                      {selectedMovie.title}
                    </Typography>
                    <Typography
                      id="movie-modal-description"
                      variant="body1"
                      color="var(--primary-text)"
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
                        color: "var(--primary-text)",
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
                        color: "var(--primary-text)",
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
                          backgroundColor: "var(--accent-pink)", // Custom pink color
                          color: "(--primary-text)",
                          fontWeight: "bold",
                          textTransform: "uppercase",
                          "&:hover": {
                            backgroundColor: "var(--highlight-pink)", // Lighter pink on hover
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

      {/* Create Playlist Modal */}
      <Modal
        open={openCreatePlaylistModal}
        onClose={handleCloseCreatePlaylistModal}
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)", // Centers the modal vertically and horizontally
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 4, // Padding around the content
          }}
        >
          <CreatePlaylist
            onPlaylistCreated={handleRefreshPlaylistsMenu} // Refresh playlists after creation
            onClose={handleCloseCreatePlaylistModal} // Close the modal
          />
        </Box>
      </Modal>
    </Box>
  );
}

import React, { useEffect, useState } from "react";
import { db, auth } from "../../../firebaseConfig";
import {
  Grid,
  Typography,
  Box,
  Modal,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import AccentButton from "../form/AccentButton";
import { deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import {
  fetchPlaylistsByUser,
  addMoviesToPlaylist,
} from "../../services/playlistsService.js";
import CreatePlaylist from "./CreatePlaylist.jsx";
import PlaylistCard from "../playlists/PlaylistCard"; // Ensure correct path to PlaylistCard
import Dashboard from "../dashboard/Dashboard";
import { add } from "date-fns";
import { id } from "date-fns/locale";

const Playlist = () => {
  useEffect(() => {
    const authToken = Cookies.get("authToken");

    if (!authToken) {
      window.location.href = "/login";
    }
  }, []);

  const [playlists, setPlaylists] = useState([]);
  const [userId, setUserId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openCreatePlaylistModal, setOpenCreatePlaylistModal] = useState(false); // New state for create playlist modal
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [movies, setMovies] = useState([]); // New state to store movies for the playlist
  const [openAddMoviesModal, setOpenAddMoviesModal] = useState(false); // New state for add movies modal
  const [selectedMovies, setSelectedMovies] = useState([]);

  const handleEdit = async (playlist) => {
    setEditingPlaylist(playlist);
    setOpenModal(true);

    // Fetch movies for the selected playlist
    try {
      const playlistDocRef = doc(db, "playlists", playlist.id);
      const unsubscribe = onSnapshot(playlistDocRef, (snapshot) => {
        const playlistData = snapshot.data();
        console.log("Playlist data:", playlistData);

        if (playlistData && playlistData.movies) {
          const moviePromises = playlistData.movies.map((movie) => {
            if (movie && (movie.tmdb_id || movie.id)) {
              // Check for either tmdb_id or id
              console.log("Valid movie:", movie);
              return movie; // You can handle fetching additional data based on `id` here if needed
            } else {
              console.error(
                "Invalid movie object, missing tmdb_id or id:",
                movie
              );
              return null;
            }
          });

          const validMoviePromises = moviePromises.filter(
            (promise) => promise !== null
          );

          Promise.all(validMoviePromises)
            .then((movies) => {
              console.log("Fetched movies:", movies);
              setMovies(movies); // Set the list of movies for the playlist
            })
            .catch((error) => console.error("Error fetching movies:", error));
        }
      });
      return () => unsubscribe(); // Cleanup listener on modal close
    } catch (error) {
      console.error("Error fetching playlist data:", error);
    }
  };

  const handleDelete = async (playlistId) => {
    try {
      const playlistDocRef = doc(db, "playlists", playlistId);
      await deleteDoc(playlistDocRef);
      console.log(`Playlist with id ${playlistId} deleted`);
      // After deletion, re-fetch playlists
      fetchPlaylists();
    } catch (error) {
      console.error("Error deleting playlist:", error);
    }
  };

  const handleDeleteMovie = async (movieId) => {
    if (!editingPlaylist) return;

    try {
      // Remove the movie from the playlist's movie array
      const updatedMovies = movies.filter((movie) => movie.id !== movieId);
      const playlistDocRef = doc(db, "playlists", editingPlaylist.id);

      await updateDoc(playlistDocRef, {
        movies: updatedMovies,
      });
      console.log(`Movie with id ${movieId} deleted from playlist`);

      // Update state to reflect changes
      setMovies(updatedMovies);
    } catch (error) {
      console.error("Error deleting movie from playlist:", error);
    }
  };

  const handleModalClose = () => {
    setOpenModal(false);
    setMovies([]); // Clear movies when modal closes
  };

  const fetchPlaylists = async () => {
    if (!userId) return;
    try {
      const response = await fetchPlaylistsByUser(userId); // Use fetchPlaylistsByUser here
      setPlaylists(response); // Assuming playlists are returned as an array
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  const handleAddMovies = () => {
    if (!editingPlaylist) {
      console.error("No playlist selected for editing.");
      return;
    }
    // Map selectedMovies to replace `tmdb_id` with `id`
    const formattedMovies = selectedMovies.map((movie) => {
      const { tmdb_id, ...rest } = movie; // Destructure to extract `tmdb_id`
      return { id: tmdb_id, ...rest }; // Replace `tmdb_id` with `id`
    });

    console.log("Formatted movies:", formattedMovies);
    console.log("Add movies to playlist:", editingPlaylist);

    addMoviesToPlaylist(editingPlaylist.id, formattedMovies)
      .then(() => {
        console.log("Movies added successfully");
        setOpenAddMoviesModal(false); // Close the modal after
        setSelectedMovies([]); // Clear selected movies after adding
      })
      .catch((error) => {
        console.error("Error adding movies to playlist:", error);
      });
  };

  const handleSelectMovie = (movie) => {
    if (
      !selectedMovies.some((selected) => selected.tmdb_id === movie.tmdb_id)
    ) {
      setSelectedMovies((prev) => [
        ...prev,
        {
          title: movie.title,
          tmdb_id: movie.tmdb_id,
          poster_path: movie.poster_path, // Include poster path
        },
      ]);
    }
  };

  useEffect(() => {
    fetchPlaylists(); // Fetch playlists when userId changes
  }, [userId]);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        console.log("No user is logged in");
      }
    });
    return () => unsubscribeAuth();
  }, []);

  return (
    <Box sx={{ px: 12, py: 6 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h3" gutterBottom>
          Your Playlists
        </Typography>
        <AccentButton
          text="Create Playlist"
          onClick={() => setOpenCreatePlaylistModal(true)} // Open Create Playlist Modal
          width="15%"
          padding="0"
          marginTop="0.5rem"
          marginBottom="1.5rem"
        />
      </Box>

      <Box sx={{ mx: 12 }}>
        <Grid container spacing={8} mt={0}>
          {playlists.length > 0 ? (
            playlists.map((playlist) => (
              <Grid item xs={12} sm={12} md={12} lg={12} key={playlist.id}>
                <PlaylistCard
                  playlist={playlist}
                  handleEdit={handleEdit} // Handle editing playlists
                  handleDelete={handleDelete} // Pass handleDelete to PlaylistCard
                />
              </Grid>
            ))
          ) : (
            <Typography variant="body1" sx={{ mt: 2 }}>
              No playlists found.
            </Typography>
          )}
        </Grid>
      </Box>

      {/* Edit Playlist Modal */}
      <Modal open={openModal} onClose={handleModalClose}>
        <Box
          sx={{
            p: 4,
            backgroundColor: "var(--primary-bg)",
            borderRadius: "16px",
            maxWidth: "600px",
            width: "90%",
            mx: "auto",
            my: "5%",
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.5)", // Add a subtle shadow for depth
            overflow: "hidden", // Prevent content overflow
          }}
        >
          {/* Modal Title with Add Movies Button */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontWeight: "bold",
                color: "var(--primary-text)",
              }}
            >
              {editingPlaylist
                ? `Movies in "${editingPlaylist.name}"`
                : "Playlist"}
            </Typography>

            {/* Add Movies Button */}
            <Button
              variant="outlined"
              onClick={() => setOpenAddMoviesModal(true)} // Callback to handle adding movies
              sx={{
                fontSize: "0.9rem",
                fontWeight: "bold",
                textTransform: "uppercase",
                borderColor: "var(--primary-text)",
                color: "var(--primary-text)",
                "&:hover": {
                  backgroundColor: "var(--primary-text)",
                  color: "var(--primary-bg)",
                },
              }}
            >
              Add Movies
            </Button>
          </Box>

          {/* Movie List */}
          <List
            sx={{
              maxHeight: "60vh", // Set max height for scrolling
              overflowY: "auto", // Allow scrolling for long lists
              pr: 1,
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "var(--secondary-bg)", // Match scrollbar to theme
                borderRadius: "4px",
              },
              "&::-webkit-scrollbar-thumb:hover": {
                backgroundColor: "var(--highlight-color)", // Hover effect for scrollbar
              },
            }}
          >
            {movies.length > 0 ? (
              movies.map((movie, index) => (
                <ListItem
                  key={index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 2,
                    backgroundColor: "var(--card-bg)", // Background for each movie item
                    padding: "8px 16px",
                    borderRadius: "8px",
                    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.02)", // Slight zoom effect on hover
                      boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.3)",
                    },
                  }}
                >
                  {/* Movie Poster */}
                  <Box sx={{ mr: 2, flexShrink: 0 }}>
                    {movie.poster_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                        alt={movie.title}
                        style={{
                          width: "50px",
                          height: "75px",
                          objectFit: "cover",
                          borderRadius: "4px",
                        }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: "50px",
                          height: "75px",
                          backgroundColor: "#ccc",
                          borderRadius: "4px",
                        }}
                      />
                    )}
                  </Box>

                  {/* Movie Details */}
                  <ListItemText
                    primary={
                      <Typography
                        variant="body1"
                        sx={{
                          color: "var(--primary-text)",
                          fontWeight: "bold",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {movie.title}
                      </Typography>
                    }
                  />

                  {/* Remove Button */}
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() =>
                      handleDeleteMovie(movie.id ? movie.id : movie.tmdb_id)
                    } // Handle movie deletion
                    sx={{
                      ml: 2,
                      fontSize: "0.8rem",
                      fontWeight: "bold",
                      textTransform: "uppercase",
                      backgroundColor: "#FF6666", // Custom color for the button
                      "&:hover": { backgroundColor: "#FF3333" },
                    }}
                  >
                    Remove
                  </Button>
                </ListItem>
              ))
            ) : (
              <Typography
                variant="body2"
                sx={{
                  textAlign: "center",
                  color: "var(--secondary-text)",
                  fontStyle: "italic",
                  mt: 2,
                }}
              >
                No movies in this playlist.
              </Typography>
            )}
          </List>

          {/* Close Button */}
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              variant="contained"
              onClick={handleModalClose}
              sx={{
                px: 4,
                py: 0.5,
                fontWeight: "bold",
                textTransform: "uppercase",
                backgroundColor: "var(--primary-text)",
                color: "var(--primary-bg)",
                "&:hover": { backgroundColor: "var(--primary-text)" },
              }}
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Create Playlist Modal */}
      <Modal
        open={openCreatePlaylistModal}
        onClose={() => setOpenCreatePlaylistModal(false)}
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
            onPlaylistCreated={fetchPlaylists} // Refresh playlists after creation
            onClose={() => setOpenCreatePlaylistModal(false)} // Close the modal
          />
        </Box>
      </Modal>

      {/* Add Movies Modal */}

      <Modal
        open={openAddMoviesModal}
        onClose={() => setOpenAddMoviesModal(false)} // Close the modal
        sx={{ overflowY: "auto", maxHeight: "700px" }}
      >
        <Box
          sx={{
            p: 4,
            backgroundColor: "var(--primary-bg)", // Customize background color
            borderRadius: "8px",
            maxWidth: "1200px", // Adjust width as needed
            mx: "auto",
            mt: "10%", // Center vertically on the page
            color: "var(--primary-text)", // Customize text color
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h4"
              sx={{ mb: 2, color: "var(--highlight-color)" }}
            >
              Movie Selection
            </Typography>
            <AccentButton
              text="Add Movies"
              onClick={handleAddMovies}
              width="30%"
            />
          </Box>
          <Dashboard
            mode="choose-movies"
            onSelectMovie={handleSelectMovie}
            selectedMovies={selectedMovies}
          />
        </Box>
      </Modal>
    </Box>
  );
};

export default Playlist;

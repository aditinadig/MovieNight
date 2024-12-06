import React, { useEffect, useState } from "react";
import { db, auth } from "../../../firebaseConfig";
import { Grid, Typography, Box, Modal, Chip, Button, TextField, List, ListItem, ListItemText } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import AccentButton from "../form/AccentButton";
import { collection, addDoc, deleteDoc, doc, onSnapshot, updateDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { fetchPlaylistsByUser } from "../../services/playlistsService.js";

import PlaylistCard from "../playlists/PlaylistCard"; // Ensure correct path to PlaylistCard

const Playlist = () => {
  useEffect(() => {
    const authToken = Cookies.get("authToken");

    if (!authToken) {
      window.location.href = "/login";
    }
  }, []);

  const [playlists, setPlaylists] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openCreatePlaylistModal, setOpenCreatePlaylistModal] = useState(false); // New state for create playlist modal
  const [selectedChip, setSelectedChip] = useState("All Playlists");
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [movies, setMovies] = useState([]); // New state to store movies for the playlist
  const [newPlaylistName, setNewPlaylistName] = useState(""); // New state for the playlist name


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
            if (movie && (movie.tmdb_id || movie.id)) { // Check for either tmdb_id or id
              console.log("Valid movie:", movie);
              return movie; // You can handle fetching additional data based on `id` here if needed
            } else {
              console.error("Invalid movie object, missing tmdb_id or id:", movie);
              return null;
            }
          });
  
          const validMoviePromises = moviePromises.filter(promise => promise !== null);
  
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
      const updatedMovies = movies.filter(movie => movie.id !== movieId);
      const playlistDocRef = doc(db, "playlists", editingPlaylist.id);

      await updateDoc(playlistDocRef, {
        movies: updatedMovies
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

  const handleChipClick = (chipLabel, fetchFunction) => {
    setSelectedChip(chipLabel);
    fetchFunction();
  };

//   const fetchPlaylists = async () => {
//     if (!userId) return;
//     try {
//       const response = await fetchAllPlaylists(userId);
//       setPlaylists(response); // Assuming playlists are returned as an array
//     } catch (error) {
//       console.error("Error fetching playlists:", error);
//     }
//   };

//   useEffect(() => {
//     fetchPlaylists();
//   }, [userId]);

// Update fetchPlaylists to use fetchPlaylistsByUser
const fetchPlaylists = async () => {
    if (!userId) return;
    try {
      const response = await fetchPlaylistsByUser(userId); // Use fetchPlaylistsByUser here
      setPlaylists(response); // Assuming playlists are returned as an array
    } catch (error) {
      console.error("Error fetching playlists:", error);
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

  // Handle creating a new playlist
  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return; // Ensure playlist name is not empty
  
    try {
      const playlistData = {
        name: newPlaylistName,
        userId: userId,
        createdAt: new Date(),
      };
  
      await addDoc(collection(db, "playlists"), playlistData); // Add the playlist to Firestore
      setOpenCreatePlaylistModal(false); // Close modal after creation
      setNewPlaylistName(""); // Clear playlist name input
      fetchPlaylists(); // Refresh the list of playlists
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };
  

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

      {/* Filter buttons (optional) */}
      <Box sx={{ display: "flex" }}>
        <Chip
          label="All Playlists"
          sx={{
            color: "var(--primary-text)",
            backgroundColor:
              selectedChip === "All Playlists"
                ? "var(--disabled)"
                : "var(--card-bg)",
            p: 2,
            mr: 2,
            "&:hover": {
              backgroundColor: "var(--disabled)",
            },
          }}
          onClick={() => handleChipClick("All Playlists", fetchPlaylists)}
        />
      </Box>

      <Grid container spacing={8} mt={0}>
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={playlist.id}>
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

        

      {/* Edit Playlist Modal */}
      <Modal open={openModal} onClose={handleModalClose}>
  <Box
    sx={{
      p: 4,
      backgroundColor: "var(--primary-bg)",
      borderRadius: "8px",
      maxWidth: "800px",
      width: "90%",
      mx: "auto",
      my: "5%",
      height: "80vh",
      overflowY: "scroll",
    }}
  >
    <Typography variant="h4" gutterBottom>
      Movies in Playlist: {editingPlaylist ? editingPlaylist.name : ""}
    </Typography>
    <List>
      {movies.length > 0 ? (
        movies.map((movie, index) => (
          <ListItem key={index} sx={{ display: "flex", alignItems: "center" }}>
            {/* Display poster image if available */}
            <Box sx={{ mr: 2 }}>
              {movie.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                  alt={movie.title}
                  style={{ width: "50px", height: "75px", objectFit: "cover" }}
                />
              ) : (
                <Box sx={{ width: "50px", height: "75px", backgroundColor: "#ccc" }} />
              )}
            </Box>
            <ListItemText
              primary={movie.title} // Display movie title
            />
            <Button
                    variant="contained"
                    color="error"
                    onClick={() => handleDeleteMovie(movie.id)} // Pass movie id to delete
                  >
                    Remove
                  </Button>
          </ListItem>
        ))
      ) : (
        <Typography variant="body2" color="textSecondary">
          No movies in this playlist.
        </Typography>
      )}
    </List>
  </Box>
</Modal>

{/* Create Playlist Modal */}
<Modal
  open={openCreatePlaylistModal}
  onClose={() => setOpenCreatePlaylistModal(false)}
>
  <Box
    sx={{
      p: 4,
      backgroundColor: "white",
      borderRadius: "8px",
      maxWidth: "400px",
      mx: "auto",
      my: "20%",
    }}
  >
    <Typography variant="h5" gutterBottom>
      Create New Playlist
    </Typography>

    <TextField
      label="Playlist Name"
      value={newPlaylistName}
      onChange={(e) => setNewPlaylistName(e.target.value)}
      fullWidth
      sx={{ mb: 3 }}
      required
    />


    <AccentButton
      text="Create"
      onClick={handleCreatePlaylist} // Call function on button click
      width="100%"
      padding="0.5rem"
      marginTop="1rem"
    />
  </Box>
</Modal>


    </Box>
  );
};

export default Playlist;

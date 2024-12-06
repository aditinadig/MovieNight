import React, { useEffect, useState } from "react";
import { db, auth } from "../../../firebaseConfig";
import { Grid, Typography, Box, Modal, Chip } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import PlaylistCard from "../movies/PlaylistCard"; // Create PlaylistCard component for displaying playlists
import AccentButton from "../form/AccentButton";
import PlaylistForm from "./PlaylistForm"; // Form for creating/updating playlists
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import { fetchPlaylistsByUser } from "../../services/playlistService"; // Create a service to fetch playlists

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
  const [selectedChip, setSelectedChip] = useState("All Playlists");
  const [editingPlaylist, setEditingPlaylist] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const handleEdit = (playlist) => {
    setEditingPlaylist(playlist);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditingPlaylist(null);
    setEditModalOpen(false);
  };

  const handlePlaylistSave = (updatedPlaylist) => {
    setPlaylists((prevPlaylists) =>
      prevPlaylists.map((playlist) =>
        playlist.id === updatedPlaylist.id ? updatedPlaylist : playlist
      )
    );
    handleEditModalClose();
  };

  const handleChipClick = (chipLabel, fetchFunction) => {
    setSelectedChip(chipLabel);
    fetchFunction();
  };

  const handleModalOpen = (playlist) => {
    setSelectedPlaylist(playlist);
    setOpenModal(true);

    const playlistDocRef = doc(db, "playlists", playlist.id);
    const unsubscribe = onSnapshot(playlistDocRef, (snapshot) => {
      setSelectedPlaylist({ id: snapshot.id, ...snapshot.data() });
    });

    return () => unsubscribe(); // Cleanup listener on modal close
  };

  const handleModalClose = () => setOpenModal(false);

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

  const fetchPlaylists = async () => {
    if (!userId) return;
    try {
      const response = await fetchPlaylistsByUser(userId);
      setPlaylists(response); // Assuming playlists are returned as an array
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, [userId]);

  return (
    <Box sx={{ px: 12, py: 6 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h3" gutterBottom>
          Your Playlists
        </Typography>
        <AccentButton
          text="Create Playlist"
          navigateTo="/create-playlist"
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

      <Grid container spacing={4} mt={2}>
        {playlists.length > 0 ? (
          playlists.map((playlist) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={playlist.id}>
              <PlaylistCard
                playlist={playlist}
                handleEdit={handleEdit} // Handle editing playlists
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
      <Modal open={editModalOpen} onClose={handleEditModalClose}>
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
          {editingPlaylist && (
            <PlaylistForm
              initialPlaylist={editingPlaylist} // Pass the selected playlist for editing
              onSave={handlePlaylistSave} // Callback for saving the edited playlist
              onCancel={handleEditModalClose} // Callback for closing the modal
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Playlist;

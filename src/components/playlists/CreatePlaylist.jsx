import React, { useState, useEffect } from "react";
import { db, auth } from "../../../firebaseConfig";
import { Typography, Box, TextField } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import AccentButton from "../form/AccentButton";
import { collection, addDoc } from "firebase/firestore";
import "../../styles/global.css";
import "../../styles/animations.css";
import InputField from "../form/InputField";

const CreatePlaylist = ({onPlaylistCreated, onClose}) => {
  const [userId, setUserId] = useState(null);
  const [newPlaylistName, setNewPlaylistName] = useState(""); // New state for the playlist name

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
      alert(`Playlist '${newPlaylistName}' created successfully!`);
      setNewPlaylistName(""); // Clear playlist name input
      if (onPlaylistCreated) {
        onPlaylistCreated(); // Call the callback to refresh playlists
      }
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Error creating playlist:", error);
    }
  };

  return (
    <Box
      sx={{
        p: 4,
        backgroundColor: "var(--primary-bg)",
        borderRadius: "8px",
        maxWidth: "400px",
        m: "auto",
      }}
    >
      <Typography variant="h5" gutterBottom>
        Create New Playlist
      </Typography>

      <br />

      {/* <TextField
        label="Playlist Name"
        value={newPlaylistName}
        onChange={(e) => setNewPlaylistName(e.target.value)}
        fullWidth
        sx={{ mb: 3 }}
        required
      /> */}

      <InputField
        label="Playlist Name"
        value={newPlaylistName}
        onChange={(e) => setNewPlaylistName(e.target.value)}
        fullWidth
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
  );
};

export default CreatePlaylist;

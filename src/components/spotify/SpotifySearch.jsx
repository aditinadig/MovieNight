import React, { useState, useEffect } from "react";
import { searchSpotify } from "../../utils/spotifyApi";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

const SpotifySearch = ({ albumName }) => {
  const [loading, setLoading] = useState(false);
  const [embedUrls, setEmbedUrls] = useState([]); // Store all embed URLs
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is authenticated and handle token extraction
  useEffect(() => {
    const hash = window.location.hash;

    if (hash) {
      const params = hash
        .substring(1)
        .split("&")
        .reduce((acc, item) => {
          const [key, value] = item.split("=");
          acc[key] = decodeURIComponent(value);
          return acc;
        }, {});

      if (params.access_token) {
        localStorage.setItem("spotifyAccessToken", params.access_token);
        sessionStorage.setItem("spotifyAccessToken", params.access_token);
        setIsAuthenticated(true);
        window.history.replaceState({}, document.title, window.location.pathname);
      } else if (params.error) {
        console.error("Spotify login error:", params.error);
      }
    } else {
      const token =
        localStorage.getItem("spotifyAccessToken") ||
        sessionStorage.getItem("spotifyAccessToken");
      setIsAuthenticated(!!token);
    }
  }, []);

  // Fetch albums and display their players
  useEffect(() => {
    const fetchAlbums = async () => {
      if (!albumName) return;
      setLoading(true);
      const sanitizedAlbumName = albumName.replace(/[^a-zA-Z0-9 ]/g, "");
      console.log("Sanitized Album Name:", sanitizedAlbumName);
      try {
        const data = await searchSpotify(sanitizedAlbumName, "album", 1); // Fetch up to 5 albums

        if (data && data.albums && data.albums.items.length > 0) {
          const urls = data.albums.items.map((album) => {
            const albumUri = album.uri.split(":")[2];
            return `https://open.spotify.com/embed/album/${albumUri}`;
          });
          setEmbedUrls(urls); // Store all embed URLs
        } else {
          setEmbedUrls([]); // Clear embed URLs if no albums are found
        }
      } catch (error) {
        console.error("Error fetching albums:", error);
        setEmbedUrls([]);
      }
      setLoading(false);
    };

    fetchAlbums();
  }, [albumName]);

  const handleLogin = () => {
    const clientId = "5a7e7dd5bf8741a3b2daf1ae4a47ed78";
    const redirectUri = "http://localhost:4321/dashboard";
    const scopes = [
      "streaming",
      "user-read-private",
      "user-read-email",
      "user-read-playback-state",
    ].join("%20");

    const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&scope=${scopes}`;

    window.location.href = authUrl;
  };

  return (
    <Box sx={{ p: 3, maxWidth: "800px", mx: "auto" }}>
      <Typography variant="h4" align="center" gutterBottom sx={{ color: "#1db954", fontWeight: 600 }}>
        Spotify Album Viewer
      </Typography>

      {isAuthenticated ? (
        <Typography variant="subtitle1" align="center" gutterBottom>
          You are logged into Spotify. 🎵 <br />
          Viewing albums for: <strong>{albumName}</strong>
        </Typography>
      ) : (
        <Box textAlign="center" sx={{ mb: 3 }}>
          <Typography variant="body1">
            You are not logged into Spotify. You can still preview albums or log in for full functionality.
          </Typography>
          <Button
            variant="contained"
            color="success"
            onClick={handleLogin}
            sx={{ mt: 2 }}
          >
            Log in to Spotify
          </Button>
        </Box>
      )}

      {loading && (
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          <CircularProgress color="inherit" />
          Loading albums...
        </Typography>
      )}

      {!loading && embedUrls.length === 0 && albumName && (
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          No albums found for <strong>{albumName}</strong>.
        </Typography>
      )}

      {!loading && embedUrls.length > 0 && (
        <Box sx={{ mt: 3, textAlign: "center" }}>
          {embedUrls.map((url, index) => (
            <Box key={index} sx={{ mb: 4 }}>
              <iframe
                src={url}
                width="300"
                height="380"
                frameBorder="0"
                allow="encrypted-media"
                title={`Spotify Player ${index + 1}`}
              ></iframe>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default SpotifySearch;
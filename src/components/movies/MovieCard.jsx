import React from "react";
import {
  Button,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Link,
} from "@mui/material";

export default function MovieCard({
  id,
  title,
  genre,
  image,
  mode,
  onSelect,
  onLearnMore, // Add this prop to handle button click
  selectedMovies = [],
  handlePlaylistModalOpen,
}) {
  const isSelected = selectedMovies.some((movie) => movie.tmdb_id === id);

  return (
    <Card
      onClick={mode === "choose-movies" ? onSelect : undefined} // Only clickable in "choose-movies" mode
      sx={{
        backgroundColor: "var(--card-bg)", // Background color
        color: "var(--primary-text)", // Text color
        borderRadius: "var(--border-radius)", // Border radius
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column", // Ensure content stacks vertically
        cursor: mode === "choose-movies" ? "pointer" : "default", // Make selectable if mode is 'choose-movies'
        pointerEvents: mode === "disabled" ? "none" : "auto", // Disable interactions if mode is 'disabled'
        opacity: mode === "disabled" ? 0.5 : 1, // Reduce opacity if mode is 'disabled'
        "&:hover": {
          boxShadow: mode === "disabled" ? "none" : "0 0 5px 2px var(--border)", // Add a shadow on hover if not disabled
        },
        "&:active": {
          transform: mode === "disabled" ? "none" : "scale(0.98)", // Shrink the card slightly when clicked if not disabled
        },
        border: isSelected ? "2px solid var(--accent-color)" : "none", // Add a border if the movie is selected
        position: "relative", // For positioning the "+" button
      }}
    >
      {/* Add to Playlist Button */}
      {mode !== "choose-movies" ? (
        <>
          <Box
            sx={{
              position: "absolute",
              top: "8px",
              right: "8px",
              zIndex: 2,
              backgroundColor: "var(--accent-color)", // Button background
              borderRadius: "50%", // Circular button
              width: "35px",
              height: "35px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              boxShadow: "0 0 30px rgba(0, 0, 0)",
              fontSize: "2rem",
              fontWeight: "800",
              cursor: "pointer",
              "&:hover": {
                boxShadow: "0 0 50px rgba(0, 0, 0)",
              },
            }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent triggering card click
              if (handlePlaylistModalOpen) handlePlaylistModalOpen(id); // Call the add-to-playlist function
            }}
          >
            +
          </Box>
        </>
      ) : (
        ""
      )}

      {/* Movie Image */}
      <CardMedia
        component="img"
        image={image}
        alt={title}
        sx={{
          height:
            mode === "choose-movies"
              ? "1.5rem"
              : mode === "surprise-movies"
              ? "3rem"
              : "20rem", // Set a fixed height for the image
          objectFit: "cover", // Ensure the image covers the container without distortion
        }}
      />

      {/* Movie Details */}
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end", // Align the content at the bottom
          paddingBottom: "4rem", // This creates space for the buttons at the bottom
        }}
      >
        <Typography
          variant="h7"
          sx={{
            fontWeight: "600",
            color: "var(--primary-text)",
            lineHeight: "1.2",
          }}
        >
          {title}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "var(--secondary-text)", marginTop: "4px" }}
        >
          {genre}
        </Typography>
        {/* Buttons - Learn More */}
        <Box sx={{ marginTop: "auto" }}>
          <Link
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click event
              if (onLearnMore) onLearnMore(id); // Call the onLearnMore function
            }}
            sx={{
              marginTop: "auto",
              cursor: "pointer",
              fontSize: "0.8rem",
              textDecoration: "underline",
              textDecorationColor: "var(--secondary-text)",
              color: "var(--secondary-text)",
            }}
          >
            Learn More
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
}

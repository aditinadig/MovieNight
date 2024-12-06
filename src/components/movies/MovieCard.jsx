import React from "react";
import { Button, Card, CardMedia, CardContent, Typography, Box } from "@mui/material";


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
      }}
    >
      {/* Movie Image */}
      <CardMedia
        component="img"
        image={image}
        alt={title}
        sx={{
          height: mode === "choose-movies" ? "1.5rem" : mode === "surprise-movies" ? "3rem": "20rem", // Set a fixed height for the image
          objectFit: "cover", // Ensure the image covers the container without distortion
        }}
      />

      {/* Movie Details */}
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end", // Align the content at the bottom
          //flexGrow: 1, // Allow the content to take up the available space
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
       {/* Buttons - Learn More and Add to Playlist */}
       <Box sx={{ marginTop: 4, display: "flex", justifyContent: "center", gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click event
              if (onLearnMore) onLearnMore(id); // Call the onLearnMore function
            }}
            sx={{
              flex: 1,
              textTransform: "none",
              borderColor:"lightgreen",
              color:"lightgreen",
              "&:hover": {borderColor: "darkgreen", // Darken the border on hover
                backgroundColor: "rgba(0, 128, 0, 0.1)",},
            }}
          >
            Learn More
          </Button>
          
        </Box>
      </CardContent>
    </Card>
  );
}

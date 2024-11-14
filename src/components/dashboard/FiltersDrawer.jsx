import React from "react";
import { Box, Typography, TextField, Slider, MenuItem, Button } from "@mui/material";

const FiltersDrawer = ({
  genres = [],
  selectedGenre,
  releaseYear,
  rating,
  language,
  popularity,
  mood,
  handleGenreChange,
  handleReleaseYearChange,
  handleRatingChange,
  handleLanguageChange,
  handlePopularityChange,
  handleMoodChange,
  resetFilters,
}) => {

  

  return (
    <Box
      sx={{
        width: "75%",
        height: "61%",
        //maxHeight: "75vh",  // Ensure the box doesn't exceed the viewport height
        mt: 4,
        mb: 8,
        backgroundColor: "rgba(30, 30, 30, 0.9)", // Darker background with slight transparency
        borderRadius: "var(--border-radius)",
        p: 4,
        color: "var(--primary-text)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        overflowY: "auto",       // Allow scrolling inside the sidebar if content overflows
        //position: "relative", // Sidebar position remains unchanged
        "&::-webkit-scrollbar": {
          width: "8px", // Scrollbar width
          height: "8px", // Horizontal scrollbar height
        },
        "&::-webkit-scrollbar-track": {
          background: "#333", // Dark background for the track
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#F1A7A0", // Gold color for the thumb
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#C08081", // Lighter gold when hovering
        },
      }}
    >
      <Typography variant="h6" sx={{ mb: 0, fontWeight: "bold", color: "#F1A7A0" }}>
        Filters
      </Typography>

      {/* Reset/Clear Filters Button */}
      <Button
        onClick={resetFilters}
        variant="contained"
        sx={{
          mt: 1,
          mb: 3,
          padding: "3px 6px",
          fontSize: "0.5rem",
          backgroundColor: "#C08081",
          color: "#000000",
          "&:hover": {
            backgroundColor: "#F1A7A0",
          },
        }}
      >
        Clear All
      </Button>

      {/* Genre Filter */}
      <TextField
        label="Genre"
        select
        value={selectedGenre}
        onChange={handleGenreChange}
        fullWidth
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#333", // Darker input background
            borderRadius: "10px",
            fontSize: "15px", // Smaller font size inside the input box
            minHeight: "10px",
          },
          "& .MuiInputLabel-root": { color: "#FFFFFF" },
          "& .MuiSelect-icon": { color: "#FFFFFF" },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F1A7A0",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F1A7A0",
          },
          "& .MuiSelect-select": {
      color: "#FFFFFF", // White color for the selected text
    },
        }}
      >
        <MenuItem value="">Select Genre</MenuItem>
        {genres.map((genre) => (
          <MenuItem key={genre.id} value={genre.id}>
            {genre.name}
          </MenuItem>
        ))}
      </TextField>

      {/* Release Year Filter */}
      <TextField
        label="Release Year"
        type="number"
        value={releaseYear}
        onChange={handleReleaseYearChange}
        fullWidth
        sx={{
          mb: 3,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#333",
            borderRadius: "10px",
            fontSize: "15px", 
            minHeight: "10px",
          },
          "& .MuiInputLabel-root": { color: "#FFFFFF" },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F1A7A0",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F1A7A0",
          },
        }}
      />

      {/* Mood Filter */}
      <TextField
        label="Mood"
        select
        value={mood}
        onChange={handleMoodChange}
        fullWidth
        sx={{
          mb: 4,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#333", // Darker input background
            borderRadius: "10px",
            fontSize: "15px", // Smaller font size inside the input box
            minHeight: "10px",
          },
          "& .MuiInputLabel-root": { color: "#FFFFFF" }, // White label color
          "& .MuiSelect-icon": { color: "#FFFFFF" },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F1A7A0",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F1A7A0",
          },
          "& .MuiSelect-select": {
      color: "#FFFFFF", // White color for the selected text
    },
        }}
      >
        <MenuItem value="">Select Mood</MenuItem>
        <MenuItem value="happy">Happy</MenuItem>
        <MenuItem value="romantic">Romantic</MenuItem>
        <MenuItem value="exciting">Exciting</MenuItem>
        <MenuItem value="thrilling">Thrilling</MenuItem>
        <MenuItem value="sad">Sad</MenuItem>
      </TextField>

      {/* Rating Filter */}
      <Typography gutterBottom sx={{ color: "#FFFFFF", mb: 1 }}>
        Rating
      </Typography>
      <Slider
        value={rating}
        onChange={handleRatingChange}
        valueLabelDisplay="auto"
        min={0}
        max={10}
        sx={{
          mb: 2.5,
          color: "#F1A7A0", 
          "& .MuiSlider-thumb": {
            backgroundColor: "#C08081",
            "&:hover": {
              boxShadow: "0px 0px 0px 8px rgba(255, 215, 0, 0.16)", // Gold glow
            },
          },
          "& .MuiSlider-rail": {
            color: "#555",
          },
        }}
      />

      {/* Language Filter */}
      <TextField
        label="Language"
        value={language}
        onChange={handleLanguageChange}
        fullWidth
        sx={{
          mt: 2,
          mb: 3,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#333",
            borderRadius: "10px",
            fontSize: "15px", // Smaller font size inside the input box
            minHeight: "10px",
          },
          "& .MuiInputLabel-root": { color: "#FFFFFF" },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F1A7A0",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F1A7A0",
          },
        }}
      />

      {/* Popularity Filter */}
      <TextField
        label="Popularity"
        select
        value={popularity}
        onChange={handlePopularityChange}
        fullWidth
        sx={{
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#333",
            borderRadius: "10px",
            fontSize: "15px", // Smaller font size inside the input box
            minHeight: "10px",
          },
          "& .MuiInputLabel-root": { color: "#FFFFFF" },
          "& .MuiSelect-icon": { color: "#FFFFFF" },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F1A7A0",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#F1A7A0",
          },
          "& .MuiSelect-select": {
      color: "#FFFFFF", // White color for the selected text
    },
        }}
      >
        <MenuItem value="popularity.desc">Most Popular</MenuItem>
        <MenuItem value="popularity.asc">Least Popular</MenuItem>
      </TextField>

      

    </Box>
  );
};

export default FiltersDrawer;

import React from "react";
import { Box, Typography, TextField, Slider, MenuItem } from "@mui/material";

const FiltersDrawer = ({
  genres = [],
  selectedGenre,
  releaseYear,
  rating,
  language,
  popularity,
  handleGenreChange,
  handleReleaseYearChange,
  handleRatingChange,
  handleLanguageChange,
  handlePopularityChange,
}) => {
  return (
    <Box
      sx={{
        width: "100%",
        mt: 4,
        mb: 8,
        backgroundColor: "rgba(30, 30, 30, 0.9)", // Darker background with slight transparency
        borderRadius: "var(--border-radius)",
        p: 3,
        color: "var(--primary-text)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      }}
    >
      <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold", color: "#b59c14" }}>
        Filters
      </Typography>

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
            borderRadius: "6px",
          },
          "& .MuiInputLabel-root": { color: "#FFFFFF" }, // Golden label color
          "& .MuiSelect-icon": { color: "#FFFFFF" },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#555",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FFD700",
          },
        }}
      >
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
            borderRadius: "6px",
          },
          "& .MuiInputLabel-root": { color: "#FFFFFF" },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#555",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FFD700",
          },
        }}
      />

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
          color: "#b59c14", // Gold-colored slider
          "& .MuiSlider-thumb": {
            backgroundColor: "#FFD700",
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
          mt: 3,
          mb: 3,
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#333",
            borderRadius: "6px",
          },
          "& .MuiInputLabel-root": { color: "#FFFFFF" },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#555",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FFD700",
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
            borderRadius: "6px",
          },
          "& .MuiInputLabel-root": { color: "#FFFFFF" },
          "& .MuiSelect-icon": { color: "#FFFFFF" },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#555",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#FFD700",
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

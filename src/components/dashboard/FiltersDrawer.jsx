import React from "react";
import {
  Box,
  Typography,
  TextField,
  Slider,
  MenuItem,
  Button,
} from "@mui/material";

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
        backgroundColor: "var(--secondary-bg)", // Darker background with slight transparency
        borderRadius: "var(--border-radius)",
        p: 4,
        color: "var(--primary-text)",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
        overflowY: "auto", // Allow scrolling inside the sidebar if content overflows
        //position: "relative", // Sidebar position remains unchanged
        "&::-webkit-scrollbar": {
          width: "8px", // Scrollbar width
          height: "8px", // Horizontal scrollbar height
        },
        "&::-webkit-scrollbar-track": {
          background: "var(--card-bg)", // Dark background for the track
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "var(--border)", // Gold color for the thumb
          borderRadius: "10px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "var(--border)", // Lighter gold when hovering
        },
      }}
    >
      <Typography
        variant="h5"
        sx={{ mb: 2, fontWeight: "bold", color: "var(--accent-color)" }}
      >
        Filters
      </Typography>

      {/* Reset/Clear Filters Button */}
      <Button
        onClick={resetFilters}
        variant="contained"
        sx={{
          mt: 1,
          mb: 3,
          pr: 2,
          pl: 2,
          fontSize: "0.5rem",
          backgroundColor: "var(--border)",
          "&:hover": {
            backgroundColor: "var(--border)",
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
            color: "var(--primary-text)",
            backgroundColor: "var(--card-bg)", // Darker input background
            borderRadius: "10px",
            fontSize: "15px", // Smaller font size inside the input box
            minHeight: "10px",
            borderColor: "var(--border)",
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--accent-color) !important",
            },
          },
          "& .MuiInputLabel-root": { color: "var(--primary-text)" }, // Golden label color
          "& .MuiSelect-icon": { color: "var(--primary-text)" },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--border)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--accent-color)",
          },
          "& .MuiSelect-select": {
            color: "var(--primary-text)", // White color for the selected text
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
            color: "var(--primary-text)",
            backgroundColor: "var(--card-bg)", // Darker input background
            borderRadius: "10px",
            fontSize: "15px", // Smaller font size inside the input box
            minHeight: "10px",
            borderColor: "var(--border)",
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--accent-color) !important",
            },
          },
          "& .MuiInputLabel-root": { color: "var(--primary-text)" }, // Golden label color
          "& .MuiSelect-icon": { color: "var(--primary-text)" },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--border)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--accent-color)",
          },
          "& .MuiSelect-select": {
            color: "var(--primary-text)", // White color for the selected text
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
          mb: 3,
          "& .MuiOutlinedInput-root": {
            color: "var(--primary-text)",
            backgroundColor: "var(--card-bg)", // Darker input background
            borderRadius: "10px",
            fontSize: "15px", // Smaller font size inside the input box
            minHeight: "10px",
            borderColor: "var(--border)",
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--accent-color) !important",
            },
          },
          "& .MuiInputLabel-root": { color: "var(--primary-text)" }, // Golden label color
          "& .MuiSelect-icon": { color: "var(--primary-text)" },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--border)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--accent-color)",
          },
          "& .MuiSelect-select": {
            color: "var(--primary-text)", // White color for the selected text
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
      <Typography gutterBottom sx={{ color: "var(--primary-text)", mb: 1 }}>
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
          color: "var(--accent-color)",
          "& .MuiSlider-thumb": {
            backgroundColor: "var(--accent-color)",
            "&:hover": {
              boxShadow: "0px 0px 0px 8px rgba(255, 215, 0, 0.16)", // Gold glow
            },
          },
          "& .MuiSlider-rail": {
            color: "var(--border)",
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
          mb: 3,
          "& .MuiOutlinedInput-root": {
            color: "var(--primary-text)",
            backgroundColor: "var(--card-bg)", // Darker input background
            borderRadius: "10px",
            fontSize: "15px", // Smaller font size inside the input box
            minHeight: "10px",
            borderColor: "var(--border)",
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--accent-color) !important",
            },
          },
          "& .MuiInputLabel-root": { color: "var(--primary-text)" }, // Golden label color
          "& .MuiSelect-icon": { color: "var(--primary-text)" },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--border)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--accent-color)",
          },
          "& .MuiSelect-select": {
            color: "var(--primary-text)", // White color for the selected text
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
          mb: 3,
          "& .MuiOutlinedInput-root": {
            color: "var(--primary-text)",
            backgroundColor: "var(--card-bg)", // Darker input background
            borderRadius: "10px",
            fontSize: "15px", // Smaller font size inside the input box
            minHeight: "10px",
            borderColor: "var(--border)",
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "var(--accent-color) !important",
            },
          },
          "& .MuiInputLabel-root": { color: "var(--primary-text)" }, // Golden label color
          "& .MuiSelect-icon": { color: "var(--primary-text)" },
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--border)",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "var(--accent-color)",
          },
          "& .MuiSelect-select": {
            color: "var(--primary-text)", // White color for the selected text
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

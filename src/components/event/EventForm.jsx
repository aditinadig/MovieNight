import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Grid,
  TextField,
} from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { db, auth } from "../../../firebaseConfig"; // Ensure db and auth are correctly imported
import InputField from "../form/InputField";
import AccentButton from "../form/accentButton";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import {
  DatePicker,
  TimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const EventForm = () => {
  const [eventName, setEventName] = useState("");
  const [eventDateTime, setEventDateTime] = useState("");
  const [eventDate, setEventDate] = useState(null);
  const [eventTime, setEventTime] = useState(null);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [invitees, setInvitees] = useState([]);

  // Placeholder movies (replace with your movie fetching logic)
  const availableMovies = [
    { title: "The Matrix", tmdb_id: "603", year: 1999 },
    { title: "Inception", tmdb_id: "27205", year: 2010 },
    { title: "Interstellar", tmdb_id: "157336", year: 2014 },
  ];

  const handleSelectMovie = (movie) => {
    setSelectedMovies((prev) => [...prev, movie]);
  };

  const handleCreateEvent = async () => {
    const creatorId = auth.currentUser?.uid;
    console.log("Creator ID: ", creatorId);
    if (!creatorId || !eventName) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const eventRef = await addDoc(collection(db, "events"), {
        creator: `${creatorId}`,
        date: eventDateTime,
        event_name: eventName,
        invitees,
        movies: selectedMovies,
        votes: [],
      });

      console.log("Event created with ID: ", eventRef.id);
      setEventName("");
      setEventDateTime("");
      setSelectedMovies([]);
      setInvitees([]);
    } catch (error) {
      console.error("Error creating event: ", error);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "auto",
        color: "var(--primary-text)",
        p: 4,
      }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "600",
          marginBottom: 4,
          color: "var(--primary-text)",
        }}
      >
        Create a Movie Night
      </Typography>

      <InputField
        label="Event Name"
        value={eventName}
        onChange={(e) => setEventName(e.target.value)}
      />

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {/* Date Picker */}
        <DatePicker
          label="Event Date"
          value={eventDate}
          onChange={(newValue) => setEventDate(newValue)}
          sx={{
            marginRight: 2,
            "& .MuiInputBase-root": {
              color: "var(--primary-text)",
              borderRadius: "var(--border-radius)",
              backgroundColor: "var(--primary-bg)", // Background color
            },
            "& .MuiFormLabel-root": {
              color: "var(--primary-text)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--border)", // Default border color
              },
              "&:hover fieldset": {
                borderColor: "var(--accent-color)", // Border color on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--accent-color) !important", // Border color when focused
                borderWidth: "2px", // Optional border width
              },
            },
            "& .MuiButtonBase-root": {
                color: "var(--primary-text)",
            }
          }}
        />

        {/* Time Picker */}
        <TimePicker
          label="Event Time"
          value={eventTime}
          onChange={(newValue) => setEventTime(newValue)}
          sx={{
            marginRight: 2,
            "& .MuiInputBase-root": {
              color: "var(--primary-text)",
              borderRadius: "var(--border-radius)",
              backgroundColor: "var(--primary-bg)", // Background color
            },
            "& .MuiFormLabel-root": {
              color: "var(--primary-text)",
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "var(--border)", // Default border color
              },
              "&:hover fieldset": {
                borderColor: "var(--accent-color)", // Border color on hover
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--accent-color) !important", // Border color when focused
                borderWidth: "2px", // Optional border width
              },
            },
            "& .MuiButtonBase-root": {
                color: "var(--primary-text)",
            }
          }}
        />
      </LocalizationProvider>

      {/* Invite Friends */}
      <Box sx={{ display: "flex", alignItems: "center", marginBottom: 4 }}>
        <IconButton
          color="primary"
          aria-label="invite friends"
          sx={{ color: "var(--accent-color)", mr: 1 }}
        >
          <PersonAddIcon />
        </IconButton>
        <Typography variant="body1">Invite Friends (Coming Soon)</Typography>
      </Box>

      {/* Movie Selection */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Add Movies to Vote On
      </Typography>
      <Grid container spacing={2}>
        {availableMovies.map((movie, index) => (
          <Grid item xs={6} sm={3} key={index}>
            <Box
              onClick={() => handleSelectMovie(movie)}
              sx={{
                cursor: "pointer",
                p: 1,
                border: "1px solid var(--border)",
                borderRadius: "var(--border-radius)",
              }}
            >
              <Typography variant="body1" sx={{ color: "var(--primary-text)" }}>
                {movie.title}
              </Typography>
              <Typography
                variant="body2"
                sx={{ color: "var(--secondary-text)" }}
              >
                {movie.year}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/* Create Event Button */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <AccentButton
          text="Create Event"
          onClick={handleCreateEvent}
          padding="12px 24px"
        />
      </Box>
    </Box>
  );
};

export default EventForm;

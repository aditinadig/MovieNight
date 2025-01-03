import React, { useEffect, useState } from "react";
import { db, auth } from "../../../firebaseConfig";
import {
  fetchEventsByUser,
  fetchEventsByCreator,
  fetchEventsByInvitee,
} from "../../services/eventsService";
import { Grid, Typography, Box, Modal, Chip } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import EventCard from "../movies/EventCard";
import AccentButton from "../form/AccentButton";
import VoteMovies from "../vote/VoteMovies";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import Cookies from "js-cookie";
import EventForm from "./EventForm";
import { set } from "date-fns";

const AllEvents = () => {
  useEffect(() => {
    const authToken = Cookies.get("authToken");

    if (!authToken) {
      window.location.href = "/login";
    }
  }, []);

  const [events, setEvents] = useState([]); // Initialize events as an empty array
  const [userId, setUserId] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedChip, setSelectedChip] = useState("All Events");
  const [editingEvent, setEditingEvent] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const handleEdit = (event) => {
    setEditingEvent(event);
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditingEvent(null);
    setEditModalOpen(false);
  };

  const handleEventSave = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    handleEditModalClose();
  };

  const handleChipClick = (chipLabel, fetchFunction) => {
    setSelectedChip(chipLabel);
    fetchFunction();
  };

  const handleModalOpen = (event) => {
    setSelectedEvent(event);
    setOpenModal(true);

    const eventDocRef = doc(db, "events", event.id);
    const unsubscribe = onSnapshot(eventDocRef, (snapshot) => {
      setSelectedEvent({ id: snapshot.id, ...snapshot.data() });
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

  const parseDateTime = (dateStr, timeStr) => {
    const [month, day, year] = dateStr.split("/").map(Number);
    const [time, period] = timeStr.split(" ");
    const [hours, minutes] = time.split(":").map(Number);
    const adjustedHours =
      period === "PM" && hours !== 12
        ? hours + 12
        : hours === 12 && period === "AM"
        ? 0
        : hours;

    return new Date(year, month - 1, day, adjustedHours, minutes);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      if (!userId) return;
      try {
        const response = await fetchEventsByUser(userId);
        const sortedEvents = response.sort(
          (a, b) =>
            parseDateTime(b.date, b.time) - parseDateTime(a.date, a.time)
        );
        setEvents(sortedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
      setLoadingEvents(false);
    };
    fetchEvents();
  }, [userId]);

  const fetchEvents = async () => {
    setLoadingEvents(true);
    if (!userId) return;
    try {
      const response = await fetchEventsByUser(userId);
      const sortedEvents = response.sort(
        (a, b) => parseDateTime(b.date, b.time) - parseDateTime(a.date, a.time)
      );
      setEvents(sortedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
    setLoadingEvents(false);
  };

  const fetchCreatorEvents = async () => {
    if (!userId) return;
    try {
      const response = await fetchEventsByCreator(userId);
      const sortedEvents = response.sort(
        (a, b) => parseDateTime(b.date, b.time) - parseDateTime(a.date, a.time)
      );
      setEvents(sortedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchInviteeEvents = async () => {
    if (!userId) return;
    try {
      const response = await fetchEventsByInvitee(userId);
      const sortedEvents = response.sort(
        (a, b) => parseDateTime(b.date, b.time) - parseDateTime(a.date, a.time)
      );
      setEvents(sortedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const handleVote = (event) => {
    handleModalOpen(event); // Ensure this calls handleModalOpen with the selected event
  };

  const handleMovieVote = async (movieId) => {
    if (!userId) return;

    const eventDocRef = doc(db, "events", selectedEvent.id);
    const movie = selectedEvent.movies.find((m) => m.tmdb_id === movieId);

    if (movie.votedBy?.includes(userId)) {
      alert("You have already voted for this movie.");
      return;
    }

    const updatedMovies = selectedEvent.movies.map((m) =>
      m.tmdb_id === movieId
        ? { ...m, votedBy: [...(m.votedBy || []), userId] }
        : m
    );

    await updateDoc(eventDocRef, { movies: updatedMovies });
  };

  return (
    <Box sx={{ px: 12, py: 6 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h3" gutterBottom>
          Upcoming Events
        </Typography>
        <AccentButton
          text="Create Event"
          navigateTo="/create-event"
          width="15%"
          padding="0"
          marginTop="0.5rem"
          marginBottom="1.5rem"
        />
      </Box>

      {/*Filter buttons*/}
      <Box sx={{ display: "flex" }}>
        <Chip
          label="All Events"
          sx={{
            color: "var(--primary-text)",
            backgroundColor:
              selectedChip === "All Events"
                ? "var(--disabled)"
                : "var(--card-bg)",
            p: 2,
            mr: 2,
            "&:hover": {
              backgroundColor: "var(--disabled)",
            },
          }}
          onClick={() => handleChipClick("All Events", fetchEvents)}
        />
        <Chip
          label="My Events"
          sx={{
            color: "var(--primary-text)",
            backgroundColor:
              selectedChip === "My Events"
                ? "var(--disabled)"
                : "var(--card-bg)",
            p: 2,
            mr: 2,
            "&:hover": {
              backgroundColor: "var(--disabled)",
            },
          }}
          onClick={() => handleChipClick("My Events", fetchCreatorEvents)}
        />
        <Chip
          label="Invited Events"
          sx={{
            color: "var(--primary-text)",
            backgroundColor:
              selectedChip === "Invited Events"
                ? "var(--disabled)"
                : "var(--card-bg)",
            p: 2,
            "&:hover": {
              backgroundColor: "var(--disabled)",
            },
          }}
          onClick={() => handleChipClick("Invited Events", fetchInviteeEvents)}
        />
      </Box>

      <Grid container spacing={4} mt={2}>
        {loadingEvents ? ( // Display "Loading events..." while fetching data
          <Typography variant="body1" sx={{ mt: 2 }}>
            Loading events...
          </Typography>
        ) : events.length > 0 ? ( // Display events if available
          events.map((event) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
              <EventCard
                event={event}
                handleVote={() => handleVote(event)} // Pass the specific event here
                handleEdit={handleEdit}
              />
            </Grid>
          ))
        ) : (
          // Show this only if no events are found after loading
          <Typography variant="body1" sx={{ mt: 2 }}>
            No events found.
          </Typography>
        )}
      </Grid>

      <Modal open={openModal} onClose={handleModalClose}>
        <VoteMovies
          selectedEvent={selectedEvent}
          userId={userId}
          handleMovieVote={handleMovieVote}
          handleModalClose={handleModalClose}
        />
      </Modal>

      {/* Edit Event Modal */}
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
          {editingEvent && (
            <EventForm
              initialEvent={editingEvent} // Pass the selected event for editing
              onSave={handleEventSave} // Callback for saving the edited event
              onCancel={handleEditModalClose} // Callback for closing the modal
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default AllEvents;

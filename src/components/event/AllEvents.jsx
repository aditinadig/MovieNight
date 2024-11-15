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

// Utility function for parsing date and time
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

// Reusable FilterChip component
const FilterChip = ({ label, isSelected, onClick }) => (
  <Chip
    label={label}
    sx={{
      color: "var(--primary-text)",
      backgroundColor: isSelected ? "var(--disabled)" : "var(--card-bg)",
      p: 2,
      mr: 2,
      "&:hover": { backgroundColor: "var(--disabled)" },
    }}
    onClick={onClick}
  />
);

// Reusable EventModal component
const EventModal = ({ open, event, userId, onVote, onClose }) => (
  <Modal open={open} onClose={onClose}>
    <VoteMovies
      selectedEvent={event}
      userId={userId}
      handleMovieVote={onVote}
      handleModalClose={onClose}
    />
  </Modal>
);

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const [userId, setUserId] = useState(null);
  const [modalState, setModalState] = useState({
    openModal: false,
    selectedEvent: null,
    editModalOpen: false,
    editingEvent: null,
  });
  const [selectedChip, setSelectedChip] = useState("All Events");

  const { openModal, selectedEvent, editModalOpen, editingEvent } = modalState;

  // Authentication check
  useEffect(() => {
    const authToken = Cookies.get("authToken");
    if (!authToken) {
      window.location.href = "/login";
    }
  }, []);

  // Fetch events based on type
  const fetchEventsByType = async (fetchFunction) => {
    if (!userId) return;
    try {
      const response = await fetchFunction(userId);
      const sortedEvents = response.sort(
        (a, b) => parseDateTime(b.date, b.time) - parseDateTime(a.date, a.time)
      );
      setEvents(sortedEvents);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  // Fetch events when userId changes
  useEffect(() => {
    const fetchUserEvents = () => fetchEventsByType(fetchEventsByUser);
    fetchUserEvents();
  }, [userId]);

  // Auth state change listener
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribeAuth();
  }, []);

  // Handle modal and chip states
  const handleChipClick = (chipLabel, fetchFunction) => {
    setSelectedChip(chipLabel);
    fetchEventsByType(fetchFunction);
  };

  const openEditModal = (event) =>
    setModalState({ ...modalState, editModalOpen: true, editingEvent: event });

  const closeEditModal = () =>
    setModalState({ ...modalState, editModalOpen: false, editingEvent: null });

  const handleEventSave = (updatedEvent) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );
    closeEditModal();
  };

  const openVoteModal = (event) =>
    setModalState({ ...modalState, openModal: true, selectedEvent: event });

  const closeVoteModal = () =>
    setModalState({ ...modalState, openModal: false, selectedEvent: null });

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

      {/* Filter Chips */}
      <Box sx={{ display: "flex" }}>
        <FilterChip
          label="All Events"
          isSelected={selectedChip === "All Events"}
          onClick={() => handleChipClick("All Events", fetchEventsByUser)}
        />
        <FilterChip
          label="My Events"
          isSelected={selectedChip === "My Events"}
          onClick={() => handleChipClick("My Events", fetchEventsByCreator)}
        />
        <FilterChip
          label="Invited Events"
          isSelected={selectedChip === "Invited Events"}
          onClick={() => handleChipClick("Invited Events", fetchEventsByInvitee)}
        />
      </Box>

      {/* Event Grid */}
      <Grid container spacing={4} mt={2}>
        {events.length > 0 ? (
          events.map((event) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={event.id}>
              <EventCard
                event={event}
                handleVote={() => openVoteModal(event)}
                handleEdit={openEditModal}
              />
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No events found.
          </Typography>
        )}
      </Grid>

      {/* Modals */}
      <EventModal
        open={openModal}
        event={selectedEvent}
        userId={userId}
        onVote={handleMovieVote}
        onClose={closeVoteModal}
      />

      <Modal open={editModalOpen} onClose={closeEditModal}>
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
              initialEvent={editingEvent}
              onSave={handleEventSave}
              onCancel={closeEditModal}
            />
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default AllEvents;
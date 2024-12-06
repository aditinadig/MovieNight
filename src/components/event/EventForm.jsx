import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  List,
  Modal,
  Snackbar,
  Alert,
  Button,
} from "@mui/material";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../../firebaseConfig";
import InputField from "../form/InputField";
import AccentButton from "../form/AccentButton";
import OutlineButton from "../form/outlineButton";
import AddIcon from "@mui/icons-material/Add";
import {
  DatePicker,
  MobileTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Dashboard from "../dashboard/Dashboard";
import UserCard from "../movies/UserCard";
import MovieCardSelected from "../movies/MovieCardSelected";
import { fetchUserByUID } from "../../services/usersService";
import Cookies from "js-cookie";
import SearchField from "../form/SearchField";

const EventForm = ({ initialEvent, onSave, onCancel }) => {
  const [eventName, setEventName] = useState(initialEvent?.event_name || "");
  const [eventDate, setEventDate] = useState(
    initialEvent?.date ? new Date(initialEvent.date) : null
  );
  const [eventTime, setEventTime] = useState(
    initialEvent?.time
      ? (() => {
          const [hours, minutes] = initialEvent.time.split(":");
          return new Date(1970, 0, 1, parseInt(hours), parseInt(minutes));
        })()
      : null
  );
  const [selectedMovies, setSelectedMovies] = useState(
    initialEvent?.movies || []
  );
  const [invitees, setInvitees] = useState(
    initialEvent?.invitees || []
  );

  useEffect(() => {
    const authToken = Cookies.get("authToken");

    if (!authToken) {
      window.location.href = "/login";
    }
  }, []);

  // Save or update the event
  const handleSave = async () => {
    const updatedEvent = {
      ...initialEvent,
      event_name: eventName,
      date: eventDate ? eventDate.toLocaleDateString("en-US") : null,
      time: eventTime
        ? eventTime.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : null,
      movies: selectedMovies,
      invitees,
    };
    if (initialEvent?.id) {
      // Editing an existing event
      const eventRef = doc(db, "events", initialEvent.id);
      await updateDoc(eventRef, updatedEvent);
    } else {
      // Creating a new event
      const creatorId = auth.currentUser?.uid;
      await addDoc(collection(db, "events"), {
        ...updatedEvent,
        creator: creatorId,
      });
    }

    onSave(updatedEvent);
  };

  const [showInviteInput, setShowInviteInput] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [userNotFound, setUserNotFound] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [dashboardModalOpen, setDashboardModalOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar state
  const [fetchedInvitees, setFetchedInvitees] = useState([]); // New state for storing fetched invitee data

  // Retrieve all registered users from Firestore, excluding those already invited
  const retrieveAllUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = querySnapshot.docs
        .map((doc) => ({
          username: doc.data().username,
          email: doc.data().email,
          UID: doc.data().UID,
        }))
        .filter((user) => !invitees.includes(user.UID));
      const currentUserUID = auth.currentUser?.uid;
      const filteredUsers = users.filter((user) => user.UID !== currentUserUID);
      setAllUsers(filteredUsers);
    } catch (error) {
      console.error("Error retrieving users:", error);
    }
  };

  useEffect(() => {
    retrieveAllUsers();
  }, [invitees]);

  useEffect(() => {
    const fetchInviteeDetails = async () => {
      const details = await Promise.all(
        invitees.map(async (uid) => {
          const userData = await fetchUserByUID(uid);
          return { ...userData, UID: uid };
        })
      );
      setFetchedInvitees(details);
    };

    if (invitees.length > 0) {
      fetchInviteeDetails();
    }
  }, [invitees]);

  // Inside EventForm component
  const handleSelectMovie = (movie) => {
    if (
      !selectedMovies.some((selected) => selected.tmdb_id === movie.tmdb_id)
    ) {
      setSelectedMovies((prev) => [
        ...prev,
        {
          title: movie.title,
          tmdb_id: movie.tmdb_id,
          poster: movie.poster_path, // Include poster path
        },
      ]);
    }
  };

  const handleRemoveMovie = (tmdb_id) => {
    setSelectedMovies((prev) =>
      prev.filter((movie) => movie.tmdb_id !== tmdb_id)
    );
  };

  const handleCreateEvent = async () => {
    const creatorId = auth.currentUser?.uid;
    if (!creatorId || !eventName || !eventDate || !eventTime) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      const formattedDate = eventDate.toLocaleDateString("en-US");
      const formattedTime = eventTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      invitees.push(creatorId); // Add the creator to the invitees list

      const eventRef = await addDoc(collection(db, "events"), {
        creator: creatorId,
        date: formattedDate,
        time: formattedTime,
        event_name: eventName,
        invitees: invitees, // Store only UIDs
        movies: selectedMovies,
        votes: [],
      });

      setEventName("");
      setEventDate(null);
      setEventTime(null);
      setSelectedMovies([]);
      setInvitees([]);
      setSnackbarOpen(true); // Show success message
      window.location.href = "/all-events";
    } catch (error) {
      console.error("Error creating event: ", error);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleInviteClick = () => {
    setShowInviteInput(!showInviteInput); // Toggles the invite input field
  };

  const handleOpenModal = () => {
    setShowInviteInput(false); // Close the invite input field
    setModalOpen(true); // Opens modal for choosing a friend
  };

  const handleCloseModal = () => setModalOpen(false); // Closes modal

  const handleSelectUser = async (user) => {
    const isAlreadyInvited = invitees.includes(user.UID);

    // Update invitees based on current selection status
    setInvitees((prevInvitees) =>
      isAlreadyInvited
        ? prevInvitees.filter((uid) => uid !== user.UID)
        : [...prevInvitees, user.UID]
    );

    // Fetch user details immediately and update fetchedInvitees accordingly
    if (!isAlreadyInvited) {
      const userData = await fetchUserByUID(user.UID);
      setFetchedInvitees((prevFetchedInvitees) => [
        ...prevFetchedInvitees,
        { ...userData, UID: user.UID },
      ]);
    } else {
      setFetchedInvitees((prevFetchedInvitees) =>
        prevFetchedInvitees.filter((invitee) => invitee.UID !== user.UID)
      );
    }
  };

  const handleAddInvitee = async () => {
    if (inviteEmail.trim()) {
      const userQuery = query(
        collection(db, "users"),
        where("email", "==", inviteEmail)
      );
      const querySnapshot = await getDocs(userQuery);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();
        setInvitees((prev) => [...prev, userData.UID]);

        // Update fetchedInvitees with the new invitee's data immediately
        setFetchedInvitees((prevFetchedInvitees) => [
          ...prevFetchedInvitees,
          { ...userData, UID: userData.UID },
        ]);

        setInviteEmail("");
        setUserNotFound(false);
      } else {
        setUserNotFound(true);
      }
    }
  };

  const handleRemoveInvitee = (uid) => {
    setInvitees((prevInvitees) =>
      prevInvitees.filter((invitee) => invitee !== uid)
    );
    setFetchedInvitees((prevFetchedInvitees) =>
      prevFetchedInvitees.filter((invitee) => invitee.UID !== uid)
    );
  };

  const handleOpenDashboardModal = () => setDashboardModalOpen(true);
  const handleCloseDashboardModal = () => setDashboardModalOpen(false);

  const handleUserSearchChange = (query) => {};

  return (
    <Box
      sx={{
        maxWidth: "800px",
        margin: "auto",
        color: "var(--primary-text)",
        p: 4,
        my: 4,
      }}
    >
      <Button
        variant="link"
        href="/all-events"
        sx={{ mb: 2, color: "var(--primary-text)", p: 0 }}
      >
        Go to All Events
      </Button>

      <Typography
        variant="h3"
        sx={{
          fontWeight: "600",
          marginBottom: 4,
          color: "var(--accent-color)",
        }}
      >
        {initialEvent ? "Edit Event" : "Create Event"}
      </Typography>

      <Box
        sx={{
          backgroundColor: "var(--secondary-bg)",
          borderRadius: "var(--border-radius)",
          p: 6,
        }}
      >
        <InputField
          label="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Event Date"
            value={eventDate}
            onChange={(newValue) => {
              const today = new Date();
              if (newValue >= today.setHours(0, 0, 0, 0)) {
                setEventDate(newValue);
                setEventTime(null); // Reset time if date changes
              } else {
                alert("Please select a current or future date.");
              }
            }}
            minDate={new Date()} // Prevent selection of past dates
            sx={{
              marginRight: 2,
              "& .MuiInputBase-root": {
                color: "var(--primary-text)",
                borderRadius: "var(--border-radius)",
                backgroundColor: "var(--primary-bg)",
              },
              "& .MuiFormLabel-root": {
                color: "var(--primary-text)",
              },
              "& .MuiOutlinedInput-root": {
                color: "var(--primary-text)",
                "& fieldset": {
                  color: "var(--primary-text)",
                  borderColor: "var(--border)",
                },
                "&:hover fieldset": {
                  borderColor: "var(--secondary-bg)",
                  color: "var(--primary-text)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--secondary-bg) !important",
                  color: "var(--primary-text)",
                  borderWidth: "2px",
                },
              },
              "& .MuiButtonBase-root": {
                color: "var(--primary-text)",
              },
            }}
            PopperProps={{
              modifiers: [
                {
                  name: "offset",
                  options: {
                    offset: [0, 8],
                  },
                },
              ],
              sx: {
                "& .MuiPaper-root": {
                  backgroundColor: "var(--primary-bg)",
                  color: "var(--primary-text)",
                },
              },
            }}
          />
          <MobileTimePicker
            label="Event Time"
            value={eventTime}
            onChange={(newValue) => {
              const selectedDate = eventDate;
              const today = new Date();

              // Only validate time if the selected date is today
              if (
                selectedDate &&
                selectedDate.toDateString() === today.toDateString()
              ) {
                if (newValue && newValue > today) {
                  setEventTime(newValue);
                } else {
                  alert("Please select a time in the future.");
                }
              } else {
                setEventTime(newValue); // No restrictions for future dates
              }
            }}
            sx={{
              marginRight: 2,
              "& .MuiInputBase-root": {
                color: "var(--primary-text)",
                borderRadius: "var(--border-radius)",
                backgroundColor: "var(--primary-bg)",
              },
              "& .MuiFormLabel-root": {
                color: "var(--primary-text)",
              },
              "& .MuiOutlinedInput-root": {
                color: "var(--primary-text)",
                "& fieldset": {
                  color: "var(--primary-text)",
                  borderColor: "var(--border)",
                },
                "&:hover fieldset": {
                  borderColor: "var(--secondary-bg)",
                  color: "var(--primary-text)",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "var(--secondary-bg) !important",
                  color: "var(--primary-text)",
                  borderWidth: "2px",
                },
              },
              "& .MuiButtonBase-root": {
                color: "var(--primary-text)",
              },
            }}
          />
        </LocalizationProvider>

        {/* Invite Friends Section */}
        <Box mt={4} sx={{ marginBottom: 4 }}>
          <Box display="flex" alignItems="center" mt={2}>
            <Box display="flex" alignItems="center">
              <Typography variant="h5" mr={2}>
                Invite Friends
              </Typography>
            </Box>
            <OutlineButton
              text="Add Email ID"
              onClick={handleInviteClick}
              width="25%"
              margin="0.5rem"
            />
            <OutlineButton
              text="Choose Friends"
              onClick={handleOpenModal}
              width="25%"
            />
          </Box>

          {/* Display List of Invitees */}
          {invitees.length > 0 && (
            <Box
              sx={{
                display: "flex", // Arrange items horizontally
                flexWrap: "wrap", // Wrap items if they exceed container width
                gap: 2, // Add spacing between items
                overflowX: "auto", // Enable horizontal scrolling if needed
              }}
            >
              {fetchedInvitees.length > 0 && (
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    overflowX: "auto",
                  }}
                >
                  {fetchedInvitees.map((user) => (
                    <UserCard
                      key={user.UID}
                      username={user.username}
                      email={user.email}
                      onRemove={() => handleRemoveInvitee(user.UID)}
                      showDeleteIcon={true} // Show delete icon only if it's not an edit mode
                    />
                  ))}
                </Box>
              )}
            </Box>
          )}

          {showInviteInput && (
            <Box display="flex" alignItems="center" mt={2}>
              <InputField
                label="Enter Email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
              <IconButton
                sx={{ color: "var(--accent-color)", mb: 3 }}
                onClick={handleAddInvitee}
              >
                <AddIcon />
              </IconButton>
            </Box>
          )}

          {userNotFound && (
            <Typography color="error" variant="body2">
              {invitees.includes(inviteEmail)
                ? "User is already added."
                : "User does not exist."}
            </Typography>
          )}
        </Box>

        {/* Movie Selection */}
        <Box sx={{ display: "flex", mb: 2 }}>
          <Typography variant="h5" sx={{ marginBottom: 2, mr: 4 }}>
            Add Movies to Vote On
          </Typography>
          <OutlineButton
            text="Choose Movies"
            onClick={handleOpenDashboardModal}
            width="25%"
            padding="0"
          />
        </Box>

        {selectedMovies.length > 0 && (
          <Box
            sx={{
              display: "flex", // Display items in a row
              flexWrap: "wrap", // Wrap items to the next row if they exceed container width
              gap: 2, // Space between items
              overflowX: "auto", // Enable horizontal scrolling if needed
            }}
          >
            {selectedMovies.map((movie) => (
              <Box key={movie.tmdb_id} sx={{ width: "10rem" }}>
                <MovieCardSelected
                  id={movie.tmdb_id}
                  title={movie.title}
                  image={movie.poster}
                  onRemove={handleRemoveMovie} // Ensure this prop is passed correctly
                />
              </Box>
            ))}
          </Box>
        )}

        {/* Create Event Button */}
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <AccentButton
            text={initialEvent ? "Edit Event" : "Create Event"}
            onClick={initialEvent ? handleSave : handleCreateEvent}
            padding="12px 24px"
            sx={{
              backgroundColor: "#C08081",
              ":hover": { backgroundColor: "#C08081" },
            }} // Customize the background color
          />
        </Box>
      </Box>

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            p: 4,
            backgroundColor: "var(--primary-bg)",
            borderRadius: "8px",
            maxWidth: 700,
            width: "90%", // To make it responsive
            maxHeight: "70vh", // Limit height to viewport height
            overflowY: "auto", // Enable vertical scrolling
            mx: "auto",
            my: "5%", // Center vertically on the page
          }}
        >
          <Typography
            variant="h4"
            sx={{ mb: 2, color: "var(--highlight-color)" }}
          >
            Select your friends
          </Typography>
          <SearchField onSearchChange={handleUserSearchChange} />
          <List sx={{ overflowX: "auto" }}>
            {allUsers.length === 0 ? (
              <Typography>No friends found</Typography>
            ) : (
              allUsers
                .reduce((rows, user, index) => {
                  if (index % 4 === 0) rows.push([]); // Adjust for 4 items per row
                  rows[rows.length - 1].push(user);
                  return rows;
                }, [])
                .map((row, rowIndex) => (
                  <Grid
                    container
                    key={rowIndex}
                    spacing={2}
                    sx={{ mb: 2, display: "flex", justifyContent: "center" }}
                  >
                    {row.map((user, index) => {
                      const isInvited = invitees.some(
                        (invitee) => invitee.email === user.email
                      );
                      return (
                        <Grid item xs={6} sm={3} key={index}>
                          <Box
                            onClick={() => handleSelectUser(user)}
                            sx={{
                              cursor: "pointer",
                              backgroundColor: isInvited
                                ? "var(--selected-bg)"
                                : "var(--primary-bg)",
                              "&:hover": {
                                backgroundColor: "var(--secondary-bg)",
                                transform: "scale(1.03)",
                              },
                              borderRadius: "12px",
                              overflow: "hidden",
                              boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                              transition: "transform 0.2s",
                            }}
                          >
                            <UserCard
                              username={user.username}
                              email={user.email}
                            />
                          </Box>
                        </Grid>
                      );
                    })}
                  </Grid>
                ))
            )}
          </List>
        </Box>
      </Modal>

      <Modal
        open={dashboardModalOpen}
        onClose={handleCloseDashboardModal}
        sx={{ overflowY: "auto", maxHeight: "700px" }}
        aria-labelledby="movie-selection-modal-title" // Use aria-labelledby for accessibility
        aria-describedby="movie-selection-modal-description" // Describe modal content
      >
        <Box
          sx={{
            p: 4,
            backgroundColor: "var(--primary-bg)", // Customize background color
            borderRadius: "8px",
            maxWidth: "1200px", // Adjust width as needed
            mx: "auto",
            mt: "10%", // Center vertically on the page
            color: "var(--primary-text)", // Customize text color
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography
              variant="h4"
              sx={{ mb: 2, color: "var(--highlight-color)" }}
            >
              Movie Selection
            </Typography>
            <AccentButton
              text="Add Movies"
              onClick={handleCloseDashboardModal}
              width="30%"
            />
          </Box>

          {/* Render the Dashboard component here */}
          <Dashboard
            mode="choose-movies"
            onSelectMovie={handleSelectMovie}
            selectedMovies={selectedMovies}
          />
        </Box>
      </Modal>

      {/* Snackbar for Event Creation Feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="success"
          sx={{ width: "100%" }}
        >
          Event {initialEvent ? " saved " : " created "} successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default EventForm;

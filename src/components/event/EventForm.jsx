import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  List,
  ListItem,
  ListItemText,
  Modal,
} from "@mui/material";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { db, auth } from "../../../firebaseConfig";
import InputField from "../form/InputField";
import AccentButton from "../form/accentButton";
import OutlineButton from "../form/outlineButton";
import AddIcon from "@mui/icons-material/Add";
import {
  DatePicker,
  TimePicker,
  MobileTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Dashboard from "../dashboard/Dashboard";

const EventForm = () => {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState(null);
  const [eventTime, setEventTime] = useState(null);
  const [selectedMovies, setSelectedMovies] = useState([]);
  const [invitees, setInvitees] = useState([]);
  const [showInviteInput, setShowInviteInput] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [userNotFound, setUserNotFound] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [dashboardModalOpen, setDashboardModalOpen] = useState(false);

  const availableMovies = [
    { title: "The Matrix", tmdb_id: "603", year: 1999 },
    { title: "Inception", tmdb_id: "27205", year: 2010 },
    { title: "Interstellar", tmdb_id: "157336", year: 2014 },
  ];

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
        .filter((user) => !invitees.includes(user.email)); // Filter out already invited users
      setAllUsers(users);
    } catch (error) {
      console.error("Error retrieving users:", error);
    }
  };

  useEffect(() => {
    retrieveAllUsers();
  }, [invitees]); // Refresh the user list when invitees changes

  const handleSelectMovie = (movie) => {
    if (
      !selectedMovies.some((selected) => selected.tmdb_id === movie.tmdb_id)
    ) {
      setSelectedMovies((prev) => [
        ...prev,
        { title: movie.title, tmdb_id: movie.tmdb_id },
      ]);
    }
  };

  const handleCreateEvent = async () => {
    const creatorId = auth.currentUser?.uid;
    if (!creatorId || !eventName || !eventDate || !eventTime) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      // Format date and time separately
      const formattedDate = eventDate.toLocaleDateString("en-US"); // Adjust locale as needed
      const formattedTime = eventTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Retrieve UIDs for invitees and save the event
      const inviteesWithUIDs = await Promise.all(
        invitees.map(async (email) => {
          const usersRef = collection(db, "users");
          const userQuery = query(usersRef, where("email", "==", email));
          const querySnapshot = await getDocs(userQuery);

          if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            return { email, uid: userData.UID };
          } else {
            console.warn(`UID not found for invitee: ${email}`);
            return null;
          }
        })
      );

      const validInvitees = inviteesWithUIDs.filter(
        (invitee) => invitee !== null
      );

      const eventRef = await addDoc(collection(db, "events"), {
        creator: creatorId,
        date: formattedDate, // Store formatted date
        time: formattedTime, // Store formatted time
        event_name: eventName,
        invitees: validInvitees,
        movies: selectedMovies,
        votes: [],
      });

      console.log("Event created with ID: ", eventRef.id);
      setEventName("");
      setEventDate(null);
      setEventTime(null);
      setSelectedMovies([]);
      setInvitees([]);
    } catch (error) {
      console.error("Error creating event: ", error);
    }
  };

  const handleInviteClick = () => {
    setShowInviteInput(!showInviteInput); // Toggles the invite input field
  };
  const handleOpenModal = () => {
    setShowInviteInput(false); // Close the invite input field
    setModalOpen(true); // Opens modal for choosing a friend
  };
  const handleCloseModal = () => setModalOpen(false); // Closes modal
  const handleSelectUser = (email) => {
    setInvitees((prev) => [...prev, email]);
    // setModalOpen(false); // Close modal after selecting a user
  };

  const handleAddInvitee = async () => {
    if (inviteEmail.trim()) {
      // Check if the email is already in the invitees list
      if (invitees.includes(inviteEmail)) {
        setUserNotFound(true);
        return; // Exit the function if the email is already in the list
      }

      try {
        const usersRef = collection(db, "users");
        const userQuery = query(usersRef, where("email", "==", inviteEmail));
        const querySnapshot = await getDocs(userQuery);

        if (!querySnapshot.empty) {
          setInvitees((prev) => [...prev, inviteEmail]);
          setInviteEmail("");
          setUserNotFound(false);
        } else {
          setUserNotFound(true);
        }
      } catch (error) {
        console.error("Error checking email:", error);
        setUserNotFound(true);
      }
    }
  };

  const handleOpenDashboardModal = () => setDashboardModalOpen(true);
  const handleCloseDashboardModal = () => setDashboardModalOpen(false);

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
          color: "var(--accent-color)",
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
                borderColor: "var(--accent-color)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--accent-color) !important",
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
                borderColor: "var(--accent-color)",
              },
              "&.Mui-focused fieldset": {
                borderColor: "var(--accent-color) !important",
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
        <Box display="flex" alignItems="center">
          <Typography variant="h5">Invite Friends</Typography>
        </Box>

        <Box display="flex" alignItems="center" mt={2}>
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
          <List>
            {invitees.map((email, index) => (
              <ListItem key={index}>
                Invitee {index + 1}: &nbsp;
                <ListItemText
                  primary={email}
                  sx={{ color: "var(--primary-text)" }}
                />
              </ListItem>
            ))}
          </List>
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

      <Modal open={modalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            p: 4,
            backgroundColor: "var(--primary-bg)",
            borderRadius: "8px",
            maxWidth: 400,
            mx: "auto",
            mt: "10%",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Select a Friend
          </Typography>
          <List>
            {allUsers.length === 0
              ? "No friends found"
              : allUsers.map((user, index) => (
                  <ListItem
                    button="true"
                    key={index}
                    onClick={() => handleSelectUser(user.email)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: "var(--secondary-bg)", // Highlight color on hover
                      },
                    }}
                  >
                    <ListItemText
                      sx={{ color: "var(--primary-text)" }}
                      primary={user.username}
                    />
                    <Typography
                      variant="body2"
                      sx={{ color: "var(--secondary-text)" }}
                    >
                      {" "}
                      {user.email}
                    </Typography>
                  </ListItem>
                ))}
          </List>
        </Box>
      </Modal>

      {/* Movie Selection */}
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Add Movies to Vote On
      </Typography>
      {/* <Grid container spacing={2}>
        {availableMovies.map((movie) => (
          <Grid item xs={6} sm={3} key={movie.tmdb_id}>
            <Box
              onClick={() => handleSelectMovie(movie)}
              sx={{
                cursor: "pointer",
                p: 1,
                border: "1px solid var(--border)",
                borderRadius: "var(--border-radius)",
                backgroundColor: selectedMovies.some(
                  (selected) => selected.tmdb_id === movie.tmdb_id
                )
                  ? "var(--accent-color)"
                  : "transparent",
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
      </Grid> */}
      <OutlineButton
        text="Choose Movies"
        onClick={handleOpenDashboardModal}
        width="25%"
      />

      <Modal open={dashboardModalOpen} onClose={handleCloseDashboardModal} sx={{overflowY: "auto", maxHeight: "600px"}}>
        <Box
          sx={{
            p: 4,
            backgroundColor: "var(--primary-bg)", // Customize background color
            borderRadius: "8px",
            maxWidth: "1200px", // Adjust width as needed
            mx: "auto",
            mt: "5%", // Center vertically on the page
            color: "var(--primary-text)", // Customize text color
          }}
        >
          <Typography variant="h6" sx={{ mb: 2 }}>
            Movie Selection
          </Typography>
          {/* Render the Dashboard component here */}
          <Dashboard />
        </Box>
      </Modal>

      {/* Create Event Button */}
      <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
        <AccentButton
          text="Create Event"
          onClick={handleCreateEvent}
          padding="12px 24px"
          sx={{ backgroundColor: "#C08081", ":hover": { backgroundColor: "#C08081" } }} // Customize the background color

        />
      </Box>
    </Box>
  );
};

export default EventForm;

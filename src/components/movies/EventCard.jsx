import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Grid,
  Box,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AccentButton from "../form/AccentButton";
import { fetchUserByUID } from "../../services/usersService";
import { db, auth } from "../../../firebaseConfig";

const EventCard = ({ event, handleVote, handleEdit }) => {
  const [inviteeDetails, setInviteeDetails] = useState([]);
  const [creatorDetails, setCreatorDetails] = useState({});

  const currentUserId = auth.currentUser?.uid;

  useEffect(() => {
    const fetchInviteeDetails = async () => {
      const details = await Promise.all(
        event.invitees.map(async (inviteeUID) => {
          const userData = await fetchUserByUID(inviteeUID);
          return { uid: inviteeUID, ...userData };
        })
      );
      setInviteeDetails(details);
    };
    const fetchCreatorDetails = async () => {
      const creatorData = await fetchUserByUID(event.creator);
      setCreatorDetails(creatorData);
    };

    fetchInviteeDetails();
    fetchCreatorDetails();
  }, [event]);

  return (
    <Card
      sx={{
        backgroundColor: "var(--secondary-bg)",
        color: "var(--primary-text)",
        borderRadius: "var(--border-radius)",
        overflow: "hidden",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h5" gutterBottom sx={{ fontWeight: "600" }}>
            {event.event_name}
          </Typography>
          {currentUserId === event.creator ? (
            <>
              <IconButton
                onClick={() => handleEdit(event)}
                sx={{ color: "var(--accent-color)" }}
              >
                <EditIcon />
              </IconButton>
            </>
          ) : null}
        </Box>
        <Typography variant="body2" sx={{ color: "var(--secondary-text)" }}>
          Date: {event.date}
        </Typography>
        <Typography variant="body2" sx={{ color: "var(--secondary-text)" }}>
          Time: {event.time}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "var(--secondary-text)", mt: 1 }}
        >
          Created by: {creatorDetails?.username}
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "var(--secondary-text)", mt: 1 }}
        >
          Invitees:{" "}
          {inviteeDetails?.map((invitee) => invitee.username).join(", ")}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" gutterBottom>
            Movies
          </Typography>
          <AccentButton
            text={"Vote"}
            width="25%"
            marginBottom="1rem"
            marginTop="0.4rem"
            padding="2px"
            onClick={() => handleVote(event)}
          />
        </Box>
        <Grid container>
          {event.movies?.map((movie) => (
            <Grid
              item
              xs={3.5}
              key={movie.tmdb_id}
              sx={{
                borderRadius: 2,
                border: "1px solid var(--border-color)",
                backgroundColor: "var(--card-bg)",
                mx: 0.5,
                mt: 1,
                "&.MuiGrid-item": {
                  padding: 0,
                },
              }}
            >
              <CardMedia
                component="img"
                height="50"
                image={movie.poster.replace(
                  "https://image.tmdb.org/t/p/w500https://image.tmdb.org/t/p/w500",
                  "https://image.tmdb.org/t/p/w500"
                )}
                alt={movie.title}
              />
              <Typography
                variant="caption"
                display="block"
                align="center"
                sx={{ fontSize: "9px", m: 1 }}
              >
                {movie.title}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Card>
  );
};

export default EventCard;

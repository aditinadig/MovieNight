import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  CardMedia,
  Grid,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AccentButton from "../form/AccentButton";
import OutlineButton from "../form/OutlineButton";
import { fetchUserByUID } from "../../services/usersService";
import { db, auth } from "../../../firebaseConfig";
import { doc, getDoc, setDoc } from "firebase/firestore";

const EventCard = ({ event, handleVote, handleEdit }) => {
  const [inviteeDetails, setInviteeDetails] = useState([]);
  const [creatorDetails, setCreatorDetails] = useState({});
  const [isBingoGameActive, setIsBingoGameActive] = useState(false);

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

    const checkBingoGameStatus = async () => {
      const gameDoc = await getDoc(doc(db, "games", event.id));
      setIsBingoGameActive(gameDoc.exists());
    };

    fetchInviteeDetails();
    fetchCreatorDetails();
    checkBingoGameStatus();
  }, [event]);

  const handleBingoGame = async () => {
    const gameRef = doc(db, "games", event.id);
    const gameDoc = await getDoc(gameRef);

    if (!gameDoc.exists()) {
      const bingoCard = generateBingoCard(event.movies);
      await setDoc(gameRef, {
        event_id: event.id,
        invitees: event.invitees,
        bingo_card: bingoCard,
        active_players: [],
        game_status: "active",
        created_at: new Date().toISOString(),
      });
    }

    window.location.href = `/bingo-game?eventId=${event.id}`;
  };

  const generateBingoCard = (movies) => {
    const tasks = movies.map((movie) => `Spot something from ${movie.title}`);
    const genericTasks = [
      "Spot a character wearing a hat",
      "Hear a famous movie quote",
      "See someone running",
      "Notice a red car",
    ];
    const allTasks = [...tasks, ...genericTasks];
    return shuffleArray(allTasks).slice(0, 25);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

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
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h5"
            gutterBottom
            sx={{
              fontWeight: "600",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {event.event_name}
          </Typography>
          {currentUserId === event.creator ? (
            <Tooltip title="Edit Event">
              <IconButton
                onClick={() => handleEdit(event)}
                sx={{ color: "var(--primary-text)" }}
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
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
          sx={{
            color: "var(--secondary-text)",
            mt: 1,
          }}
        >
          Created by: {creatorDetails?.username || "Loading..."}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "var(--secondary-text)",
            mt: 1,
          }}
        >
          Invitees:{" "}
          {inviteeDetails.length
            ? inviteeDetails.map((invitee) => invitee.username).join(", ")
            : "Loading..."}
        </Typography>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h6" gutterBottom>
            Movies
          </Typography>
          <OutlineButton
            text="Vote"
            width="25%"
            marginBottom="2rem"
            marginTop="0.2rem"
            padding="3px 12px"
            onClick={() => handleVote(event)}
          />
        </Box>
        <Grid container spacing={1}>
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
                textAlign: "center",
                "&.MuiGrid-item": {
                  padding: 0,
                },
                "&:hover": {
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
                },
              }}
            >
              <CardMedia
                component="img"
                height="70"
                image={movie.poster.replace(
                  "https://image.tmdb.org/t/p/w500https://image.tmdb.org/t/p/w500",
                  "https://image.tmdb.org/t/p/w500"
                )}
                alt={movie.title}
                sx={{ borderRadius: "4px 4px 0 0" }}
              />
              <Typography
                variant="caption"
                display="block"
                sx={{
                  fontSize: "10px",
                  color: "var(--secondary-text)",
                  mt: 1,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {movie.title}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ p: 2, textAlign: "center" }}>
        <AccentButton
          text={isBingoGameActive ? "Join Bingo Game" : "Start Bingo Game"}
          width="100%"
          marginBottom="1rem"
          padding="10px"
          onClick={handleBingoGame}
        />
      </Box>
    </Card>
  );
};

export default EventCard;
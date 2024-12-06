import React, { useState, useEffect } from "react";
import { Box, Modal, TextField, Button, Typography } from "@mui/material";
import { db, auth } from "../../../firebaseConfig";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import BingoGrid from "./BingoGrid";
import PlayerProgress from "./PlayerProgress.jsx";
import { onAuthStateChanged } from "firebase/auth";
import { fetchUserByUID } from "../../services/usersService";
import genericTasks from "./bingoTasks.js";

const BingoBoard = () => {
  const [bingoCard, setBingoCard] = useState([]);
  const [markedTiles, setMarkedTiles] = useState([]);
  const [gameStatus, setGameStatus] = useState("active");
  const [eventId, setEventId] = useState(null);
  const [playersProgress, setPlayersProgress] = useState({});
  const [playerNames, setPlayerNames] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [anonymousUsername, setAnonymousUsername] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const eventIdFromURL = queryParams.get("eventId");
    setEventId(eventIdFromURL);

    console.log("Fetching game data for Event ID:", eventIdFromURL);

    // Listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
        setCurrentUser(user.uid);
        setShowModal(false);
      } else {
        setIsLoggedIn(false);
        window.location.href = "/login";
      }
    });

    if (eventIdFromURL) {
      const shuffledTasks = shuffleArray([...genericTasks]).slice(0, 25);
      setBingoCard(shuffledTasks);

      const gameRef = doc(db, "games", eventIdFromURL);

      const unsubscribeGame = onSnapshot(gameRef, (docSnap) => {
        if (docSnap.exists()) {
          const gameData = docSnap.data();
          console.log("Game Data:", gameData);

          const userId = currentUser || anonymousUsername;

          if (userId) {
            setMarkedTiles(gameData.active_players[userId]?.marked_tiles || []);
          }

          setPlayersProgress(gameData.active_players || {});
          setGameStatus(gameData.game_status);

          fetchPlayerNames(Object.keys(gameData.active_players));
        } else {
          console.warn(
            "Game document does not exist for Event ID:",
            eventIdFromURL
          );
        }
      });

      return () => {
        unsubscribeAuth();
        unsubscribeGame();
      };
    }
  }, [currentUser, anonymousUsername]);

  const fetchPlayerNames = async (playerIds) => {
    const names = { ...playerNames };
    await Promise.all(
      playerIds.map(async (playerId) => {
        if (!names[playerId]) {
          const user = playerId.startsWith("anon-")
            ? null // Skip fetching for anonymous users
            : await fetchUserByUID(playerId);
          names[playerId] = user?.username || playerId; // Use playerId for anonymous users
        }
      })
    );
    setPlayerNames(names);
  };

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleStartAsAnonymous = async () => {
    if (!anonymousUsername.trim()) return;

    const uniqueUsername = `anon-${Date.now()}-${anonymousUsername}`;
    setAnonymousUsername(uniqueUsername);

    const gameRef = doc(db, "games", eventId);

    // Add anonymous user to Firestore game data
    await updateDoc(gameRef, {
      [`active_players.${uniqueUsername}`]: { marked_tiles: [] },
    });

    console.log(`Anonymous user initialized: ${uniqueUsername}`);
    setShowModal(false);
  };

  return (
    <>
      <Button
        variant="link"
        href="/all-events"
        sx={{ mb: 2, color: "var(--primary-text)", p: 0 }}
      >
        Go to All Events
      </Button>

      {/* Main Bingo Board Layout */}
      <Box
        className="fade-in"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 4,
          gap: 4,
          minHeight: "100vh",
          background: "linear-gradient(to bottom, #1c1c1c, #121212)",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            textAlign: "center",
            mb: 4,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "var(--border-radius)",
            p: 3,
            width: "100%",
            maxWidth: "800px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
          }}
        >
          <Typography
            variant="h2"
            sx={{
              color: "var(--accent-color)",
              fontWeight: 700,
            }}
          >
            Bingo Scavenger Hunt
          </Typography>
          <Typography
            variant="subtitle1"
            sx={{
              color: "var(--secondary-text)",
              mt: 1,
            }}
          >
            Complete tasks and mark your progress. Let’s see who wins!
          </Typography>
        </Box>

        {/* Game Area */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 3,
            flexWrap: "wrap",
            justifyContent: "center",
            width: "100%",
            maxWidth: "1200px",
          }}
        >
          {/* Bingo Grid */}
          <BingoGrid
            bingoCard={bingoCard}
            markedTiles={markedTiles}
            setMarkedTiles={setMarkedTiles}
            gameStatus={gameStatus}
            eventId={eventId}
            playersProgress={playersProgress} // Pass playersProgress here
            playerNames={playerNames}
          />

          {/* Player Progress */}
          <PlayerProgress
            playersProgress={playersProgress}
            playerNames={playerNames}
            bingoCard={bingoCard}
          />
        </Box>
      </Box>
    </>
  );
};

export default BingoBoard;

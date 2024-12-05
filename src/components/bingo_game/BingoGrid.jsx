import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, Modal } from "@mui/material";
import { db, auth } from "../../../firebaseConfig";
import { doc, updateDoc, onSnapshot } from "firebase/firestore";

const BingoGrid = ({
  bingoCard,
  markedTiles,
  setMarkedTiles,
  gameStatus,
  eventId,
  playersProgress,
  playerNames,
}) => {
  const [winnerId, setWinnerId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [winnerMessage, setWinnerMessage] = useState("");

  useEffect(() => {
    if (!eventId) return;

    // Listen for updates in game data
    const gameRef = doc(db, "games", eventId);
    const unsubscribe = onSnapshot(gameRef, (docSnap) => {
      const gameData = docSnap.data();
      if (gameData) {
        setWinnerId(gameData.winner || null);
        if (gameData.game_status === "completed" && gameData.winner) {
          handleNotification(gameData.winner);
        }
      }
    });

    return () => unsubscribe();
  }, [eventId]);

  const handleNotification = (winnerId) => {
    const currentUserId = auth.currentUser?.uid;

    if (currentUserId === winnerId) {
      // Winner notification
      setWinnerMessage("Congratulations! You are the winner!");
    } else {
      // Non-winner notification
      setWinnerMessage(
        `Better luck next time!`
      );
    }
    setModalOpen(true); // Open the modal for all users
  };

  const handleTileClick = async (index) => {
    if (gameStatus !== "active") return;

    const updatedTiles = [...markedTiles];
    if (updatedTiles.includes(index)) {
      updatedTiles.splice(updatedTiles.indexOf(index), 1);
    } else {
      updatedTiles.push(index);
    }

    setMarkedTiles(updatedTiles);

    if (eventId) {
      const gameRef = doc(db, "games", eventId);
      const userId = auth.currentUser?.uid;

      await updateDoc(gameRef, {
        [`active_players.${userId}.marked_tiles`]: updatedTiles,
      });
    }
  };

  const handleDeclareWinner = async () => {
    if (!eventId || !playersProgress) return;

    // Determine the winner based on the highest score
    const sortedPlayers = Object.keys(playersProgress).sort(
      (a, b) =>
        (playersProgress[b].marked_tiles?.length || 0) -
        (playersProgress[a].marked_tiles?.length || 0)
    );

    const winner = sortedPlayers[0]; // First player is the winner

    // Update Firestore game status and declare the winner
    const gameRef = doc(db, "games", eventId);
    await updateDoc(gameRef, {
      game_status: "completed",
      winner: winner,
    });

    // Firestore onSnapshot will handle notification updates for all players
  };

  const isTileMarked = (index) => markedTiles.includes(index);

  return (
    <Box
      className="fade-in"
      sx={{
        flex: 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        padding: 4,
        bgcolor: "var(--secondary-bg)",
        borderRadius: "var(--border-radius)",
        boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
        width: "100%",
        maxWidth: "650px",
      }}
    >
      <Typography
        variant="subtitle1"
        sx={{
          color: "var(--secondary-text)",
          textAlign: "center",
          mb: 2,
        }}
      >
        {gameStatus === "active"
          ? "Mark items as you spot them! When you're done, declare the winner!"
          : "Game over! Check your results!"}
      </Typography>

      <Grid
        container
        spacing={1.5}
        sx={{
          maxWidth: "100%",
          aspectRatio: "1 / 1",
          userSelect: "none",
          display: "grid",
          gridTemplateColumns: "repeat(5, 1fr)",
          gap: "10px",
        }}
      >
        {bingoCard.map((task, index) => (
          <Box
            key={index}
            onClick={() => handleTileClick(index)}
            sx={{
              backgroundColor: isTileMarked(index)
                ? "var(--accent-color)"
                : "var(--card-bg)",
              color: isTileMarked(index) ? "#fff" : "var(--primary-text)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "var(--border-radius)",
              border: "2px solid var(--border)",
              textAlign: "center",
              cursor: "pointer",
              fontSize: "1rem",
              fontWeight: 500,
              padding: "15px",
              transition: "all 0.3s ease-in-out",
              "&:hover": {
                backgroundColor: isTileMarked(index)
                  ? "var(--highlight-color)"
                  : "rgba(255, 255, 255, 0.1)",
                transform: "scale(1.05)",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
              },
              textShadow: isTileMarked(index)
                ? "0 1px 3px rgba(0, 0, 0, 0.4)"
                : "none",
            }}
          >
            {task}
          </Box>
        ))}
      </Grid>

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDeclareWinner}
          disabled={gameStatus !== "active"}
          sx={{
            bgcolor: "var(--accent-color)",
            color: "var(--primary-bg)",
            fontWeight: 600,
            borderRadius: "var(--border-radius)",
            py: 1.5,
            px: 3,
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              bgcolor: "var(--highlight-color)",
              transform: "translateY(-2px)",
            },
            "&:disabled": {
              bgcolor: "var(--disabled)",
              color: "rgba(255, 255, 255, 0.5)",
              cursor: "not-allowed",
              boxShadow: "none",
            },
          }}
        >
          Declare Winner
        </Button>
      </Box>

      {/* Modal for Winner Notification */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          bgcolor: "rgba(0, 0, 0, 0.8)",
        }}
      >
        <Box
          sx={{
            bgcolor: "var(--secondary-bg)",
            borderRadius: "var(--border-radius)",
            boxShadow: "0 6px 12px rgba(0, 0, 0, 0.4)",
            p: 4,
            textAlign: "center",
            maxWidth: "400px",
            width: "80%",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              color: "var(--highlight-color)",
              fontWeight: 700,
              mb: 2,
            }}
          >
            {winnerId && playerNames[winnerId]
              ? `Winner: ${playerNames[winnerId]}`
              : "Game Completed"}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: "var(--primary-text)",
              mb: 3,
            }}
          >
            {winnerMessage}
          </Typography>
          <Button
            variant="contained"
            onClick={() => setModalOpen(false)}
            sx={{
              bgcolor: "var(--accent-color)",
              color: "var(--primary-bg)",
              fontWeight: 600,
              borderRadius: "var(--border-radius)",
              "&:hover": {
                bgcolor: "var(--highlight-color)",
              },
            }}
          >
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default BingoGrid;
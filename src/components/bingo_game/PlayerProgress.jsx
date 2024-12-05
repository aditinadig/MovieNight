import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import {
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  LinearProgress,
  Paper,
  Avatar,
  Chip,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents"; // Winner Icon

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

const PlayerProgress = ({ playersProgress, playerNames, bingoCard }) => {
  const getPlayerProgress = (playerId) => {
    const playerTiles = playersProgress[playerId]?.marked_tiles || [];
    return playerTiles.length;
  };

  const sortedPlayerIds = Object.keys(playersProgress).sort(
    (a, b) => getPlayerProgress(b) - getPlayerProgress(a)
  );

  const maxTasks = bingoCard.length;

  const graphData = {
    labels: sortedPlayerIds.map(
      (playerId) => playerNames[playerId] || "Unknown"
    ),
    datasets: [
      {
        label: "Tasks Completed",
        data: sortedPlayerIds.map((playerId) => getPlayerProgress(playerId)),
        backgroundColor: "rgba(75, 192, 192, 0.8)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        borderRadius: 15,
        hoverBackgroundColor: "rgba(255, 159, 64, 0.9)",
      },
    ],
  };

  const graphOptions = {
    responsive: true,
    plugins: {
      tooltip: {
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} tasks completed`,
        },
        backgroundColor: "rgba(33, 33, 33, 0.9)",
        titleFont: {
          size: 16,
          family: "Lexend Deca",
          color: "rgba(255, 255, 255, 0.9)",
        },
        bodyFont: {
          size: 14,
          family: "Lexend Deca",
          color: "rgba(255, 255, 255, 0.8)",
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            size: 12,
            family: "Lexend Deca",
          },
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.8)",
          font: {
            size: 12,
            family: "Lexend Deca",
          },
        },
      },
    },
    animation: {
      duration: 1200,
      easing: "easeInOutCubic",
    },
  };

  return (
    <Box
      sx={{
        flex: 1,
        backgroundColor: "var(--card-bg)",
        borderRadius: "var(--border-radius)",
        p: 3,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.4)",
        overflowY: "auto",
      }}
    >
      <Typography
        variant="h5"
        sx={{
          color: "var(--highlight-color)",
          fontWeight: 700,
          textAlign: "center",
          mb: 2,
        }}
      >
        Leaderboard
      </Typography>
      <Paper
        sx={{
          p: 2,
          backgroundColor: "var(--secondary-bg)",
          borderRadius: "var(--border-radius)",
          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
          textAlign: "center",
          position: "relative",
        }}
      >
        <EmojiEventsIcon
          sx={{
            color: "gold",
            fontSize: 40,
            position: "absolute",
            top: -20,
            left: "calc(50% - 20px)",
          }}
        />
        <Box sx={{ mt: 4 }}>
          <Typography
            variant="body1"
            sx={{
              color: "var(--primary-text)",
              mt: 2,
            }}
          >
            Current Winner:
          </Typography>
          <Chip
            label={playerNames[sortedPlayerIds[0]] || "Unknown User"}
            sx={{
              bgcolor: "var(--highlight-color)",
              color: "var(--primary-bg)",
              fontWeight: 700,
              fontSize: "1rem",
              my: 1,
            }}
          />
          <Typography
            variant="body2"
            sx={{
              color: "var(--secondary-text)",
              fontWeight: 500,
            }}
          >
            with {getPlayerProgress(sortedPlayerIds[0])} tasks completed!
          </Typography>
        </Box>
      </Paper>

      <Divider sx={{ my: 3, borderColor: "rgba(255, 255, 255, 0.1)" }} />

      <Typography
        variant="h5"
        sx={{
          color: "var(--highlight-color)",
          fontWeight: 700,
          textAlign: "center",
          mb: 2,
        }}
      >
        Player Progress
      </Typography>

      <List
        sx={{
          maxHeight: "300px",
          overflowY: "auto",
          padding: 0,
        }}
      >
        {sortedPlayerIds.map((playerId, index) => (
          <ListItem
            key={playerId}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 1,
              mb: 2,
              p: 2,
              borderRadius: "var(--border-radius)",
              backgroundColor: "var(--secondary-bg)",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)",
              },
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor:
                    index === 0
                      ? "gold"
                      : index === 1
                      ? "silver"
                      : index === 2
                      ? "bronze"
                      : "var(--disabled)",
                  color: "var(--primary-bg)",
                  fontWeight: 700,
                }}
              >
                {index + 1}
              </Avatar>
              <Typography
                variant="body1"
                sx={{ color: "var(--primary-text)", fontWeight: 600 }}
              >
                {playerNames[playerId] || "Unknown User"}
              </Typography>
            </Box>
            <Box sx={{ width: "50%" }}>
              <LinearProgress
                variant="determinate"
                value={(getPlayerProgress(playerId) / maxTasks) * 100}
                sx={{
                  height: 8,
                  borderRadius: "var(--border-radius)",
                  bgcolor: "var(--disabled)",
                  "& .MuiLinearProgress-bar": { bgcolor: "var(--accent-color)" },
                }}
              />
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: "var(--secondary-text)",
                fontWeight: 500,
              }}
            >
              {getPlayerProgress(playerId)} / {maxTasks}
            </Typography>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 3, borderColor: "rgba(255, 255, 255, 0.1)" }} />

      <Typography
        variant="h5"
        sx={{
          color: "var(--highlight-color)",
          fontWeight: 700,
          textAlign: "center",
          mb: 2,
        }}
      >
        Progress Graph
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Bar data={graphData} options={graphOptions} />
      </Box>
    </Box>
  );
};

export default PlayerProgress;
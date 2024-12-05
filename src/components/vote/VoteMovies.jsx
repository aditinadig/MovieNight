import React, { useMemo } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const VoteMovies = React.forwardRef((props, ref) => {
  const { selectedEvent, userId, handleMovieVote, handleModalClose } = props;

  const highlightColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--highlight-color")
    .trim();
  const secondaryTextColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--secondary-text")
    .trim();

  const chartData = useMemo(() => {
    const labels = selectedEvent?.movies.map((movie) => movie.title) || [];
    const votes =
      selectedEvent?.movies.map((movie) =>
        movie.votedBy ? movie.votedBy.length : 0
      ) || [];

    const maxVotes = Math.max(...votes);

    return {
      labels,
      datasets: [
        {
          label: "Votes",
          data: votes,
          backgroundColor: votes.map((voteCount) =>
            voteCount === maxVotes ? highlightColor : secondaryTextColor
          ),
          borderColor: highlightColor,
          borderWidth: 2,
          hoverBackgroundColor: "rgba(134, 210, 147, 0.8)",
          hoverBorderColor: "var(--accent-color)",
        },
      ],
    };
  }, [selectedEvent, highlightColor, secondaryTextColor]);

  const primaryTextColor =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--primary-text")
      .trim() || "#ffffff";

  const chartOptions = {
    responsive: true,
    aspectRatio: 3,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "var(--card-bg)",
        titleColor: highlightColor,
        bodyColor: primaryTextColor,
        borderColor: "var(--accent-color)",
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: secondaryTextColor,
          font: {
            family: "Lexend Deca",
            weight: "400",
            size: 10,
          },
          callback: function (value) {
            const label = this.getLabelForValue(value);
            const words = label.split(" ");
            let formattedLabel = [];
            let line = "";

            words.forEach((word) => {
              if ((line + word).length <= 15) {
                line += (line ? " " : "") + word;
              } else {
                formattedLabel.push(line);
                line = word;
              }
            });

            if (line) {
              formattedLabel.push(line);
            }

            return formattedLabel;
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
      },
      y: {
        ticks: {
          color: secondaryTextColor,
          font: {
            family: "Lexend Deca",
            weight: "400",
          },
          stepSize: 1,
          callback: function (value) {
            return Number.isInteger(value) ? value : null;
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        beginAtZero: true,
        suggestedMax: Math.max(...chartData.datasets[0].data) + 1,
      },
    },
  };

  return (
    <Box
      ref={ref}
      tabIndex={0}
      sx={{
        py: 4,
        px: 6,
        backgroundColor: "var(--primary-bg)",
        borderRadius: "12px",
        maxWidth: 700,
        color: "var(--primary-text)",
        width: "90%",
        maxHeight: "70vh",
        overflowY: "auto",
        mx: "auto",
        my: "5%",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "scale(1.01)",
        },
      }}
    >
      <Button
        variant="text"
        onClick={handleModalClose}
        sx={{
          mt: 2,
          color: "var(--secondary-text)",
          "&:hover": { textDecoration: "underline" },
        }}
      >
        Go back
      </Button>
      <Typography variant="h4" component="h2" sx={{ mb: 4 }}>
        Vote for Movies
      </Typography>

      <Bar data={chartData} options={chartOptions} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 2,
          mt: 4,
        }}
      >
        {selectedEvent?.movies.map((movie) => (
          <Button
            key={movie.tmdb_id}
            onClick={() => handleMovieVote(movie.tmdb_id)}
            disabled={movie.votedBy?.includes(userId)}
            sx={{
              borderColor: highlightColor,
              color: highlightColor,
              borderRadius: "16px",
              px: 3,
              py: 1.5,
              textTransform: "none",
              transition: "all 0.2s ease",
              "&:hover": {
                backgroundColor: "var(--highlight-bg)",
                transform: "scale(1.05)",
              },
              "&.Mui-disabled": {
                borderColor: "var(--disabled)",
                color: "var(--disabled)",
              },
            }}
            variant="outlined"
          >
            Vote for {movie.title}
          </Button>
        ))}
      </Box>
    </Box>
  );
});

export default VoteMovies;
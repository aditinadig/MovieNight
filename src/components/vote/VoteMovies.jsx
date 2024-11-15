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

  // Retrieve CSS variable values for colors
  const highlightColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--highlight-color")
    .trim();
  const secondaryTextColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--secondary-text")
    .trim();

  // Prepare data for the chart
  const chartData = useMemo(() => {
    const labels = selectedEvent?.movies.map((movie) => movie.title) || [];
    const votes =
      selectedEvent?.movies.map((movie) =>
        movie.votedBy ? movie.votedBy.length : 0
      ) || [];

    // Determine the maximum vote count
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
          hoverBackgroundColor: "rgba(134, 210, 147, 0.8)", // Accent color with opacity
          hoverBorderColor: "var(--accent-color)",
        },
      ],
    };
  }, [selectedEvent, highlightColor, secondaryTextColor]);

  const primaryTextColor =
    getComputedStyle(document.documentElement)
      .getPropertyValue("--primary-text")
      .trim() || "#ffffff"; // Fallback to white

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
            size: 10, // Adjust text size
          },
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
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
        categoryPercentage: 1.0, // Increase to use more space per category
        barPercentage: 0.5, // Decrease to make bars thinner
      },
      y: {
        ticks: {
          color: secondaryTextColor,
          font: {
            family: "Lexend Deca",
            weight: "400",
          },
          stepSize: 1, // Controls step size on y-axis
          callback: function (value) {
            return Number.isInteger(value) ? value : null;
          },
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        beginAtZero: true,
        min: 0,
        max: Math.max(...chartData.datasets[0].data) + 1, // Adjust for padding above max
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
        px: 8,
        backgroundColor: "var(--primary-bg)",
        borderRadius: "8px",
        maxWidth: 700,
        color: "var(--primary-text)",
        width: "90%", // To make it responsive
        maxHeight: "70vh", // Limit height to viewport height
        overflowY: "auto", // Enable vertical scrolling
        mx: "auto",
        my: "5%", // Center vertically on the page
      }}
    >
      <Button
        variant="link"
        onClick={handleModalClose}
        sx={{ mt: 3, color: "var(--secondary-text)", p: 0 }}
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
          mt: 3,
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
              "&:hover": {
                backgroundColor: "var(--primary-text)",
              },
              "&.Mui-disabled": {
                borderColor: "var(--disabled)",
                color: "var(--disabled)",
              }, // Apply secondary color when disabled
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

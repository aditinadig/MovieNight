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
            size: 10, // Adjust size as needed to fit within block
          },
          callback: function (value) {
            const label = this.getLabelForValue(value);
            const words = label.split(" ");
            let formattedLabel = [];
            let line = "";

            words.forEach((word) => {
              if ((line + word).length <= 15) {
                // Adjust to manage max width
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
          maxRotation: 0,
          minRotation: 0,
          autoSkip: false,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        categoryPercentage: 0.8, // Wider bar area for each category
        barPercentage: 0.9, // Reduce the bar width to leave space for the label
      },
      y: {
        ticks: {
          color: secondaryTextColor,
          font: {
            family: "Lexend Deca",
            weight: "400",
          },
          callback: function (value) {
            return Number.isInteger(value) ? value : null;
          },
          stepSize: 1,
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Box
      ref={ref}
      tabIndex={0}
      sx={{
        p: 4,
        backgroundColor: "var(--primary-bg)",
        borderRadius: "8px",
        maxWidth: 500,
        mx: "auto",
        mt: 4,
        color: "var(--primary-text)",
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

      {/* Bar chart for showing votes */}
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

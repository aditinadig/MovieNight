import { Box, Typography, Button } from "@mui/material";

export default function Hero() {
  return (
    <Box
      sx={{
        borderRadius: "1.5rem",
        display: "flex",
        flexDirection: "column",
        height: "70vh",
        color: "var(--primary-text)",
        overflow: "hidden",
        backgroundImage: `url('src/assets/homepage-hero-background.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        sx={{
          margin: 0,
          height: "100%",
          backgroundColor: "rgba(5, 10, 5, 0.7)",
          padding: "4rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center", // Push content to the bottom
            height: "100%", // Ensure it takes up full height
          }}
        >
          {/* Hero Content */}
          <Typography variant="h2" gutterBottom sx={{ fontWeight: 600 }}>
            A new way to watch your favorite movies
          </Typography>
          <Typography variant="body1" sx={{ maxWidth: "600px", mb: 4 }}>
            Get together with friends, family, or your community and enjoy a
            social movie-watching experience.
          </Typography>
          <Button
            variant="contained"
            sx={{
              backgroundColor: "var(--accent-color)",
              color: "var(--primary-bg)",
              width: "20%",
              borderRadius: "24px",
              fontWeight: 600,
            }}
            size="large"
          >
            Get Started
          </Button>
        </Box>
      </Box>
    </Box>
  );
}

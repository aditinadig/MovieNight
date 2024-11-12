import { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import AccentButton from "../form/AccentButton";
import { auth } from "../../../firebaseConfig"; // Import Firebase auth

export default function Hero(props) {
  const [navigateTo, setNavigateTo] = useState("/signup");

  useEffect(() => {
    // Check for user authentication state
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // If user is logged in, set the navigation to dashboard
        setNavigateTo("/dashboard");
      } else {
        // If no user is logged in, set the navigation to signup
        setNavigateTo("/signup");
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <Box
      sx={{
        borderRadius: "var(--border-radius)",
        display: "flex",
        flexDirection: "column",
        height: "70vh",
        color: "var(--primary-text)",
        overflow: "hidden",
        backgroundImage: `url('src/assets/homepage-hero-background.jpg')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className={props.className}
    >
      <Box
        sx={{
          margin: 0,
          height: "100%",
          backgroundColor: "var(--overlay-bg)",
          padding: "4rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
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

          {/* Conditional navigation based on user authentication */}
          <AccentButton text="Get Started" navigateTo={navigateTo} width="20%" />
        </Box>
      </Box>
    </Box>
  );
}
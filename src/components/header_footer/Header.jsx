import { useState, useEffect } from "react";
import { Button, Stack, Box, Typography, Link } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig"; // Ensure Firebase auth is imported
import AccentButton from "../form/accentButton";
import OutlineButton from "../form/outlineButton";

export default function Header({ activePage }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe(); // Clean up listener on unmount
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Sign out the user
      window.location.href = "/"; // Redirect to home page after logout
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        borderBottom: "0.5px solid var(--border)",
      }}
    >
      {/* Brand Name */}
      <Link
        href="/"
        sx={{ color: "var(--primary-text)", textDecoration: "none" }}
      >
        <Typography variant="h5" component="h1">
          Movie<span style={{ color: "var(--accent-color)" }}>Night</span>
        </Typography>
      </Link>

      <Stack direction="row" spacing={2}>
        {/* Conditionally render based on auth state */}
        {isAuthenticated ? (
          <>
            {/* If authenticated, show Logout button and Dashboard */}
            <AccentButton text="Dashboard" navigateTo="/dashboard" />
            <OutlineButton text="Logout" onClick={handleLogout} />
          </>
        ) : (
          <>
            {activePage === "login" && (
              <OutlineButton text="Signup" navigateTo="/signup" />
            )}
            {activePage === "signup" && (
              <OutlineButton text="Login" navigateTo="/login" />
            )}
            {activePage === "home" && (
              <>
                <AccentButton text="Login" navigateTo="/login" />
                <OutlineButton text="Signup" navigateTo="/signup" />
              </>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
}
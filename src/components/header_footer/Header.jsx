import { useState, useEffect } from "react";
import { Button, Stack, Box, Typography, Link, TextField } from "@mui/material";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebaseConfig"; // Ensure Firebase auth is imported
import AccentButton from "../form/AccentButton";
import OutlineButton from "../form/outlineButton";
import LinkButton from "../form/LinkButton.jsx";
import InputField from "../form/InputField.jsx";
import Cookies from "js-cookie";

export default function Header({ activePage }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const authToken = Cookies.get("authToken");

  // Listen for auth state changes
  useEffect(() => {
    
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      Cookies.remove("authToken"); // Remove the token cookie
      window.location.href = "/";
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

      <Stack direction="row" spacing={1}>
        {/* Conditionally render based on auth state */}
        {authToken ? (
          <>
            {activePage === "dashboard" ? (
              <>
                <LinkButton text="Home" navigateTo="/" />
                <LinkButton text="Create Event" navigateTo="/event" />
                <LinkButton text="Create Playlist" navigateTo="/playlist" />
                <LinkButton text="Profile" navigateTo="/profile" />
                <LinkButton text="Log Out" onClick={handleLogout} />
              </>
            ) : (
              <>
                {/* If authenticated and not on the dashboard, show Dashboard and Logout */}
                <AccentButton text="Dashboard" navigateTo="/dashboard" />
                <OutlineButton text="Logout" onClick={handleLogout} />
              </>
            )}
          </>
        ) : (
          <>
            {/* If not authenticated */}
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

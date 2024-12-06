import { useEffect } from "react";
import { Stack, Box, Typography, Link } from "@mui/material";
import { auth } from "../../../firebaseConfig"; // Ensure Firebase auth is imported
import AccentButton from "../form/AccentButton";
import OutlineButton from "../form/outlineButton";
import LinkButton from "../form/LinkButton.jsx";
import Cookies from "js-cookie";

export default function Header({ activePage }) {
  const authToken = Cookies.get("authToken");

  // Listen for auth state changes
  useEffect(() => {}, []);

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
        <Typography variant="h5" component="h1" sx={{ fontWeight: 500 }}>
          Movie<span style={{ color: "var(--highlight-color)" }}>Night</span>
        </Typography>
      </Link>

      <Stack direction="row" spacing={1}>
        {/* Conditionally render based on auth state */}
        {authToken ? (
          <>
            {activePage === "dashboard" ? (
              <>
                <LinkButton text="Instructions" navigateTo="/instructions" />
                <LinkButton text="Dashboard" navigateTo="/dashboard" />
                <LinkButton text="Events" navigateTo="/all-events" />
                <LinkButton text="Playlists" navigateTo="/all-playlists" />
                <LinkButton text="Log Out" onClick={handleLogout} />
              </>
            ) : (
              <>
                {/* If authenticated and not on the dashboard, show Dashboard and Logout */}
                <LinkButton text="Instructions" navigateTo="/instructions" />
                <AccentButton text="Dashboard" navigateTo="/dashboard" />
                <OutlineButton text="Logout" onClick={handleLogout} />
              </>
            )}
          </>
        ) : (
          <>
            {/* If not authenticated */}
            {activePage === "login" && (
              <>
                <LinkButton text="Instructions" navigateTo="/instructions" />
                <OutlineButton text="Signup" navigateTo="/signup" />
              </>
            )}
            {activePage === "signup" && (
              <>
                <LinkButton text="Instructions" navigateTo="/instructions" />
                <OutlineButton text="Login" navigateTo="/login" />
              </>
            )}
            {activePage === "home" && (
              <>
                <LinkButton text="Instructions" navigateTo="/instructions" />
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

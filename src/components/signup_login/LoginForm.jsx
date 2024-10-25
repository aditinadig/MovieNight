import { useState, useEffect } from "react";
import { Box, Typography, Divider, Link } from "@mui/material";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth"; // Firebase auth function
import { auth } from "../../../firebaseConfig"; // Import the Firebase auth
import InputField from "../form/InputField.jsx";
import OAuthButtons from "../form/OAuthButtons.jsx";
import AccentButton from "../form/accentButton.jsx";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Redirect to homepage if the user is already authenticated
        window.location.href = "/";
      }
    });

    return () => unsubscribe(); // Cleanup auth state listener
  }, []);

  const handleLogin = async () => {
    setLoading(true); // Show loading state while processing
    setError(""); // Clear any previous error

    try {
      // Sign in user with email and password
      if (!email || !password) {
        setError("Please fill in all fields.");
        setLoading(false);
        return;
      }
      
      await signInWithEmailAndPassword(auth, email, password);

      // Clear form fields after successful login
      setEmail("");
      setPassword("");

      // Redirect to dashboard
      window.location.href = "/dashboard"; // or window.location.replace("/dashboard");
    } catch (error) {
      // Log any errors and show an error message
      console.error("Error logging in: ", error);
      setError("Failed to log in. Please check your credentials.");
    } finally {
      setLoading(false); // Stop loading state
    }
  };

  return (
    <Box
      sx={{
        maxWidth: "500px",
        margin: "auto",
      }}
    >
      <Typography
        variant="h4"
        sx={{
          marginBottom: "1.5rem",
          fontWeight: 600,
          color: "var(--primary-text)",
        }}
      >
        Welcome Back!
      </Typography>

      <InputField
        required={true}
        label="Email"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        required={true}
        label="Password"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        marginbottom="0.5rem"
      />

      {error && (
        <Typography
          variant="body2"
          sx={{ color: "var(--accent-color)", marginBottom: "1rem" }}
        >
          {error}
        </Typography>
      )}

      <Box sx={{ textAlign: "right", marginBottom: "1.5rem" }}>
        <Link
          href="/forgot-password"
          underline="hover"
          sx={{
            color: "var(--secondary-text)",
            "&:hover": {
              color: "var(--accent-color)", // Change color on hover
            },
          }}
        >
          <Typography variant="body2">Forgot Password?</Typography>
        </Link>
      </Box>

      <AccentButton
        text="Login"
        padding="12px"
        onClick={handleLogin}
        disabled={loading}
      />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginY: "1.5rem",
        }}
      >
        <Divider sx={{ flexGrow: 1, backgroundColor: "var(--border)" }} />
        <Typography
          variant="body2"
          sx={{
            marginX: "1rem",
            color: "var(--secondary-text)",
            whiteSpace: "nowrap",
          }}
        >
          or log in with
        </Typography>
        <Divider sx={{ flexGrow: 1, backgroundColor: "var(--border)" }} />
      </Box>

      <OAuthButtons />

      <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
        <Typography variant="body2" sx={{ color: "var(--secondary-text)" }}>
          Don’t have an account?{" "}
          <Link
            href="/signup"
            underline="hover"
            sx={{
              color: "var(--accent-color)",
            }}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;

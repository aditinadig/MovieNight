import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Link,
  Divider,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  signInWithEmailAndPassword,
  getIdToken,
} from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import InputField from "../form/InputField.jsx";
import OAuthButtons from "../form/OAuthButtons.jsx";
import AccentButton from "../form/AccentButton.jsx";
import Cookies from "js-cookie";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleCheckboxChange = (event) => {
    setRememberMe(event.target.checked);
  };

  useEffect(() => {
    const authToken = Cookies.get("authToken");

    if (authToken) {
      // Redirect to the dashboard if the auth token is found
      window.location.href = "/dashboard";
    }
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const token = await getIdToken(userCredential.user);

      if (rememberMe) {
        // Persistent cookie with 7-day expiration
        Cookies.set("authToken", token, { expires: 7, sameSite: 'strict' });
      } else {
        // Session-only cookie without expiration
        Cookies.set("authToken", token, { sameSite: 'strict' });
      }

      setEmail("");
      setPassword("");
      window.location.href = "/dashboard";
    } catch (error) {
      setError("Failed to log in. Please check your credentials.");
      console.error("Error logging in: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "500px", margin: "auto" }}>
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
        label="Email"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <InputField
        label="Password"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        marginbottom="0.5rem"
        required
      />

      {error && (
        <Typography
          variant="body2"
          sx={{ color: "var(--accent-color)", marginBottom: "1rem" }}
        >
          {error}
        </Typography>
      )}

      <AccentButton
        text="Login"
        padding="12px"
        onClick={handleLogin}
        disabled={loading}
        marginTop="1rem"
      />

      <FormControlLabel
        control={
          <Checkbox
            checked={rememberMe}
            onChange={handleCheckboxChange}
            sx={{
              color: "var(--secondary-text)", // Unchecked color
              "&.Mui-checked": {
                color: "var(--highlight-color)", // Checked color
              },
            }}
          />
        }
        label="Remember Me"
        sx={{
          color: "var(--primary-text)",
          marginTop: "1rem" 
        }}
      />

      <OAuthButtons />

      <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
        <Typography variant="body2" sx={{ color: "var(--secondary-text)" }}>
          Don’t have an account?{" "}
          <Link
            href="/signup"
            underline="hover"
            sx={{ color: "var(--accent-color)" }}
          >
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
import { useState, useEffect } from "react";
import { Box, Typography, Link } from "@mui/material";
import { createUserWithEmailAndPassword, onAuthStateChanged, getIdToken } from "firebase/auth";
import { auth } from "../../../firebaseConfig";
import InputField from "../form/InputField.jsx";
import OAuthButtons from "../form/OAuthButtons.jsx";
import AccentButton from "../form/accentButton.jsx";
import Cookies from "js-cookie";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const authToken = Cookies.get("authToken");

    if (authToken) {
      // If no session, redirect to login page
      window.location.href = "/";
    }
  }, []);

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    if (!email || !password || !username) {
      setError("Please fill in all fields.");
      setLoading(false);
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get and store the Firebase Auth ID Token in a cookie
      const token = await getIdToken(user);
      Cookies.set("authToken", token, { expires: 7, secure: true }); // Set for 7 days

      setUsername("");
      setEmail("");
      setPassword("");
      window.location.href = "/dashboard";
    } catch (error) {
      setError(error.code === "auth/email-already-in-use" ? "This email is already in use." : "Error during signup.");
      console.error("Error during signup: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "500px", margin: "auto" }}>
      <Typography variant="h4" sx={{ marginBottom: "2rem", fontWeight: 600 }}>
        Create an account
      </Typography>

      {error && (
        <Typography variant="body2" sx={{ color: "var(--accent-color)", marginBottom: "1rem" }}>
          {error}
        </Typography>
      )}

      <InputField label="Username" type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
      <InputField label="Email" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <InputField label="Password" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />

      <AccentButton text="Sign up" padding="12px" onClick={handleSignup} disabled={loading} />

      <Typography variant="body2" sx={{ textAlign: "center", color: "var(--secondary-text)", marginTop: "1rem" }}>
        By clicking Sign up, you agree to our Terms of Use and Privacy Policy.
      </Typography>

      <OAuthButtons />

      <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
        <Typography variant="body2" sx={{ color: "var(--secondary-text)" }}>
          Already have an account?{" "}
          <Link href="/login" underline="hover" sx={{ color: "var(--accent-color)" }}>
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUpForm;
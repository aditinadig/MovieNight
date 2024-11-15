import { useState, useEffect } from "react";
import { Box, Typography, Link, Button, Stack } from "@mui/material";
import { signInWithEmailAndPassword, getIdToken, signInWithPopup } from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db, googleProvider } from "../../../firebaseConfig"; // Add googleProvider
import InputField from "../form/InputField.jsx";
import AccentButton from "../form/AccentButton.jsx";
import Cookies from "js-cookie";
import { FcGoogle } from 'react-icons/fc'; // Google icon from react-icons

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const authToken = Cookies.get("authToken");
    if (authToken) {
      window.location.href = "/"; // Redirect to home if already logged in
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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await getIdToken(userCredential.user);
      Cookies.set("authToken", token, { expires: 7, secure: true }); // Set cookie for 7 days

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

  const handleOAuthLogin = async (provider) => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const token = await getIdToken(user);
      Cookies.set("authToken", token, { expires: 7, secure: true }); // Store in cookie for 7 days

      // Check if the user exists in Firestore
      const usersRef = collection(db, "users");
      const querySnapshot = await getDocs(
        query(usersRef, where("UID", "==", user.uid))
      );
      if (querySnapshot.empty) {
        // Add the user to Firestore if not already added
        await addDoc(usersRef, {
          username: user.displayName || "Anonymous",
          email: user.email,
          UID: user.uid,
        });
      }

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error during OAuth login: ", error);
      setError("Error during OAuth login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: "500px", margin: "auto" }}>
      <Typography variant="h4" sx={{ marginBottom: "1.5rem", fontWeight: 600, color: "var(--primary-text)" }}>
        Welcome Back!
      </Typography>

      <InputField label="Email" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <InputField label="Password" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} marginbottom="0.5rem" required />

      {error && (
        <Typography variant="body2" sx={{ color: "var(--accent-color)", marginBottom: "1rem" }}>
          {error}
        </Typography>
      )}

      <AccentButton text="Login" padding="12px" onClick={handleLogin} disabled={loading} marginTop="1rem"/>

      <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
        <Button
          startIcon={<FcGoogle />}
          variant="outlined"
          onClick={() => handleOAuthLogin(googleProvider)}
          disabled={loading}
          sx={{
            flexGrow: 1,
            width: "100%",
            borderRadius: "24px",
            padding: "10px 30px",
            color: "var(--primary-text)",
            backgroundColor: "var(--primary-bg)",
            border: "1px solid var(--border)",
            textTransform: "none",
          }}
        >
          Google
        </Button>
      </Stack>

      <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
        <Typography variant="body2" sx={{ color: "var(--secondary-text)" }}>
          Don’t have an account?{" "}
          <Link href="/signup" underline="hover" sx={{ color: "var(--accent-color)" }}>
            Sign up
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
import { useState, useEffect } from "react";
import { Box, Typography, Link, Button, Stack } from "@mui/material";
import { createUserWithEmailAndPassword, getIdToken } from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db, googleProvider, signInWithPopup } from "../../../firebaseConfig"; // Ensure db is imported
import InputField from "../form/InputField.jsx";
import AccentButton from "../form/AccentButton.jsx";
import Cookies from "js-cookie";
import { FcGoogle } from 'react-icons/fc'; // Google icon from react-icons

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const authToken = Cookies.get("authToken");

    if (authToken) {
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
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Get and store the Firebase Auth ID Token in a cookie
      const token = await getIdToken(user);
      Cookies.set("authToken", token, { expires: 7, secure: true }); // Set for 7 days

      // Add the user to Firestore `users` collection
      const addDocResult = await addDoc(collection(db, "users"), {
        username: username,
        email: user.email,
        UID: user.uid,
      });

      console.log("User added to Firestore ", addDocResult);

      setUsername("");
      setEmail("");
      setPassword("");
      window.location.href = "/dashboard";
    } catch (error) {
      setError(
        error.code === "auth/email-already-in-use"
          ? "This email is already in use."
          : "Error during signup."
      );
      console.error("Error during signup: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Get and store the Firebase Auth ID Token in a cookie
      const token = await getIdToken(user);
      Cookies.set("authToken", token, { expires: 7, secure: true });

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
    <Box
      sx={{
        maxWidth: "500px",
        margin: "auto",
        cursor: loading ? "wait" : "default",
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: "2rem", fontWeight: 600 }}>
        Create an account
      </Typography>

      {error && (
        <Typography
          variant="body2"
          sx={{ color: "var(--accent-color)", marginBottom: "1rem" }}
        >
          {error}
        </Typography>
      )}

      <InputField
        label="Username"
        type="text"
        id="username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
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
        required
      />

      <AccentButton
        text="Sign up"
        padding="12px"
        onClick={handleSignup}
        disabled={loading}
      />

      <Typography
        variant="body2"
        sx={{
          textAlign: "center",
          color: "var(--secondary-text)",
          marginTop: "1rem",
        }}
      >
        By clicking Sign up, you agree to our Terms of Use and Privacy Policy.
      </Typography>

      {/* <OAuthButtons /> */}

      <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
        <Button
          startIcon={<FcGoogle />}
          variant="outlined"
          onClick={() => handleOAuthLogin(googleProvider)}
          disabled={loading}
          sx={{
            flexGrow: 1, // Make the button grow to fill its parent container
            width: "100%", // Ensure the button takes up 100% of its available space
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
        {/* <Button
          startIcon={<FaFacebookF />}
          variant="outlined"
          onClick={() => handleOAuthLogin(facebookProvider)}
          disabled={loading}
          sx={{
            flexGrow: 1, // Make the button grow to fill its parent container
            width: "100%", // Ensure the button takes up 100% of its available space
            borderRadius: "24px",
            padding: "10px 30px",
            color: "var(--primary-text)",
            backgroundColor: "var(--primary-bg)",
            border: "1px solid var(--border)",
            textTransform: "none",
          }}
        >
          Facebook
        </Button> */}
      </Stack>

      <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
        <Typography variant="body2" sx={{ color: "var(--secondary-text)" }}>
          Already have an account?{" "}
          <Link
            href="/login"
            underline="hover"
            sx={{ color: "var(--accent-color)" }}
          >
            Login
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default SignUpForm;

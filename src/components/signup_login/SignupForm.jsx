import { useState } from "react";
import { Box, Typography, Link } from "@mui/material";
import { collection, addDoc } from "firebase/firestore"; // Firestore methods
import bcrypt from "bcryptjs";
import { db, auth } from "../../../firebaseConfig"; // Ensure db and auth are correctly imported
import { createUserWithEmailAndPassword } from "firebase/auth"; // Firebase Auth functions
import InputField from "../form/InputField.jsx";
import OAuthButtons from "../form/OAuthButtons.jsx";
import AccentButton from "../form/accentButton.jsx";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // State to handle error messages

  const handleSignup = async () => {
    setLoading(true); // Show loading state while processing
    setError(""); // Clear previous error message
    try {
      // Create a new user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Hash the password for Firestore storage (optional, since Firebase stores password securely)
      const hashedPassword = await bcrypt.hash(password, 10);

      // Add a new document to the "users" collection in Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid, // Store user UID from Firebase Auth
        username: username,
        email: email,
        password: hashedPassword,
        createdAt: new Date(), // Optional: Timestamp for when the user signed up
      });

      console.log("User created with ID: ", user.uid);

      // Clear form fields after successful signup
      setUsername("");
      setEmail("");
      setPassword("");

      // Redirect to dashboard after successful signup
      window.location.href = "/dashboard"; // or window.location.replace("/dashboard");
    } catch (error) {
      // Handle specific Firebase auth errors
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already in use. Please try another one.");
      } else {
        setError("Error during signup. Please try again.");
      }
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

      {/* Display error message if it exists */}
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
      />
      <InputField
        label="Email"
        type="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        label="Password"
        type="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
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

      <OAuthButtons />

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
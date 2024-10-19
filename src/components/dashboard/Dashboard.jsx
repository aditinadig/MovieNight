import { useEffect } from "react";
import { auth } from "../../../firebaseConfig"; // Import Firebase auth

export default function Dashboard() {
  useEffect(() => {
    // Check for user authentication state and redirect if not authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        window.location.href = "/login"; // Redirect to login page if not authenticated
      }
    });


  }, []);

  // Render dashboard content
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the dashboard!</p>
    </div>
  );
}
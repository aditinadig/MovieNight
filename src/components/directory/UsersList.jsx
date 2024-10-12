import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../../../firebaseConfig"; // Import Firebase configuration

const db = getFirestore(app);

function UsersList() {
  const [users, setUsers] = useState([]); // State to store user data
  const [loading, setLoading] = useState(true); // State to show loading
  const [error, setError] = useState(null); // State to handle errors

  // Fetch users when component mounts
  useEffect(() => {
    async function fetchUsers() {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersArray = [];
        usersSnapshot.forEach((doc) => {
          usersArray.push({ id: doc.id, ...doc.data() });
        });
        setUsers(usersArray); // Set the users state with fetched data
      } catch (err) {
        console.error("Error fetching users:", err);
        setError(err.message); // Set the error state if there's an issue
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    }

    fetchUsers(); // Call the async function
  }, []); // Empty dependency array ensures it runs only once

  // Handle loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // Handle error state
  if (error) {
    return <p>Error: {error}</p>;
  }

  // Render users once loaded
  return (
    <ul>
      {users.length > 0 ? (
        users.map(user => (
          <li key={user.id}>{user.name} - {user.email}</li>
        ))
      ) : (
        <p>No users found.</p>
      )}
    </ul>
  );
}

export default UsersList;
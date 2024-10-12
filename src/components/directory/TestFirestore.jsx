import React, { useEffect } from 'react';
import { getFirestore, collection, getDocs } from "firebase/firestore";
import app from "../../../firebaseConfig"; // Firebase config

const db = getFirestore(app);

export default function TestFirestore() {
  useEffect(() => {
    const testFetch = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach((doc) => {
          console.log(`${doc.id} =>`, doc.data()); // Log the user data
        });
      } catch (error) {
        console.error("Error connecting to Firestore:", error);
      }
    };

    testFetch();
  }, []);

  return (
    <div>
      <h2>Firestore Test</h2>
      <p>Check console for output.</p>
    </div>
  );
}
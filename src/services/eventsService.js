import { db } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  query,
  where,
  and,
  or,
  getDoc,
  updateDoc,
} from "firebase/firestore";

const eventsCollectionRef = collection(db, "events");

export const fetchAllEvents = async () => {
  const snapshot = await getDocs(eventsCollectionRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const fetchEventById = async (eventId) => {
  const eventRef = doc(db, "events", eventId);
  const docSnap = await getDoc(eventRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

export const fetchEventsByCreator = async (creatorId) => {
  const creatorEventsQuery = query(
    eventsCollectionRef,
    where("creator", "==", creatorId)
  );
  const snapshot = await getDocs(creatorEventsQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const createEvent = async (eventData) => {
  const docRef = await addDoc(eventsCollectionRef, eventData);
  return { id: docRef.id, ...eventData };
};

export const fetchEventsByInvitee = async (inviteeId) => {
  const inviteeEventsQuery = query(
    eventsCollectionRef,
    where("invitees", "array-contains", inviteeId)
  );
  const snapshot = await getDocs(inviteeEventsQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const fetchEventsByUser = async (userId) => {
  const userEventsQuery = query(
    eventsCollectionRef,
    or(
      where("creator", "==", userId),
      where("invitees", "array-contains", userId)
    )
  );
  const snapshot = await getDocs(userEventsQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const voteForMovie = async (eventId, movieId, userId) => {
  try {
    // Reference the specific event document
    const eventDocRef = doc(db, "events", eventId);
    const eventSnapshot = await getDoc(eventDocRef);

    if (eventSnapshot.exists()) {
      const eventData = eventSnapshot.data();

      // Map through the movies array to update the votedBy field for the specific movie
      const updatedMovies = eventData.movies.map((movie) => {
        if (movie.tmdb_id === movieId) {
          // If votedBy array does not exist, initialize it
          const votedBy = movie.votedBy ? [...movie.votedBy, userId] : [userId];
          return { ...movie, votedBy: Array.from(new Set(votedBy)) }; // Ensure unique votes
        }
        return movie;
      });

      // Update the document with the modified movies array
      await updateDoc(eventDocRef, { movies: updatedMovies });

      console.log(
        `User ${userId} voted for movie ${movieId} in event ${eventId}`
      );
    } else {
      console.error("Event does not exist!");
    }
  } catch (error) {
    console.error("Error voting for movie:", error);
  }
}


  



import { db } from "../../../firebaseConfig";
import { collection, getDocs, addDoc, doc, query, where } from "firebase/firestore";

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

export const fetchEventsByUser = async (userId) => {
  const userEventsQuery = query(eventsCollectionRef, where("creator", "==", userId));
  const snapshot = await getDocs(userEventsQuery);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const createEvent = async (eventData) => {
  const docRef = await addDoc(eventsCollectionRef, eventData);
  return { id: docRef.id, ...eventData };
};
import { db } from "../../../firebaseConfig";
import { collection, getDocs, query, where, addDoc } from "firebase/firestore";

const usersCollectionRef = collection(db, "users");

export const fetchAllUsers = async () => {
  const snapshot = await getDocs(usersCollectionRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const fetchUserByEmail = async (email) => {
  const userQuery = query(usersCollectionRef, where("email", "==", email));
  const snapshot = await getDocs(userQuery);
  return snapshot.docs.length > 0 ? { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } : null;
};

export const createUser = async (userData) => {
  const docRef = await addDoc(usersCollectionRef, userData);
  return { id: docRef.id, ...userData };
};
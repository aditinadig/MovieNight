import { db } from "../../firebaseConfig";
import { collection, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";

const playlistsCollectionRef = collection(db, "playlists");

export const fetchAllPlaylists = async () => {
  const snapshot = await getDocs(playlistsCollectionRef);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const createPlaylist = async (playlistData) => {
  const docRef = await addDoc(playlistsCollectionRef, playlistData);
  return { id: docRef.id, ...playlistData };
};

export const updatePlaylist = async (id, updatedData) => {
  const docRef = doc(db, "playlists", id);
  await updateDoc(docRef, updatedData);
};

export const deletePlaylist = async (id) => {
  const docRef = doc(db, "playlists", id);
  await deleteDoc(docRef);
};
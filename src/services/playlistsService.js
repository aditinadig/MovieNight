import { db } from "../../firebaseConfig";
import { collection, query, where, getDocs, addDoc, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // Import Firebase Auth to get the current user's ID


const playlistsCollectionRef = collection(db, "playlists");

export const fetchPlaylistsByUser = async (userId) => {
  try {
    // Define the query
    const playlistsRef = collection(db, "playlists");
    const q = query(playlistsRef, where("userId", "==", userId)); // Filter playlists by userId

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Process the query snapshot and return playlists
    const playlists = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return playlists;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw error; // Rethrow error so the calling function can handle it
  }
};

// export const fetchPlaylistsByUser = async () => {
//   try {
//     // Get the current user ID
//     const auth = getAuth();
//     const userId = auth.currentUser?.uid;
    
//     if (!userId) {
//       throw new Error("User not authenticated");
//     }

//     const q = query(playlistsCollectionRef, where("userId", "==", userId));
//     const querySnapshot = await getDocs(q);
    
//     const playlists = [];
//     querySnapshot.forEach((doc) => {
//       playlists.push({ id: doc.id, ...doc.data() });
//     });

//     return playlists;
//   } catch (error) {
//     console.error("Error fetching playlists:", error);
//     throw error;  // Rethrow the error to be handled in Playlist.jsx or other components
//   }
// };

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
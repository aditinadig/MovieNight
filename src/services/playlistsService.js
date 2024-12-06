import { db } from "../../firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
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
    const playlists = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return playlists;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    throw error; // Rethrow error so the calling function can handle it
  }
};

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

export const fetchPlaylistNotContainingMovie = async (movieId) => {
  try {
    const playlists = await fetchAllPlaylists(); // Fetch all playlists
    const auth = getAuth();
    const userId = auth.currentUser.uid;

    // Filter playlists that belong to the current user
    const userPlaylists = playlists.filter(
      (playlist) => playlist.userId === userId
    );

    // Filter playlists that do NOT contain the given movieId
    const playlistsNotContainingMovie = userPlaylists.filter((playlist) => {
      // Ensure `movies` is an array and check if it contains the movieId
      const movies = playlist.movies || []; // Default to empty array if undefined
      const movieExists = movies.some((movie) => {
        if (typeof movie === "number") {
          return movie === movieId; // Handle case where movie is an ID
        }
        if (typeof movie === "object" && movie.id) {
          return movie.id === movieId; // Handle case where movie is an object
        }
        return false; // Fallback for unexpected cases
      });
      return !movieExists; // Include playlists where the movie does NOT exist
    });

    return playlistsNotContainingMovie;
  } catch (error) {
    console.error("Error fetching playlists:", error);
    return []; // Return an empty array in case of error
  }
};

export const addMoviesToPlaylist = async (playlistId, movies) => {
  try {
    const playlistRef = doc(db, "playlists", playlistId);

    // Fetch the current playlist document
    const playlistDoc = await getDoc(playlistRef);
    if (!playlistDoc.exists()) {
      throw new Error(`Playlist with ID ${playlistId} does not exist.`);
    }

    // Get current movies from the playlist or initialize to an empty array
    const currentMovies = playlistDoc.data().movies || [];

    // Prevent duplicates by checking existing movie IDs (assuming movies are objects with 'id' or 'tmdb_id')
    const movieIds = new Set(
      currentMovies.map((movie) => movie.id || movie.tmdb_id)
    );
    const newMovies = movies.filter(
      (movie) => !(movieIds.has(movie.id) || movieIds.has(movie.tmdb_id))
    );

    if (newMovies.length === 0) {
      console.warn(
        "No new movies to add. All provided movies are already in the playlist."
      );
      return;
    }

    // Update the playlist with new movies
    const updatedMovies = [...currentMovies, ...newMovies];
    await updateDoc(playlistRef, { movies: updatedMovies });

    console.log(
      `Successfully added ${newMovies.length} movie(s) to playlist ${playlistId}.`
    );
  } catch (error) {
    console.error("Error adding movies to playlist:", error.message);
    throw error;
  }
};

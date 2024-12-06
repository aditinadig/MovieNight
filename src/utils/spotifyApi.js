const SPOTIFY_TOKEN_URL = "https://accounts.spotify.com/api/token";
const SPOTIFY_SEARCH_URL = "https://api.spotify.com/v1/search";

const CLIENT_ID = "5a7e7dd5bf8741a3b2daf1ae4a47ed78"; // Replace with your Spotify Client ID
const CLIENT_SECRET = "60a1ea73712042d6a5d4d20f5d619cce"; // Replace with your Spotify Client Secret
const REDIRECT_URI = "http://localhost:4321/dashboard"; // Update with your app's redirect URI
const SPOTIFY_AUTH_URL = "http://localhost:4321/spotify-search";

let accessToken = null;
let tokenExpirationTime = 0;

// Fetch new access token
const fetchAccessToken = async () => {
  const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
  const encodedCredentials = btoa(credentials);

  try {
    const response = await fetch(SPOTIFY_TOKEN_URL, {
      method: "POST",
      headers: {
        Authorization: `Basic ${encodedCredentials}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
      }),
    });

    const data = await response.json();
    accessToken = data.access_token;
    tokenExpirationTime = Date.now() + data.expires_in * 1000;
  } catch (error) {
    console.error("Error fetching Spotify access token:", error);
    throw error;
  }
};

// Get valid access token (refresh if needed)
const getValidAccessToken = async () => {
  if (!accessToken || Date.now() > tokenExpirationTime) {
    await fetchAccessToken();
  }
  return accessToken;
};

// Generate Spotify login/auth URL
export const getSpotifyAuthUrl = () => {
  const scopes = [
    "user-read-private",
    "user-read-email",
    "playlist-read-private",
    "playlist-read-collaborative",
    "streaming",
  ];
  return `${SPOTIFY_AUTH_URL}?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
    REDIRECT_URI
  )}&scope=${scopes.join("%20")}`;
};

// Search Spotify
export const searchSpotify = async (query, type = "track", limit = 10) => {
  try {
    const token = await getValidAccessToken();

    const url = `${SPOTIFY_SEARCH_URL}?q=${encodeURIComponent(
      query
    )}&type=${type}&limit=${limit}`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error searching Spotify:", error);
    return null;
  }
};

// Fetch tracks for a specific album
export const fetchAlbumTracks = async (albumId) => {
  try {
    const response = await fetch(
      `https://api.spotify.com/v1/albums/${albumId}/tracks`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${await getValidAccessToken()}`,
        },
      }
    );

    const data = await response.json();
    if (!data || !data.items) {
      console.error("No tracks found for this album.");
      return [];
    }
    return data.items;
  } catch (error) {
    console.error("Error fetching album tracks:", error);
    return [];
  }
};
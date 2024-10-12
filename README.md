# Movie Night
The app allows users to organize fun movie nights by creating events, inviting friends, and voting on movies in real-time. It includes features like movie searches by genre, mood, or actor, custom playlists, and interactive games such as a Bingo-Scavenger Hunt for an enhanced movie-watching experience.

## Functionalities:

1. **Movie Search by Genre/Mood/Actor**
   * User searches movies by genre, mood, or actor via TMDb API.
   * Moods map to a certain genre: happy → comedy, romance. 
   * Since there isn't any direct endpoint to match movies with moods, a mapping must be created between moods and their corresponding genres and stored. Then, this mapping must be used to make API requests to TMDb API.

2. **Surprise Me Option - Random Movie Picker**
   * A user can get a random movie suggestion using the TMDb API.
   * It randomly selects based on a filter - genre/actor.

3. **Create Movie Night Events**
   * User creates an event, adds movies to the voting list, and invites friends.
   * Events include name, date, and movie list details.

4. **Real-Time Voting on Movies**
   * Participants can vote for movies in real time; implemented through Socket.IO.

5. **Customized Movie Playlists**
   * Users will be able to create movie playlists of their own (e.g., "80s Classics").

6. **Bingo Scavenger Hunt Game**
   * Users will be allowed to take part in a movie-themed Bingo-Scavenger Hunt during movie nights.
   * The bingo cards will show items to be done while watching the movie (e.g., "Spot a character wearing a red hat").
   * Players compete to mark items they see, with real-time updates of game progress.




# MovieNight App Setup Guide

This guide will help you set up the **MovieNight** app, which uses **Astro** for the frontend and **Firebase** for the backend (data storage and hosting).
The app uses a centralized Firebase database, so you don't need to set up your own Firebase instance. All data is stored in the project's central Firebase database.

## Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v12 or higher)
- A code editor like [VSCode](https://code.visualstudio.com/)

## 1. Clone the Repository

First, clone this repository to your local machine:
```bash
git clone https://github.com/your-username/MovieNight.git
cd MovieNight
```

## 2. Install Dependencies

Navigate into the project directory and install the required dependencies using npm:
```bash
npm install
```

This will install all the necessary dependencies for **Astro** and Firebase.

## 3. Firebase Setup (Already Configured)

This app is connected to a **central Firebase database**. You don't need to set up your own Firebase instance.

### Firebase Configuration

The app already includes the Firebase credentials for connecting to the central database. You do not need to modify or set up Firebase locally.

The configuration is located in `src/firebaseConfig.js`:
```javascript
// src/firebaseConfig.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
```
This configuration is pre-filled with the central Firebase project credentials.

## 4. Run the App Locally

To run the app in development mode, use the following command:
```bash
npm run dev
```

This will start the development server. Visit [http://localhost:3000](http://localhost:3000) in your browser to see the app.

## 5. Build the App for Production

To prepare the app for deployment, run:
```bash
npm run build
```

This command will build the app and place the output files in the `dist/` directory.

## 6. Deploy to Firebase Hosting (For Project Maintainers Only)

The app is deployed using Firebase Hosting. If you need to deploy a new version of the app, use the following command:
```bash
firebase deploy
```

This command will deploy the production build (in `dist/`) to Firebase Hosting, and the app will be accessible via the Firebase Hosting URL.

## Conclusion

Now you’re all set! You can run the **MovieNight** app locally and interact with the central Firebase database. No additional Firebase setup is needed for users.

Enjoy using the MovieNight app! If you have any questions or run into issues, feel free to open an issue on GitHub.

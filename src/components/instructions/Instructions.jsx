import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Button,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Instructions = () => {
  return (
    <Box sx={{ p: 4, maxWidth: "800px", margin: "0 auto" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", fontWeight: "bold" }}
      >
        About MovieNight App
      </Typography>
      <Typography
        variant="body1"
        gutterBottom
        sx={{ textAlign: "center", mb: 3 }}
      >
        Welcome to the MovieNight app! Plan your movie nights effortlessly with
        features like real-time voting, interactive games, and personalized
        playlists.
      </Typography>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Authentication
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper
            sx={{ p: 3, mb: 4, backgroundColor: "black", borderRadius: "8px" }}
          >
            <Typography
              variant="h4"
              sx={{ mb: 2, color: "lightgreen", fontWeight: "bold" }}
            >
              Auth Pages
            </Typography>
            <Typography
              variant="h6"
              sx={{ color: "white", mb: 1, fontWeight: "bold" }}
            >
              Credentials for Test Accounts :
            </Typography>
            <List sx={{ mb: 2 }}>
              <ListItem>
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontSize: "18px" }}
                >
                  1. Email: testuser1@gmail.com - Password: testuser1
                </Typography>
              </ListItem>
              <ListItem>
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontSize: "18px" }}
                >
                  2. Email: testuser2@gmail.com - Password: testuser2
                </Typography>
              </ListItem>
            </List>

            <Typography
              variant="h6"
              sx={{ color: "white", mb: 1, fontWeight: "bold" }}
            >
              Google OAuth Login/Signup :
            </Typography>

            <List sx={{ mb: 2 }}>
              <ListItem>
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontSize: "18px" }}
                >
                  1. Click the 'Sign in with Google' button on the login page.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontSize: "18px" }}
                >
                  2. Sign in with your Google account credentials (you can use
                  your personal Google account).
                </Typography>
              </ListItem>
              <ListItem>
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontSize: "18px" }}
                >
                  3. The app will authorize you to use Google OAuth, and you
                  will be redirected to the dashboard.
                </Typography>
              </ListItem>
            </List>
          </Paper>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Testing Real-Time Features
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper
            sx={{ p: 3, mb: 4, backgroundColor: "black", borderRadius: "8px" }}
          >
            <Typography
              variant="h4"
              sx={{ mb: 2, color: "lightgreen", fontWeight: "bold" }}
            >
              Testing Real-Time Features (Movie Voting)
            </Typography>
            <List sx={{ mb: 2 }}>
              <ListItem>
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}
                >
                  1. Open the app on two different systems (or two different
                  browsers on the same system).
                </Typography>
              </ListItem>
              <ListItem>
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}
                >
                  2. Log in with different test accounts.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}
                >
                  3. Navigate to 'All Events': Both users should go to the 'All
                  Events' page to see the same list of events.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}
                >
                  4. Vote for a movie: In one session, click 'Vote' for a movie
                  in a selected event. Observe that the vote count updates in
                  real-time in both sessions.
                </Typography>
              </ListItem>
            </List>
          </Paper>

          {/* Testing Real-Time Features (Bingo-Scavenger-Hunt Game) Section */}
          <Paper
            sx={{ p: 3, mb: 4, backgroundColor: "black", borderRadius: "8px" }}
          >
            <Typography
              variant="h4"
              sx={{ mb: 2, color: "lightgreen", fontWeight: "bold" }}
            >
              Testing Real-Time Features (Bingo-Scavenger-Hunt Game)
            </Typography>
            <List sx={{ mb: 2 }}>
              <ListItem>
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}
                >
                  1. Open the app on two different systems (or two different
                  browsers on the same system).
                </Typography>
              </ListItem>
              <ListItem>
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}
                >
                  2. Log in with different test accounts.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}
                >
                  3. Navigate to 'All Events': Both users should go to the 'All
                  Events' page to see the same list of events.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}
                >
                  4. Start/Join a Game: Click 'Start Bingo Game' in a selected
                  event in one session.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}
                >
                  5. In the other session, the button will be seen as 'Join
                  Bingo Game'.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography
                  variant="body1"
                  sx={{ color: "white", fontWeight: "bold", fontSize: "18px" }}
                >
                  6. Both users should be able to see each other's progress and
                  actions in real-time.
                </Typography>
              </ListItem>
            </List>
          </Paper>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            All Movies Section
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper
            sx={{ p: 3, mb: 4, backgroundColor: "black", borderRadius: "8px" }}
          >
            <Typography
              variant="h4"
              sx={{ mb: 2, color: "lightgreen", fontWeight: "bold" }}
            >
              All Movies Section
            </Typography>
            <Typography sx={{ fontWeight: "bold", color: "white", mb: 2 }}>
              You can search for movies using keywords or different keywords.
              The ‘Surprise Me’ button can be used for suggesting random movies.
            </Typography>
            <Typography sx={{ fontWeight: "bold", color: "white", mb: 2 }}>
              ‘Learn More’ can be used to get more details on the movie.
            </Typography>
            <Typography sx={{ fontWeight: "bold", color: "white", mb: 2 }}>
              To manage your playlists, go to the Playlists page to create,
              edit, or delete them, or navigate to the dashboard to add movies
              by selecting “+” and choosing a playlist from the dropdown. The
              playlist already containing the movies is not going to come up
              while adding movies.
            </Typography>
            <Typography sx={{ fontWeight: "bold", color: "white", mb: 0 }}>
              Extra Feature - The ‘Listen to songs’ button can be used to listen
              to that movie’s album songs from Spotify.
            </Typography>
            <List sx={{ color: "white", mb: 2 }}>
              <ListItem>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "16px" }}
                >
                  • A user can log into Spotify to listen to the full songs.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "16px" }}
                >
                  • A user can also listen to the preview of the songs without
                  logging in.
                </Typography>
              </ListItem>
              <ListItem>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", fontSize: "16px" }}
                >
                  • In order to test this - open the app in 2 different browsers
                  (do not use incognito) - log in to Spotify from one and do not
                  from the other.
                </Typography>
              </ListItem>
            </List>
          </Paper>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Create Event
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Paper
            sx={{ p: 3, mb: 4, backgroundColor: "black", borderRadius: "8px" }}
          >
            <Typography
              variant="h4"
              sx={{ mb: 2, color: "lightgreen", fontWeight: "bold" }}
            >
              Create Event
            </Typography>
            <Typography sx={{ fontWeight: "bold", color: "white", mb: 2 }}>
              An event can be created by title, date, and time - you can choose
              friends to invite and select movies, too. You can also edit the
              event later. Additionally, filters are available to customize
              event types.
            </Typography>
          </Paper>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
};

export default Instructions;

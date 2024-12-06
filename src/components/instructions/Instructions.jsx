import React from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Button } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const Instructions = () => {
  return (
    <Box sx={{ p: 4, maxWidth: "800px", margin: "0 auto" }}>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", fontWeight: "bold" }}>
        About MovieNight App
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ textAlign: "center", mb: 3 }}>
        Welcome to the MovieNight app! Plan your movie nights effortlessly with features like real-time voting, interactive games, and personalized playlists.
      </Typography>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Authentication
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" gutterBottom>
            You can log in using test accounts or your Google account.
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Test Account 1: Email: testuser1@gmail.com | Password: testuser1" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Test Account 2: Email: testuser2@gmail.com | Password: testuser2" />
            </ListItem>
            <ListItem>
              <ListItemText primary="Google OAuth Login/Signup:" secondary="Click 'Sign in with Google' and use your Google account credentials to log in or sign up." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Testing Real-Time Features
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" gutterBottom>
            Test real-time features like movie voting and the Bingo-Scavenger-Hunt game.
          </Typography>

          <Typography variant="h6" gutterBottom>
            Movie Voting
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Open the app on two different systems or browsers (e.g., Chrome and Firefox)." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Log in with different test accounts." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Vote for a movie in one session and see the vote count update in real-time in the other session." />
            </ListItem>
          </List>

          <Typography variant="h6" gutterBottom>
            Bingo-Scavenger-Hunt Game
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Open the app on two different systems or browsers." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Log in with different test accounts." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Start the game in one session, and join it in another session." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Play the game by clicking cards, and track the winner in the right-side panel." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Declare the winner, and see a congratulatory message or a 'better luck next time' message." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            All Movies Section
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" gutterBottom>
            Discover movies, create playlists, and listen to soundtracks.
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Search for movies using keywords or click 'Surprise Me' for random suggestions." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Click 'Learn More' for detailed information about a movie." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Manage Playlists:" secondary="Go to the Playlists page to create, edit, or delete playlists. Add movies to playlists directly from the dashboard." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Listen to Songs:" secondary="Preview songs from the movie’s soundtrack or log in to Spotify to listen to full songs." />
            </ListItem>
          </List>
          <Typography variant="body2" gutterBottom>
            Tip: Open the app in two browsers (one logged into Spotify, the other not) to test the song preview and login functionality.
          </Typography>
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Create Event
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body1" gutterBottom>
            Create movie night events, invite friends, and choose movies.
          </Typography>
          <List>
            <ListItem>
              <ListItemText primary="Add a title, date, and time for your event." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Invite friends and select movies." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Use filters to organize and find events easily." />
            </ListItem>
            <ListItem>
              <ListItemText primary="Edit your event details anytime." />
            </ListItem>
          </List>
        </AccordionDetails>
      </Accordion>

      
    </Box>
  );
};

export default Instructions;
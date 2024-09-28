// src/theme.js
import { createTheme } from '@mui/material/styles';

// Define your custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#ff6600', // Main orange color for buttons and other elements
    },
    secondary: {
      main: '#5a4b81', // Purple for category buttons
    },
    background: {
      default: '#1c1c24', // Dark background for the app
      paper: '#252530',  // Dark background for cards and similar components
    },
    text: {
      primary: '#ffffff', // White text for dark background
      secondary: '#9e9e9e', // Lighter text for descriptions
    },
  },
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '3rem',
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 500,
      fontSize: '1.75rem',
    },
    button: {
      textTransform: 'none', // Prevent buttons from being uppercased automatically
    },
  },
});

export default theme;
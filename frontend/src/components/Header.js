// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';

const Header = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
          Movie Night
        </Typography>
        <Button color="inherit" sx={{ color: 'white' }}>Home</Button>
        <Button color="inherit" sx={{ color: 'white' }}>Features</Button>
        <Button color="inherit" sx={{ color: 'white' }}>About Us</Button>
        <Button color="inherit" sx={{ color: 'white' }}>Login</Button>
        <Button variant="contained" sx={{ backgroundColor: '#ff6600', marginLeft: '10px' }}>Sign Up</Button>
        <Button variant="outlined" sx={{ marginLeft: '10px', color: '#ff6600', borderColor: '#ff6600' }}>Learn More</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
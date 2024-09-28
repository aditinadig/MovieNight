// src/components/Layout.js
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Box } from '@mui/material';

const Layout = ({ children }) => {
  return (
    <Box>
      <Header />
      <Box component="main" sx={{ minHeight: '100vh', padding: '0', margin: '0', backgroundColor: '#1c1c24' }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
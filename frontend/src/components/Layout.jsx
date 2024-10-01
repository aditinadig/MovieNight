// src/components/Layout.jsx
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Box } from '@chakra-ui/react';

const Layout = ({ children }) => {
  return (
    <Box>
      <Header />
      <Box as="main" minH="100vh" bg="#1c1c24" color="white">
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
// src/components/Footer.jsx
import React from 'react';
import { Box, Text } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="#15151c" py={6}>
      <Text color="white" textAlign="center">
        © 2023 Movie Night. All rights reserved.
      </Text>
    </Box>
  );
};

export default Footer;
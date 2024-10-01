// src/components/Header.jsx
import React from 'react';
import { Flex, Heading, Button, Box } from '@chakra-ui/react';

const Header = () => {
  return (
    <Box bg="#1c1c24" py={4}>
      <Flex justify="space-between" align="center" maxW="1200px" mx="auto" px={4}>
        <Heading as="h1" size="lg" color="white">
          Movie Night
        </Heading>
        <Flex gap="4">
          <Button variant="link" color="white">Home</Button>
          <Button variant="link" color="white">Features</Button>
          <Button variant="link" color="white">About Us</Button>
          <Button variant="link" color="white">Login</Button>
          <Button colorScheme="orange">Sign Up</Button>
          <Button variant="outline" colorScheme="orange">Learn More</Button>
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
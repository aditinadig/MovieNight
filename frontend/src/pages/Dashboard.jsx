// src/pages/Dashboard.js
import React from 'react';
import { Box, Heading, Text, Button, Grid, GridItem, Image, Flex } from '@chakra-ui/react';
import Layout from '../components/Layout';

const Dashboard = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <Flex justify="space-between" align="center" py={12} px={8}>
        <Box>
          <Heading as="h2" size="2xl" mb={4}>
            Discover the ultimate movie night experience!
          </Heading>
          <Text fontSize="xl" mb={6}>
            Join the fun tonight!
          </Text>
          <Button size="lg" colorScheme="orange">
            Get Started
          </Button>
        </Box>
        <Box>
          <Image src="/path/to/your-image.jpg" alt="Vibrant movie night landing" borderRadius="lg" />
        </Box>
      </Flex>

      {/* Plan Your Movie Night Section */}
      <Box py={12}>
        <Heading as="h3" size="lg" textAlign="center" mb={8}>
          Plan Your Movie Night
        </Heading>
        <Grid templateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={6} px={8}>
          {[
            { title: 'Organize Your Movie', description: 'Plan, Invite, Play', image: '/path/to/image1.jpg' },
            { title: 'Movie Night Fun', description: 'Event Planning Hub', image: '/path/to/image2.jpg' },
            { title: 'Epic Movie Nights', description: 'Exciting Features Await', image: '/path/to/image3.jpg' },
            { title: 'Lights, Camera, Action!', description: 'Event Planning Made Easy', image: '/path/to/image4.jpg' }
          ].map((item, index) => (
            <GridItem key={index} bg="#252530" borderRadius="lg" p={4}>
              <Image src={item.image || 'https://via.placeholder.com/150'} alt={item.title} borderRadius="lg" mb={4} />
              <Heading as="h4" size="md" color="orange.400" mb={2}>
                {item.title}
              </Heading>
              <Text>{item.description}</Text>
            </GridItem>
          ))}
        </Grid>
      </Box>

      {/* Movie Categories Section */}
      <Box py={12}>
        <Heading as="h3" size="lg" textAlign="center" mb={8}>
          Movie Categories
        </Heading>
        <Flex wrap="wrap" justify="center" gap={4} px={8}>
          {['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Fantasy', 'Musical', 'Mystery', 'Adventure', 'Documentary', 'Biography', 'Suspense', 'Animated'].map((category, index) => (
            <Button key={index} colorScheme="purple" size="md">
              {category}
            </Button>
          ))}
        </Flex>
      </Box>
    </Layout>
  );
};

export default Dashboard;
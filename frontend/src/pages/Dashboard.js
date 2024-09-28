// src/pages/Dashboard.js
import React from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, CardMedia } from '@mui/material';
import Layout from '../components/Layout';
import './Dashboard.css';  // Dashboard-specific styling

const Dashboard = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <Box className="hero-section" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ paddingLeft: '5%' }}>
          <Typography variant="h3" gutterBottom>
            Discover the ultimate movie night experience!
          </Typography>
          <Typography variant="subtitle1" gutterBottom>
            Join the fun tonight!
          </Typography>
          <Button variant="contained" sx={{ backgroundColor: '#ff6600', marginTop: '20px' }}>
            Get Started
          </Button>
        </Box>
        <Box>
          <img src="/path/to/your-image.jpg" alt="Vibrant movie night landing" className="hero-image" />
        </Box>
      </Box>

      {/* Plan Your Movie Night Section */}
      <Box sx={{ padding: '50px 0' }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#fff' }}>
          Plan Your Movie Night
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          {[
            { title: 'Organize Your Movie', description: 'Plan, Invite, Play', image: '/path/to/image1.jpg' },
            { title: 'Movie Night Fun', description: 'Event Planning Hub', image: '/path/to/image2.jpg' },
            { title: 'Epic Movie Nights', description: 'Exciting Features Await', image: '/path/to/image3.jpg' },
            { title: 'Lights, Camera, Action!', description: 'Event Planning Made Easy', image: '/path/to/image4.jpg' }
          ].map((item, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Card sx={{ backgroundColor: '#252530' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={item.image || 'https://via.placeholder.com/150'}
                  alt={item.title}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" sx={{ color: '#ff6600' }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Movie Categories Section */}
      <Box sx={{ padding: '50px 0', backgroundColor: '#1c1c24' }}>
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', color: '#fff' }}>
          Movie Categories
        </Typography>
        <Grid container spacing={2} justifyContent="center">
          {['Action', 'Comedy', 'Drama', 'Horror', 'Romance', 'Sci-Fi', 'Thriller', 'Fantasy', 'Musical', 'Mystery', 'Adventure', 'Documentary', 'Biography', 'Suspense', 'Animated'].map((category, index) => (
            <Grid item key={index}>
              <Button variant="contained" sx={{ backgroundColor: '#5a4b81', margin: '5px' }}>
                {category}
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Layout>
  );
};

export default Dashboard;
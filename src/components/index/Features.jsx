import { Box, Typography, Grid, Paper } from '@mui/material';
import { Movie, PlaylistAdd, SportsEsports } from '@mui/icons-material';

const features = [
  {
    title: 'Real-Time Movie Voting',
    description: 'Choose what you want to watch as a group. Movie with the most votes wins.',
    icon: <Movie />,
  },
  {
    title: 'Custom Playlists',
    description: 'Create a playlist of movies. You can add movies from any streaming service.',
    icon: <PlaylistAdd />,
  },
  {
    title: 'Interactive Games',
    description: 'Play games while you watch movies. Get Bingo and other interactive elements.',
    icon: <SportsEsports />,
  },
];

export default function Features(props) {
  return (
    <Box sx={{ padding: '4rem 2rem' }} className={props.className}>
      <Typography variant="h3" sx={{fontWeight: 600, mb: 4}}>
        Features
      </Typography>
      <Grid container spacing={3}>
        {features.map((feature, index) => (
          <Grid item key={index} xs={12} sm={6} md={4}>
            <Paper
              sx={{
                borderRadius: 'var(--border-radius)',
                padding: '2rem',
                backgroundColor: '#4B2C31',
                color: 'var(--primary-text)',
                display: 'flex',
                flexDirection: 'column',
                border: "0.5px solid var(--border)",
              }}
              elevation={3}
            >
              {feature.icon} 
              <Typography variant="h6" gutterBottom>
                {feature.title}
              </Typography>
              <Typography variant="body2" sx={{color: 'var(--secondary-text)'}}>
                {feature.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
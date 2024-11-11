import { Box, Typography } from '@mui/material';

export default function Footer(props) {
  return (
    
    <Box sx={{ padding: '1rem', textAlign: 'center', borderTop: "0.5px solid var(--border)" }} className={props.className}>
      <Typography variant="body2">
        &copy; 2024 Movie Night. All rights reserved.
      </Typography>
    </Box>
  );
}
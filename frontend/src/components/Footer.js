// src/components/Footer.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{ padding: '20px 0', textAlign: 'center', backgroundColor: '#15151c', color: '#fff' }}>
      <Typography variant="body2">
        © 2023 Movie Night. All rights reserved.
      </Typography>
    </Box>
  );
};

export default Footer;
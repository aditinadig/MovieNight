import { Button, Stack } from '@mui/material';
import { FcGoogle } from 'react-icons/fc'; // Google icon from react-icons
import { FaFacebookF } from 'react-icons/fa'; // Facebook icon from react-icons

const OAuthButtons = () => {
  return (
    <Stack direction="row" spacing={2} justifyContent="center" mt={2}>
      <Button
        startIcon={<FcGoogle />}
        variant="outlined"
        sx={{
          flexGrow: 1, // Make the button grow to fill its parent container
          width: '100%', // Ensure the button takes up 100% of its available space
          borderRadius: '24px',
          padding: '10px 30px',
          color: 'var(--primary-text)',
          backgroundColor: 'var(--primary-bg)',
          border: '1px solid var(--border)',
          textTransform: 'none',
        }}
      >
        Google
      </Button>
      <Button
        startIcon={<FaFacebookF />}
        variant="outlined"
        sx={{
          flexGrow: 1, // Make the button grow to fill its parent container
          width: '100%', // Ensure the button takes up 100% of its available space
          borderRadius: '24px',
          padding: '10px 30px',
          color: 'var(--primary-text)',
          backgroundColor: 'var(--primary-bg)',
          border: '1px solid var(--border)',
          textTransform: 'none',
        }}
      >
        Facebook
      </Button>
    </Stack>
  );
};

export default OAuthButtons;
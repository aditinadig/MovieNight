import React, { useState, useRef } from 'react';
import { TextField, IconButton, InputAdornment } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

const InputField = ({ label, type, id, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputRef = useRef(null); // Reference for the input element

  const handleClickShowPassword = () => {
    const inputElement = inputRef.current;
    const start = inputElement.selectionStart;
    const end = inputElement.selectionEnd;
    
    setShowPassword(!showPassword);
    
    // Use setTimeout to ensure the toggle happens before restoring the cursor position
    setTimeout(() => {
      inputElement.setSelectionRange(start, end); // Restore cursor position
    }, 0);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <TextField
      fullWidth
      label={label}
      type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
      id={id}
      inputRef={inputRef} // Attach the inputRef to this TextField
      variant="outlined"
      sx={{
        marginBottom: props.marginbottom?props.marginbottom:'1.5rem',
        '& .MuiInputBase-root': {
          color: 'var(--primary-text)',
          borderRadius: 'var(--border-radius)',
          backgroundColor: 'var(--primary-bg)', // Background color
        },
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'var(--border)', // Default border color
          },
          '&:hover fieldset': {
            borderColor: 'var(--accent-color)', // Border color on hover
          },
          '&.Mui-focused fieldset': {
            borderColor: 'var(--accent-color) !important', // Border color when focused
            borderWidth: '2px', // Optional border width
          },
        },
        '& input:-webkit-autofill': {
          WebkitBoxShadow: '0 0 0 1000px var(--primary-bg) inset !important',
          WebkitTextFillColor: 'var(--primary-text) !important',
        },
      }}
      InputProps={{
        endAdornment:
          type === 'password' ? (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                aria-label="toggle password visibility"
                sx={{ color: 'var(--primary-text)' }} // IconButton color set to primary-text
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : null,
      }}
      InputLabelProps={{
        style: { color: 'var(--primary-text)' },
      }}
      {...props}
    />
  );
};

export default InputField;
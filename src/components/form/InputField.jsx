import React, { useState, useRef } from "react";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const InputField = ({ label, type, id, required=false, ...props }) => {
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
      required={required}
      fullWidth
      label={type === "search" ? "": label}
      placeholder={type === "search" ? label: ""}
      type={type === "password" ? (showPassword ? "text" : "password") : type}
      id={id}
      inputRef={inputRef} // Attach the inputRef to this TextField
      variant="outlined"
      sx={{
        marginBottom: props.marginbottom ? props.marginbottom : "1.5rem",
        "& .MuiInputBase-root": {
          color: "var(--primary-text)",
          borderRadius: "var(--border-radius)",
          backgroundColor: "var(--primary-bg)", // Background color
        },
        "& .MuiOutlinedInput-root": {
          "& fieldset": {
            color: "var(--accent-color)",
            borderColor: "var(--border)", // Default border color
          },
          "&:hover fieldset": {
            color: "var(--accent-color)",
            borderColor: "var(--accent-color)", // Border color on hover
          },
          "&.Mui-focused fieldset": {
            color: "var(--accent-color)",
            borderColor: "var(--accent-color) !important", // Border color when focused
            borderWidth: "2px", // Optional border width
          },
        },
        "& input:-webkit-autofill": {
          WebkitBoxShadow: "0 0 0 1000px var(--primary-bg) inset !important",
          WebkitTextFillColor: "var(--primary-text) !important",
        },
      }}
      InputProps={{
        endAdornment:
          type === "password" ? (
            <InputAdornment position="end">
              <IconButton
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge="end"
                aria-label="toggle password visibility"
                sx={{ color: "var(--primary-text)" }} // IconButton color set to primary-text
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : 
          type === "search" ? (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                aria-label="search"
                sx={{ color: "var(--primary-text)" }} // IconButton color set to primary-text
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </IconButton>
            </InputAdornment>
          ) : null,
      }}
      InputLabelProps={{
        style: { color: "var(--primary-text)" },
      }}
      {...props}
    />
  );
};

export default InputField;

import { Button, Stack, Box, Typography } from "@mui/material";

export default function Header() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        borderBottom: "0.5px solid var(--border)",
      }}
    >
      <Typography variant="h5" component="h1">
        Movie<span style={{ color: "var(--accent-color)" }}>Night</span>
      </Typography>
      <Stack direction="row" spacing={2}>
        <Button
          variant="text"
          sx={{ color: "var(--primary-text)", borderRadius: "20px" }}
        >
          Home
        </Button>
        <Button
          variant="text"
          sx={{ color: "var(--primary-text)", borderRadius: "20px" }}
        >
          Features
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "var(--accent-color)",
            color: "var(--primary-bg)",
            borderRadius: "20px",
          }}
        >
          Login
        </Button>
        <Button
          variant="outlined"
          sx={{
            borderColor: "var(--accent-color)",
            color: "var(--accent-color)",
            borderRadius: "20px",
          }}
        >
          Sign Up
        </Button>
      </Stack>
    </Box>
  );
}

import React from "react";
import { Card, CardMedia, CardContent, Typography, Box, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function MovieCardSelected({ id, title, image, onRemove }) {
  if (typeof onRemove !== 'function') {
    console.error("onRemove prop is not a function:", onRemove);
  }

  return (
    <Card
      sx={{
        backgroundColor: "var(--card-bg)", // Background color
        color: "var(--primary-text)", // Text color
        borderRadius: "var(--border-radius)", // Border radius
        overflow: "hidden",
        height: "11rem",
        display: "flex",
        flexDirection: "column", // Ensure content stacks vertically
        position: "relative", // To position delete button
      }}
    >
      {/* Movie Image */}
      <CardMedia
        component="img"
        image={image}
        alt={title}
        sx={{
          height: "5rem", // Set a fixed height for the image
          objectFit: "cover", // Ensure the image covers the container without distortion
        }}
      />

      {/* Movie Details */}
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end", // Align the content at the bottom
        }}
      >
        <Typography
          variant="h7"
          sx={{
            fontWeight: "600",
            color: "var(--primary-text)",
            lineHeight: "1.2",
          }}
        >
          {title}
        </Typography>
      </CardContent>

      {/* Delete Button */}
      <IconButton
        onClick={() => onRemove(id)} // Call onRemove with the movie ID
        sx={{
          position: "absolute",
          top: 5,
          right: 5,
          color: "var(--accent-color)",
          backgroundColor: "var(--primary-bg)",
          "&:hover": {
            backgroundColor: "var(--secondary-bg)",
          },
        }}
      >
        <DeleteIcon />
      </IconButton>
    </Card>
  );
}
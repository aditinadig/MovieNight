import React from "react";
import { Card, CardMedia, CardContent, Typography, Box } from "@mui/material";

export default function MovieCardSelected({ id, title, image }) {
  return (
    <Card
      sx={{
        backgroundColor: "var(--card-bg)", // Background color
        color: "var(--primary-text)", // Text color
        borderRadius: "var(--border-radius)", // Border radius
        overflow: "hidden",
        height: "8rem",
        display: "flex",
        flexDirection: "column", // Ensure content stacks vertically
      }}
    >
      {/* Movie Image */}
      <CardMedia
        component="img"
        image={image}
        alt={title}
        sx={{
          height: "1.5rem", // Set a fixed height for the image
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
    </Card>
  );
}

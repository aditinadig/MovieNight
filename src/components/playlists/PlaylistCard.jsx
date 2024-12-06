import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Avatar,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const PlaylistCard = ({ playlist, handleEdit, handleDelete }) => {
  return (
    <Card
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: 2,
        backgroundColor: "var(--card-bg)",
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "scale(1.02)",
          boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.4)",
        },
      }}
    >
      {/* Left Section: Playlist Avatar */}
      <Box
        sx={{
          flex: 0.5, // Reduce the width of the flex space for the avatar
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Avatar
          sx={{
            backgroundColor: "var(--secondary-bg)",
            width: 48,
            height: 48,
            mr: 2,
          }}
        >
          {playlist.name.charAt(0).toUpperCase()} {/* First letter of playlist */}
        </Avatar>
      </Box>

      {/* Center Section: Playlist Name and Movies */}
      <Box
        sx={{
          flex: 3,
          overflow: "hidden",
          color: "var(--secondary-text)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            color: "var(--primary-text)",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "150px",
          }}
        >
          {playlist.name}
        </Typography>

        {playlist.movies && playlist.movies.length > 0 ? (
          playlist.movies.map((movie, index) => (
            <Typography
              key={index}
              variant="body2"
              sx={{ display: "inline-block", marginRight: 1 }}
            >
              {typeof movie === "object" && movie.title ? movie.title : movie}
              {index < playlist.movies.length - 1 && ","}
            </Typography>
          ))
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: "var(--secondary-text)",
              fontStyle: "italic",
            }}
          >
            No movies in this playlist.
          </Typography>
        )}
      </Box>

      {/* Right Section: Action Buttons */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        {/* Edit Button */}
        <Tooltip title="Edit Playlist" arrow>
          <IconButton
            onClick={() => handleEdit(playlist)}
            sx={{
              color: "var(--primary-text)",
              "&:hover": { color: "var(--secondary-text)" },
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>

        {/* Delete Button */}
        <Tooltip title="Delete Playlist" arrow>
          <IconButton
            onClick={() => handleDelete(playlist.id)}
            sx={{
              color: "#FF6666",
              "&:hover": { color: "#FF3333" },
              marginLeft: 1,
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </Box>
    </Card>
  );
};

export default PlaylistCard;
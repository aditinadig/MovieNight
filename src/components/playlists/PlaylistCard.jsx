import React from "react";
import { Card, CardContent, Typography, Box, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit"; // You can change this to your preferred icon
import DeleteIcon from "@mui/icons-material/Delete"; // Import Delete icon


const PlaylistCard = ({ playlist, handleEdit, handleDelete }) => {

    return (
    <Card sx={{ width: "100%", backgroundColor: "var(--card-bg)", padding: 2 }}>
      <CardContent>
        <Typography variant="h5" gutterBottom sx={{ color: "white" }}>
          {playlist.name}
        </Typography>
        
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
          <IconButton onClick={() => handleEdit(playlist)} sx={{ color: "white" }}>
            <EditIcon />
          </IconButton>
          {/* Delete Button */}
          <IconButton onClick={() => handleDelete(playlist.id)} sx={{ color: "#FF6666" }}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PlaylistCard;

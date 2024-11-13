import React from "react";
import { Card, CardContent, Typography, Box } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const UserCard = ({ username, email }) => {
  return (
    <Card
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 2,
        boxShadow: "none",
        borderRadius: "16px",
        backgroundColor: "var(--primary-bg)",
        color: "var(--primary-text)",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 100,
          height: 100,
          borderRadius: "50%",
          backgroundColor: "var(--secondary-bg)", // Background for icon
          mb: 1,
        }}
      >
        <AccountCircleIcon
          sx={{ fontSize: 60, color: "var(--primary-text)" }}
        />
      </Box>
      <CardContent
        sx={{ textAlign: "center", padding: 0, "&:last-child": { pb: 0 } }}
      >
        <Typography
          variant="h6"
          sx={{ fontWeight: 600, color: "var(--primary-text)" }}
        >
          {username}
        </Typography>
        <Box display="flex" alignItems="center" justifyContent="center">
          <Typography variant="body2" sx={{ color: "var(--secondary-text)" }}>
            @{email? email.split("@")[0]:''} {/* Displaying the part before the "@" */}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserCard;

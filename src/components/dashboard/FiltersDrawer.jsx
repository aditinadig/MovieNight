import React from "react";
import { Box } from "@mui/material";

const FiltersDrawer = () => {
  return (
    <Box
      sx={{
        width: "100%",
        mt: 4,
        mb: 8,
        backgroundColor: "var(--secondary-bg)",
        borderRadius: "var(--border-radius)",
        pr: 4,
        pl: 4,
        pb: 4,
      }}
    >
      {/* Drawer Content */}
      <h2>Filters</h2>

      {/* Filter options go here */}
    </Box>
  );
};

export default FiltersDrawer;

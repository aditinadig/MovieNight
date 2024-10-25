import React, { useState } from "react";
import Box from "@mui/material/Box";
import InputField from "./InputField";

const SearchField = ({ onSearchChange }) => {
  const [input, setInput] = useState("");

  const handleInputChange = (e) => {
    const query = e.target.value;
    setInput(query);
    onSearchChange(query); // Call the callback with the search query
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <InputField
        label="Search..."
        type="search"
        id="MovieSearch"
        marginbottom="1.5rem"
        value={input}
        onChange={handleInputChange}
      />
    </Box>
  );
};

export default SearchField;
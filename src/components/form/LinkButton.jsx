import { Button } from "@mui/material";

const LinkButton = ({ text, navigateTo, onClick, ...props }) => {
  return (
    <Button
      variant="text"
      onClick={onClick}
      href={navigateTo}
      sx={{
        borderColor: "var(--primary-text)",
        color: "var(--primary-text)",
        padding: props.padding ? props.padding : "0.5rem 1rem", // Default padding
        minWidth: "fit-content", // Ensure the width fits the content
        width: "fit-content", // Fit the content dynamically
        whiteSpace: "nowrap", // Prevent text from wrapping
        textTransform: "none", // Prevent automatic text capitalization by MUI
      }}
    >
      {text}
    </Button>
  );
};

export default LinkButton;
import { Button } from "@mui/material";

const AccentButton = ({ text, navigateTo, onClick, ...props }) => {
  return (
    <Button
      variant="contained"
      {...(navigateTo ? { href: navigateTo } : { onClick })}
      sx={{
        backgroundColor: "#F1A7A0",
        color: "var(--primary-bg)",
        padding: props.padding ? props.padding : "",
        width: props.width ? props.width : "100%",
      }}
    >
      {text}
    </Button>
  );
};

export default AccentButton;

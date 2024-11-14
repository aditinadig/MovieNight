import { Button } from "@mui/material";

const AccentButton = ({ text, navigateTo, onClick, ...props }) => {
  return (
    <Button
      variant="contained"
      {...(navigateTo ? { href: navigateTo } : { onClick })}
      sx={{
        backgroundColor: "var(--accent-color)",
        color: "var(--primary-bg)",
        padding: props.padding ? props.padding : "",
        width: props.width ? props.width : "100%",
        marginBottom: props.marginBottom ? props.marginBottom : "",
      }}
    >
      {text}
    </Button>
  );
};

export default AccentButton;

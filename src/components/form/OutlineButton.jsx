import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const OutlineButton = ({ text, navigateTo, onClick, ...props }) => {

  return (
    <Button
      variant="outlined"
      onClick={onClick}
      href={navigateTo}
      sx={{
        borderColor: "var(--accent-color)",
        color: "var(--accent-color)",
        padding: props.padding ? props.padding : "",
        width: props.width ? props.width : "100%",
        margin: props.margin ? props.margin : "",
      }}
    >
      {text}
    </Button>
  );
};

export default OutlineButton;

import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const OutlineButton = ({ text, navigateTo, onClick, ...props }) => {

  return (
    <Button
      variant="outlined"
      onClick={onClick}
      href={navigateTo}
      sx={{
        borderColor: "#50C878",
        color: "#50C878",
        padding: props.padding ? props.padding : "",
        width: props.width ? props.width : "100%",
      }}
    >
      {text}
    </Button>
  );
};

export default OutlineButton;

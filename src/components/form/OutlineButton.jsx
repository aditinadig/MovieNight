import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const OutlineButton = ({ text, navigateTo, onClick, ...props }) => {

  return (
    <Button
      variant="outlined"
      onClick={onClick}
      href={navigateTo}
      sx={{
        borderColor: "var(--primary-text)",
        color: "var(--primary-text)",
        padding: props.padding ? props.padding : "",
        width: props.width ? props.width : "100%",
        margin: props.margin ? props.margin : "",
        height: "2.3rem",
        marginBottom: props.marginBottom ? props.marginBottom : "",
        marginTop: props.marginTop ? props.marginTop : "",
      }}
    >
      {text}
    </Button>
  );
};

export default OutlineButton;

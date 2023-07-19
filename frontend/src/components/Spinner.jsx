import CircularProgress from "@mui/material/CircularProgress";

function Spinner(props) {
  const { color, size } = props;
  return (
    <CircularProgress
      color={color ? color : "inherit"}
      size={size ? size : 20}
    />
  );
}

export default Spinner;

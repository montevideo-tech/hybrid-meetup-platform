import React, { useState, forwardRef } from "react";
import { useDispatch } from "react-redux";
import { SnackbarAlert } from "../reducers/roomSlice";
import MuiAlert from "@mui/material/Alert";
import { Snackbar } from "@mui/material";

function SnackbarComponent(props) {
  const { message, severity, onClose } = props;
  const dispatch = useDispatch();
  const [open, setOpen] = useState(true);

  const Alert = forwardRef((props, ref) => (
    <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
  ));

  Alert.displayName = "SnackbarAlert";

  const closeSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    onClose && onClose();
    dispatch(SnackbarAlert({ error: undefined }));
    setOpen(false);
  };

  return (
    <Snackbar open={open} onClose={closeSnackbar}>
      <Alert
        onClose={closeSnackbar}
        severity={severity ? severity : "error"}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default SnackbarComponent;

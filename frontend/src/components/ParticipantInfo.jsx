import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";

function ParticipantInfo(props) {
  const { name, parentHeight } = props;

  let height = "40px";
  let fontSize = "14px";
  if (parentHeight <= 250) {
    height = "30px";
  }
  if (parentHeight <= 200) {
    height = "20px";
    fontSize = "10px";
  }
  if (parentHeight <= 90) {
    height = "15px";
    fontSize = "10px";
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        bottom: "0",
        left: "0",
        width: "100%",
        height: { height },
        color: "transparent",
        backgroundColor: "transparent",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography
        variant="h6"
        fontWeight="700"
        fontSize={fontSize}
        color="white"
      >
        {name}
      </Typography>
    </div>
  );
}

ParticipantInfo.propTypes = {
  name: PropTypes.string,
  parentHeight: PropTypes.number,
};

ParticipantInfo.defaultProps = {
  name: "",
  parentHeight: 40,
};

export default ParticipantInfo;

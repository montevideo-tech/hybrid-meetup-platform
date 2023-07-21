import React from "react";
import PropTypes from "prop-types";
import { Typography } from "@mui/material";
import styled from "styled-components";
import { Colors } from "../themes/colors";

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
    <Container $height={height}>
      <Typography
        variant="h6"
        fontWeight="700"
        fontSize={fontSize}
        color={Colors.white}
      >
        {name}
      </Typography>
    </Container>
  );
}

ParticipantInfo.propTypes = {
  name: PropTypes.string,
};

ParticipantInfo.defaultProps = {
  name: "",
};

export default ParticipantInfo;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: ${(props) => props.$height};
  color: transparent;
  background-color: transparent;
  justify-content: center;
  align-items: center;
`;

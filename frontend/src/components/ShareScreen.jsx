import React, { ReactNode } from "react";
import PropTypes from "prop-types";
import Video from "./Video";
import styled from "styled-components";

function ShareScreen(props) {
  const { children, width } = props;

  return (
    <Container>
      <StyledVideo stream={children.videoStream} $width={width} />
    </Container>
  );
}

ShareScreen.propTypes = {
  children: ReactNode,
  width: PropTypes.string,
};

ShareScreen.defaultProps = {
  children: [],
  width: "500px",
};

export default ShareScreen;

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  position: relative;
`;

const StyledVideo = styled(Video)`
  height: 100%;
  max-width: 100%;
  width: ${(props) => props.$width};
  margin: 0px auto;
`;

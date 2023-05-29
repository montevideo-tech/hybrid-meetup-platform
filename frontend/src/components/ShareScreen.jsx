import React, { ReactNode } from "react";
import PropTypes from "prop-types";
import Video from "./Video";
import styled from "styled-components";

function ShareScreen(props) {
  const { children, height } = props;

  return (
    <Container>
      <Video
        style={{
          height: `calc(${height}px - 180px)`,
          margin: "0px auto",
        }}
        stream={children.videoStream}
        isScreenShared
      />
    </Container>
  );
}

ShareScreen.propTypes = {
  children: ReactNode,
  height: PropTypes.string,
};

ShareScreen.defaultProps = {
  children: [],
  height: "500px",
};

export default ShareScreen;

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  position: relative;
`;

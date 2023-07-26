import React from "react";
import Video from "./Video";
import styled from "styled-components";

function ShareScreen(props) {
  const { children } = props;

  return (
    <Container>
      <Video
        style={{
          height: "calc(100vh - 350px)",
          margin: "0px auto",
        }}
        stream={children.videoStream}
        isScreenShared
      />
    </Container>
  );
}

export default ShareScreen;

const Container = styled.div`
  display: flex;
  height: 100%;
  width: 100%;
  justify-content: center;
  position: relative;
`;
